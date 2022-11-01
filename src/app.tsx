import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import MapGL, { Source, Layer } from "react-map-gl";
import Cluster from "./Cluster/app";
import ControlPanel from "./control-panel";
import { heatmapLayer } from "./map-style";
import { lineLayer } from "./path-style";
import { hexagonalLayer } from "./hexagonal-style";
import Pointer from "./Points/app";
import Anim from "./Animation/AnimatedPath";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYm9ja28iLCJhIjoiY2prbXFyaTdtMmVsODN2bnh1ZDJzeGoxZCJ9.X6eR9wy5MGukv2c3BwGxOQ";

function filterFeaturesByDay(featureCollection, time) {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const features = featureCollection.features.filter((feature) => {
    const featureDate = new Date(feature.properties.time);
    return (
      featureDate.getFullYear() === year &&
      featureDate.getMonth() === month &&
      featureDate.getDate() === day
    );
  });
  return { type: "FeatureCollection", features };
}

export default function App() {
  const [allDays, useAllDays] = useState(true);
  const [timeRange, setTimeRange] = useState([0, 0]);
  const [selectedTime, selectTime] = useState(0);
  const [earthquakes, setEarthQuakes] = useState(null);
  const [path, setPath] = useState(null);
  const [hex, setHex] = useState(null);

  // useEffect(() => {
  //   fetch("https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson")
  //     .then((resp) => resp.json())
  //     .then((json) => {
  //       const features = json.features;
  //       const endTime = features[0].properties.time;
  //       const startTime = features[features.length - 1].properties.time;

  //       setTimeRange([startTime, endTime]);
  //       setEarthQuakes(json);
  //       selectTime(endTime);
  //     })
  //     .catch((err) => console.error("Could not load data", err));
  // }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/varanasi/bin")
      .then((resp) => resp.json())
      .then((json) => {
        setEarthQuakes({
          type: "FeatureCollection",
          crs: {
            type: "name",
            properties: {
              name: "urn:ogc:def:crs:OGC:1.3:CRS84",
            },
          },
          features: json.map((val) => {
            return {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Point",
                coordinates: [
                  val["longitude"],
                  val["latitude"],
                  Math.random() * 70,
                ],
              },
            };
          }),
        });
      })
      .catch((err) => console.error("Could not load data", err));
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/varanasi/bin")
      .then((resp) => resp.json())
      .then((json) => {
        setPath({
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: json.map((val) => {
              return [val["longitude"], val["latitude"]];
            }),
          },
        });
      })
      .catch((err) => console.error("Could not load data", err));
  }, []);

  useEffect(() => {
    fetch(
      "https://gist.githubusercontent.com/clhenrick/378cfcf38c6011f8e132419e9e4177df/raw/73d3b1411d21d9ae92dfcc5ae65b9abc7be79ae0/processed.json"
    )
      .then((resp) => resp.json())
      .then((json) => {
        setHex(json);
      })
      .catch((err) => console.error("Could not load data", err));
  }, []);

  const data = useMemo(() => {
    return allDays
      ? earthquakes
      : filterFeaturesByDay(earthquakes, selectedTime);
  }, [earthquakes, allDays, selectedTime]);

  return (
    <>
      <Anim />

      <MapGL
        initialViewState={{
          longitude: 82.99697,
          latitude: 25.35382,
          zoom: 10,
        }}
        interactiveLayerIds={["pathMap"]}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {data && (
          <Source type="geojson" data={data}>
            <Layer {...heatmapLayer} />
          </Source>
        )}

        <Source id="route" type="geojson" data={path}>
          <Layer {...lineLayer} />
        </Source>

        <Source id="hexGrid" type="geojson" data={hex}>
          <Layer {...hexagonalLayer} />
        </Source>

        <Source
          id="radar"
          type="image"
          url="https://docs.mapbox.com/mapbox-gl-js/assets/radar.gif"
          coordinates={[
            [-80.425, 46.437],
            [-71.516, 46.437],
            [-71.516, 37.936],
            [-80.425, 37.936],
          ]}
        >
          <Layer source="radat" id="radar-layer" type="raster" />
        </Source>

        <Pointer />
        <Cluster />
      </MapGL>
      {/* <ControlPanel
        startTime={timeRange[0]}
        endTime={timeRange[1]}
        selectedTime={selectedTime}
        allDays={allDays}
        onChangeTime={selectTime}
        onChangeAllDays={useAllDays}
      /> */}
    </>
  );
}

export function renderToDom(container) {
  createRoot(container).render(<App />);
}
