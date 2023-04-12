import { useEffect, useRef, useState } from 'react';

// UI
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
} from '@chakra-ui/react'

// React Google Maps API
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  InfoWindow,
  DirectionsRenderer,
} from '@react-google-maps/api'

// Constants
import {
  route1,
  GOOGLE_MAPS_LIBRARIES,
  WALKING_DIRECTIONS_RENDERER_OPTIONS
} from '../../constants';

// Images
import BusStopIcon from '../../images/bus-stop.png';

// Interfaces
import { IBusStop, ICoords, IRoute } from '../../interfaces';

// Components
import AutocompleteInput from '../AutocompleteInput/AutocompleteInput';

const center = { lat: 42.87450384044511, lng: -8.550545894973958 };
const finalPoint = [42.87346711380447, -8.554817486782008];

interface CustomDirectionsWaypoint extends google.maps.DirectionsWaypoint {
  name: string;
  location: google.maps.LatLng;
}

const Map = (props: any) => {

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
    libraries: GOOGLE_MAPS_LIBRARIES,
  })

  const [position, setPosition] = useState<GeolocationPosition | null>(null);

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsResponse1, setDirectionsResponse1] = useState<google.maps.DirectionsResult | null>(null);
  const [directionsResponse2, setDirectionsResponse2] = useState<google.maps.DirectionsResult | null>(null);
  const [directionsResponse3, setDirectionsResponse3] = useState<google.maps.DirectionsResult | null>(null);

  const [waypoints, setWaypoints] = useState<CustomDirectionsWaypoint[]>([]);

  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  const [selectedRoute, setSelectedRoute] = useState<IRoute | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<CustomDirectionsWaypoint | null>(null);

  const originRef = useRef<HTMLInputElement>(null)
  const destiantionRef = useRef<HTMLInputElement>(null)

  const onLoad = (map: google.maps.Map) => setMap(map)

  function findClosestPoint(array: IBusStop[], point: ICoords) {
    let closestPointIndex = 0;
    let minDistance = calculateDistance(array[closestPointIndex].location, point);
    let closestPoint = array[0].location;

    for (let i = 1; i < array.length; i++) {
      const currentPoint = array[i].location;
      const currentDistance = calculateDistance(currentPoint, point);
      if (currentDistance < minDistance) {
        closestPoint = currentPoint;
        closestPointIndex = i;
        minDistance = currentDistance;
      }
    }

    return { closestPoint, closestPointIndex };
  }

  function calculateDistance(point1: ICoords, point2: ICoords) {
    const dx = point1[0] - point2[0];
    const dy = point1[1] - point2[1];
    return Math.sqrt(dx * dx + dy * dy);
  }

  async function calculateRoute(startingPoint: ICoords, endPoint: ICoords) {
    // if (!originRef.current || !destiantionRef.current) {
    //   return;
    // }

    // if (originRef.current.value === '' || destiantionRef.current.value === '') {
    //   return
    // }

    const { closestPoint: closestStartingBusStop, closestPointIndex: closestStartingBusStopIndex } = findClosestPoint(route1.route, startingPoint);
    const { closestPoint: closestEndBusStop, closestPointIndex: closestEndBusStopIndex } = findClosestPoint(route1.route, endPoint);

    if (!position) {
      return;
    }

    const directionsService = new google.maps.DirectionsService()

    // Walking 1
    const results1 = await directionsService.route({
      origin: new google.maps.LatLng(startingPoint[0], startingPoint[1]),
      destination: new google.maps.LatLng(closestStartingBusStop[0], closestStartingBusStop[1]),
      travelMode: google.maps.TravelMode.WALKING
    })

    const distance1 = results1.routes[0].legs[0].distance?.text;
    setDirectionsResponse1(results1);

    let isReversedWaypoints = false;

    if (closestEndBusStopIndex < closestStartingBusStopIndex) {
      isReversedWaypoints = true;
    }

    let slicedWaypoints: CustomDirectionsWaypoint[] = [];

    if (isReversedWaypoints) {
      slicedWaypoints = waypoints.slice(closestEndBusStopIndex, closestStartingBusStopIndex).reverse();
    } else {
      slicedWaypoints = waypoints.slice(closestStartingBusStopIndex, closestEndBusStopIndex);
    }

    console.log(slicedWaypoints);

    // Walking 3
    const results3 = await directionsService.route({
      origin: new google.maps.LatLng(closestEndBusStop[0], closestEndBusStop[1]),
      destination: new google.maps.LatLng(endPoint[0], endPoint[1]),
      travelMode: google.maps.TravelMode.WALKING
    })

    const distance3 = results3.routes[0].legs[0].distance?.text;
    setDirectionsResponse3(results3);

    // Driving 2
    const results2 = await directionsService.route({
      origin: new google.maps.LatLng(closestStartingBusStop[0], closestStartingBusStop[1]),
      destination: new google.maps.LatLng(closestEndBusStop[0], closestEndBusStop[1]),
      waypoints: slicedWaypoints.map(({ name, ...waypoint }) => { return waypoint }),
      travelMode: google.maps.TravelMode.DRIVING
    })

    const distance2 = results2.routes[0].legs[0].distance?.text;
    setDirectionsResponse2(results2)
    // setDistance(distance);
    // setDuration(results2.routes[0].legs[0].duration?.text || "");
  }

  useEffect(() => {
    if (!window.google) {
      return;
    }

    setSelectedRoute(route1);

  }, [isLoaded])

  useEffect(() => {
    if (!selectedRoute) {
      return;
    }

    const busStops = route1.route;

    const newWaypoints = busStops.slice(1, busStops.length - 1).map(({ name, location }) => {
      return {
        name,
        location: new google.maps.LatLng(location[0], location[1]),
        stopover: false
      }
    });

    setWaypoints(newWaypoints);

    const watchId = navigator.geolocation.watchPosition(
      position => setPosition(position),
      error => console.error(error)
    );

    return () => navigator.geolocation.clearWatch(watchId);

  }, [selectedRoute])

  function findClosestPointForCurrentPosition() {
    if (!position) {
      return;
    }

    console.log(findClosestPoint(route1.route, [position.coords.latitude, position.coords.longitude]), route1.route.length);
    console.log(findClosestPoint(route1.route, [finalPoint[0], finalPoint[1]]), route1.route.length);
  }

  // const getStrokeColor = (legs?: google.maps.DirectionsLeg[]) => {
  //   const colors: Record<string, string> = {
  //     DRIVING: '#FF0000', // Red
  //     WALKING: '#008000', // Green
  //     BICYCLING: '#0000FF', // Blue
  //     TRANSIT: '#FFA500', // Orange
  //   };

  //   return colors[leg?.steps[0]?.travel_mode] || '#000000';
  // };

  // const options: google.maps.DirectionsRendererOptions = {
  //   polylineOptions: {
  //     strokeColor: getStrokeColor(directionsResponse?.routes[0]?.legs),
  //   },
  // };

  return (
    <>
      {
        isLoaded ? <>
          <AutocompleteInput placeholder='Origin' ref={originRef} />
          <AutocompleteInput placeholder='Destination' ref={destiantionRef} />
          <Button onClick={() => calculateRoute([position?.coords.latitude!, position?.coords.longitude!], [finalPoint[0], finalPoint[1]])}>Calculate</Button>
          <Button onClick={findClosestPointForCurrentPosition}>Closest point for current pos</Button>

          <GoogleMap
            center={center}
            zoom={15}
            mapContainerStyle={{ width: '100%', height: '500px' }}
            options={{
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: true,
            }}
            onLoad={onLoad}
          >
            {
              map && <>
                {

                  directionsResponse1 && (
                    <DirectionsRenderer directions={directionsResponse1} options={WALKING_DIRECTIONS_RENDERER_OPTIONS} />
                  )
                }
                {
                  directionsResponse3 && (
                    <DirectionsRenderer directions={directionsResponse3} options={WALKING_DIRECTIONS_RENDERER_OPTIONS} />
                  )
                }
                {
                  directionsResponse2 && (
                    <DirectionsRenderer directions={directionsResponse2} options={{
                      polylineOptions: {
                        strokeColor: "#FFA500",
                      },
                      suppressMarkers: false,
                      markerOptions: {
                        icon: {
                          url: BusStopIcon,
                          scaledSize: new google.maps.Size(20, 20),
                          anchor: new google.maps.Point(0, 20) // adjust as needed
                        },
                      },
                    }} />
                  )
                }
                {
                  selectedMarker && (
                    <InfoWindow position={selectedMarker.location} onCloseClick={() => setSelectedMarker(null)} >
                      <div>{selectedMarker.name}</div>
                    </InfoWindow>
                  )
                }
                {position?.coords && (
                  <Marker position={
                    {
                      lat: position?.coords.latitude,
                      lng: position?.coords.longitude
                    }
                  }></Marker>
                )}
              </>
            }
          </GoogleMap>
          <p>{distance}</p>
          <p>{duration}</p>
        </> : "Map is loading..."
      }
    </>
  );
};

export default Map;
