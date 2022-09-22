import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import MapGL, { Source, Layer } from "react-map-gl";
import Cluster from "./Cluster/app";
import ControlPanel from "./control-panel";
import { heatmapLayer } from "./map-style";
import { lineLayer } from "./path-style";
import Pointer from "./Points/app";

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

  useEffect(() => {
    fetch("https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson")
      .then((resp) => resp.json())
      .then((json) => {
        const features = json.features;
        const endTime = features[0].properties.time;
        const startTime = features[features.length - 1].properties.time;

        setTimeRange([startTime, endTime]);
        setEarthQuakes(json);
        selectTime(endTime);
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

  const data = useMemo(() => {
    return allDays
      ? earthquakes
      : filterFeaturesByDay(earthquakes, selectedTime);
  }, [earthquakes, allDays, selectedTime]);

  return (
    <>
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
        {/* {data && (
          <Source type="geojson" data={data}>
            <Layer {...heatmapLayer} />
          </Source>
        )}

        <Source id="route" type="geojson" data={path}>
          <Layer {...lineLayer} />
        </Source>
        <Pointer/> */}
        <Cluster />
      </MapGL>
      <ControlPanel
        startTime={timeRange[0]}
        endTime={timeRange[1]}
        selectedTime={selectedTime}
        allDays={allDays}
        onChangeTime={selectTime}
        onChangeAllDays={useAllDays}
      />
    </>
  );
}

export function renderToDom(container) {
  createRoot(container).render(<App />);
}
