// import { Map as PigeonMaps, Marker, GeoJson } from "pigeon-maps";
// import { maptiler } from "pigeon-maps/providers";

// const maptilerProvider = maptiler("eUiw0ywy36om1CkHb3VF", "streets");

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

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  InfoWindow,
  DirectionsRenderer,
} from '@react-google-maps/api'
import { useEffect, useRef, useState } from 'react';

import { route1 } from '../../const';
import BusStopIcon from '../../images/bus-stop.png';

// const geoJsonSample = {
//   type: "FeatureCollection",
//   features: [
//     {
//       type: "Feature",
//       geometry: {
//         type: "Point",
//         coordinates: [-8.550545894973958, 42.87450384044511],
//       },
//     },
//     {
//       type: "Feature",
//       geometry: {
//         type: "LineString",
//         coordinates: [
//           [-8.552961940162687, 42.87341293411154],
//           [-8.551182481326894, 42.8749081257974],
//           [-8.55035056828158, 42.87544688695417],
//           [-8.547783614106944, 42.87642081723467],
//         ],
//       },
//     },
//   ],
// };

const center = { lat: 42.87450384044511, lng: -8.550545894973958 };
const finalPoint = [42.87346711380447, -8.554817486782008];

interface CustomDirectionsWaypoint extends google.maps.DirectionsWaypoint {
  name: string;
  location: google.maps.LatLng;
}

const Map = (props: any) => {

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
    libraries: ['places'],
  })

  const [position, setPosition] = useState<GeolocationPosition | null>(null);

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsResponse1, setDirectionsResponse1] = useState<google.maps.DirectionsResult | null>(null);
  const [directionsResponse2, setDirectionsResponse2] = useState<google.maps.DirectionsResult | null>(null);
  const [directionsResponse3, setDirectionsResponse3] = useState<google.maps.DirectionsResult | null>(null);

  const [waypoints, setWaypoints] = useState<CustomDirectionsWaypoint[]>([]);

  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  const [selectedRoute, setSelectedRoute] = useState<number[][] | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<CustomDirectionsWaypoint | null>(null);

  const originRef = useRef<HTMLInputElement>(null)
  const destiantionRef = useRef<HTMLInputElement>(null)

  const onLoad = (map: google.maps.Map) => setMap(map)

  function findClosestPoint(array: Array<[number, number]>, point: [number, number]) {
    let closestPointIndex = 0;
    let minDistance = calculateDistance(array[closestPointIndex], point);
    let closestPoint = array[0];

    for (let i = 1; i < array.length; i++) {
      const currentPoint = array[i];
      const currentDistance = calculateDistance(currentPoint, point);
      if (currentDistance < minDistance) {
        closestPoint = currentPoint;
        closestPointIndex = i;
        minDistance = currentDistance;
      }
    }

    return { closestPoint, closestPointIndex };
  }

  function calculateDistance(point1: [number, number], point2: [number, number]) {
    const dx = point1[0] - point2[0];
    const dy = point1[1] - point2[1];
    return Math.sqrt(dx * dx + dy * dy);
  }

  async function calculateRoute(startingPoint: [number, number], endPoint: [number, number]) {
    // if (!originRef.current || !destiantionRef.current) {
    //   return;
    // }

    // if (originRef.current.value === '' || destiantionRef.current.value === '') {
    //   return
    // }

    const { closestPoint: closestStartingBusStop, closestPointIndex: closestStartingBusStopIndex } = findClosestPoint(route1, startingPoint);
    const { closestPoint: closestEndBusStop, closestPointIndex: closestEndBusStopIndex } = findClosestPoint(route1, endPoint);


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

    // Walking 3
    const results3 = await directionsService.route({
      origin: new google.maps.LatLng(closestEndBusStop[0], closestEndBusStop[1]),
      destination: new google.maps.LatLng(endPoint[0], endPoint[1]),
      travelMode: google.maps.TravelMode.WALKING
    })

    const distance3 = results3.routes[0].legs[0].distance?.text;
    setDirectionsResponse3(results3);
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

    const newWaypoints = route1.slice(1, route1.length - 1).map((stop) => {
      return {
        name: "",
        location: new google.maps.LatLng(stop[0], stop[1]),
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

    console.log(findClosestPoint(route1 as [number, number][], [position.coords.latitude, position.coords.longitude]), route1.length);
    console.log(findClosestPoint(route1 as [number, number][], [finalPoint[0], finalPoint[1]]), route1.length);
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
          <Autocomplete>
            <Input type='text' placeholder='Origin' ref={originRef} />
          </Autocomplete>
          <Autocomplete>
            <Input
              type='text'
              placeholder='Destination'
              ref={destiantionRef}
            />
          </Autocomplete>
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
                    <DirectionsRenderer directions={directionsResponse1} options={{
                      suppressMarkers: true
                    }} />
                  )
                }
                {
                  directionsResponse2 && (
                    <DirectionsRenderer options={{
                      polylineOptions: {
                        strokeColor: "#FFA500",
                      },
                      suppressMarkers: false,
                      markerOptions: {
                        icon: {
                          url: BusStopIcon,
                          scaledSize: new window.google.maps.Size(20, 20),
                          anchor: new window.google.maps.Point(0, 20) // adjust as needed
                        },
                      },
                    }} directions={directionsResponse2} />
                  )
                }
                {
                  directionsResponse3 && (
                    <DirectionsRenderer directions={directionsResponse3} options={{
                      suppressMarkers: true
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
          <p>{position?.coords.latitude}</p>
          <p>{position?.coords.longitude}</p>
        </> : "Map is loading"
      }
    </>
    // <PigeonMaps
    //   provider={maptilerProvider}
    //   height={isFullScreen ? 750 : 500}
    //   defaultCenter={[42.87, -8.55]}
    //   defaultZoom={15}
    // >
    //   <GeoJson
    //     data={geoJsonSample}
    //     styleCallback={(feature: any, hover: any) => {
    //       if (feature.geometry.type === "LineString") {
    //         return {strokeWidth: "4", stroke: "black" };
    //       }
    //       return {
    //         fill: "#d4e6ec99",
    //         strokeWidth: "1",
    //         stroke: "white",
    //         r: "20",
    //       };
    //     }}
    //   />
    //   <Marker width={40} anchor={[42.87341293411154, -8.552961940162687]} />
    //   <Marker width={40} anchor={[42.87642081723467, -8.547783614106944]} />
    // </PigeonMaps >
  );
};

export default Map;
