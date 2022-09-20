import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import MapGL, { Source, Layer } from "react-map-gl";
import ControlPanel from "./control-panel";
import { heatmapLayer } from "./map-style";
import { lineLayer } from "./path-style";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYm9ja28iLCJhIjoiY2prbXFyaTdtMmVsODN2bnh1ZDJzeGoxZCJ9.X6eR9wy5MGukv2c3BwGxOQ"; // Set your mapbox token here

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
  const coordinates = [
    [-122.483696, 37.833818],
    [-122.483482, 37.833174],
    [-122.483396, 37.8327],
    [-122.483568, 37.832056],
    [-122.48404, 37.831141],
    [-122.48404, 37.830497],
    [-122.483482, 37.82992],
    [-122.483568, 37.829548],
    [-122.48507, 37.829446],
    [-122.4861, 37.828802],
    [-122.486958, 37.82931],
    [-122.487001, 37.830802],
    [-122.487516, 37.831683],
    [-122.488031, 37.832158],
    [-122.488889, 37.832971],
    [-122.489876, 37.832632],
    [-122.490434, 37.832937],
    [-122.49125, 37.832429],
    [-122.491636, 37.832564],
    [-122.492237, 37.833378],
    [-122.493782, 37.833683],
  ];

  const [allDays, useAllDays] = useState(true);
  const [timeRange, setTimeRange] = useState([0, 0]);
  const [selectedTime, selectTime] = useState(0);
  const [earthquakes, setEarthQuakes] = useState(null);
  const [path, setPath] = useState(null);

  useEffect(() => {
    /* global fetch */
    fetch("https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson")
      .then((resp) => resp.json())
      .then((json) => {
        // Note: In a real application you would do a validation of JSON data before doing anything with it,
        // but for demonstration purposes we ingore this part here and just trying to select needed data...
        const features = json.features;
        const endTime = features[0].properties.time;
        const startTime = features[features.length - 1].properties.time;

        setTimeRange([startTime, endTime]);
        setEarthQuakes(json);
        selectTime(endTime);
      })
      .catch((err) => console.error("Could not load data", err)); // eslint-disable-line
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/varanasi/bin")
      .then((resp) => resp.json())
      .then((json) => {
        setPath({
          type: "feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: json.map((val) => {
              return [val["latitude"], val["longitude"]];
            }),
          },
        });
        console.log(typeof path);
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
          longitude: 82.48,
          latitude: 25.83,
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
