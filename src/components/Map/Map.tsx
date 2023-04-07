import { Map as PigeonMaps, Marker, GeoJson } from "pigeon-maps";
import { maptiler } from "pigeon-maps/providers";

const maptilerProvider = maptiler("eUiw0ywy36om1CkHb3VF", "streets");

const geoJsonSample = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-8.550545894973958, 42.87450384044511],
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [-8.552961940162687, 42.87341293411154],
          [-8.551182481326894, 42.8749081257974],
          [-8.55035056828158, 42.87544688695417],
          [-8.547783614106944, 42.87642081723467],
        ],
      },
    },
  ],
};

const Map = ({ isFullScreen }: { isFullScreen: boolean }) => {
  return (
    <PigeonMaps
      provider={maptilerProvider}
      height={isFullScreen ? 750 : 500}
      defaultCenter={[42.87, -8.55]}
      defaultZoom={15}
    >
      <GeoJson
        data={geoJsonSample}
        styleCallback={(feature: any, hover: any) => {
          if (feature.geometry.type === "LineString") {
            return { strokeWidth: "4", stroke: "black" };
          }
          return {
            fill: "#d4e6ec99",
            strokeWidth: "1",
            stroke: "white",
            r: "20",
          };
        }}
      />
      <Marker width={40} anchor={[42.87341293411154, -8.552961940162687]} />
      <Marker width={40} anchor={[42.87642081723467, -8.547783614106944]} />
    </PigeonMaps>
  );
};

export default Map;
