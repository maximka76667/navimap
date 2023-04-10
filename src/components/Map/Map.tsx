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

// AIzaSyCugbGc3zbK27-z6YRcwJlZlZ6JAWZca3Q

console.log(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

const center = { lat: 42.87450384044511, lng: -8.550545894973958 };

interface CustomDirectionsWaypoint extends google.maps.DirectionsWaypoint {
  name: string;
  location: google.maps.LatLng;
}

const Map = (props: any) => {

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
    libraries: ['places'],
  })

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsResponse1, setDirectionsResponse1] = useState<google.maps.DirectionsResult | null>(null);
  const [directionsResponse2, setDirectionsResponse2] = useState<google.maps.DirectionsResult | null>(null);

  const [waypoints, setWaypoints] = useState<CustomDirectionsWaypoint[]>([]);

  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  const [selectedMarker, setSelectedMarker] = useState<CustomDirectionsWaypoint | null>(null);

  const originRef = useRef<HTMLInputElement>(null)
  const destiantionRef = useRef<HTMLInputElement>(null)

  const originRef2 = useRef<HTMLInputElement>(null)
  const destiantionRef2 = useRef<HTMLInputElement>(null)

  async function calculateRoute() {
    if (!originRef.current || !destiantionRef.current) {
      return;
    }

    if (originRef.current.value === '' || destiantionRef.current.value === '') {
      return
    }

    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()
    const results1 = await directionsService.route({
      // origin: originRef.current.value,
      // destination: destiantionRef.current.value,
      // // eslint-disable-next-line no-undef
      // travelMode: google.maps.TravelMode.DRIVING,

      // [-8.552961940162687, 42.87341293411154],
      //           [-8.551182481326894, 42.8749081257974],
      //           [-8.55035056828158, 42.87544688695417],
      //           [-8.547783614106944, 42.87642081723467],
      origin: new google.maps.LatLng(42.87341293411154, -8.552961940162687),
      destination: new google.maps.LatLng(42.87642081723467, -8.547783614106944),
      waypoints: waypoints.map(({ name, ...waypoint }) => { return waypoint }),
      travelMode: google.maps.TravelMode.DRIVING
    })

    setDirectionsResponse1(results1)

    if (results1 == null || results1 == undefined) {
      return;
    }

    if (!results1.routes) {
      return;
    }

    const distance = results1.routes[0].legs[0].distance?.text || "";

    setDistance(distance);
    setDuration(results1.routes[0].legs[0].duration?.text || "");

    if (!originRef2.current || !destiantionRef2.current) {
      return;
    }

    if (originRef2.current.value === '' || destiantionRef2.current.value === '') {
      return
    }

    const results2 = await directionsService.route({
      origin: originRef2.current.value,
      destination: destiantionRef2.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    })

    setDirectionsResponse2(results2)

  }

  useEffect(() => {
    if (!window.google) {
      return;
    }

    const newWaypoints = [
      {
        name: "Parada 1",
        location: new google.maps.LatLng(42.87544688695417, -8.55035056828158),
        stopover: false,
      }
    ];

    setWaypoints(newWaypoints);

  }, [window.google])

  useEffect(() => {
    console.log(waypoints.map((waypoint) => { return { location: waypoint.location } }));
  }, [waypoints])

  return (
    <>
      {isLoaded ? <><Autocomplete>
        <Input type='text' placeholder='Origin' value={"Turismo de Santiago, Rúa do Vilar, Santiago de Compostela, España"} ref={originRef} />
      </Autocomplete>
        <Autocomplete>
          <Input
            type='text'
            placeholder='Destination'
            value={"Santiago de Compostela, España"}
            ref={destiantionRef}
          />
        </Autocomplete>
        <Autocomplete>
          <Input type='text' placeholder='Origin2' ref={originRef2} />
        </Autocomplete>
        <Autocomplete>
          <Input
            type='text'
            placeholder='Destination2'
            ref={destiantionRef2}
          />
        </Autocomplete>
        <Button onClick={calculateRoute}>Calculate</Button>
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
          onLoad={map => setMap(map)}
        >
          <Marker position={center} />
          {directionsResponse1 && (
            <DirectionsRenderer directions={directionsResponse1} />
          )}
          {directionsResponse2 && (
            <DirectionsRenderer directions={directionsResponse2} />
          )}
          {waypoints && waypoints.map((waypoint) => {
            return <Marker label={waypoint.name} position={waypoint.location as google.maps.LatLng} onClick={() => setSelectedMarker(waypoint)}></Marker>
          })}
          {selectedMarker && (
            <InfoWindow position={selectedMarker.location} onCloseClick={() => setSelectedMarker(null)}>
              {/* <div>{selectedMarker.name}</div> */}
            </InfoWindow>
          )}
        </GoogleMap></> : "Map is loading"}
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
