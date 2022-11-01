import * as React from "react";
import { useRef, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import MapGL, { Source, Layer } from "react-map-gl";
import * as turf from "@turf/turf";
import type { MapRef } from "react-map-gl";
import { Marker } from "react-map-gl";
import type { GeoJSONSource } from "react-map-gl";
import { animLayer } from "./style";
import { lineLayer } from "../path-style";
const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYm9ja28iLCJhIjoiY2prbXFyaTdtMmVsODN2bnh1ZDJzeGoxZCJ9.X6eR9wy5MGukv2c3BwGxOQ";

export default function Anim() {
  const origin = [115, -32];
  const destination = [150, -34];

  const [route, setRoute] = useState({
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [origin, destination],
        },
      },
    ],
  });

  console.log(route);
  const [point, setPoint] = useState({
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: origin,
        },
      },
    ],
  });

  var line = turf.lineString([
    [115, -32],
    [131, -22],
    [143, -25],
    [150, -34],
  ]);

  var length = turf.length(line, { units: "miles" });

  const arc = [];

  const steps = 400;

  

  var start = turf.point(origin);
  var end = turf.point(destination);

  let counter = 0;

  function animate() {
    for (let i = 0; i < length; i += length / steps) {
      const segment = turf.along(line, i);
      arc.push(segment.geometry.coordinates);
    }

    if (counter < steps) {
      requestAnimationFrame(animate);
    }

    counter = counter + 1;
  }

  useEffect(() => {
    animate();
    setPoint({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: arc,
          },
        },
      ],
    });
  },[]);

  return (
    <>
      <MapGL
        initialViewState={{
          longitude: 82.99697,
          latitude: 25.35382,
          zoom: 1,
        }}
        interactiveLayerIds={["pathMap"]}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <Marker key={0} longitude={115} latitude={-32} />
        <Marker key={1} longitude={150} latitude={-34} />
        <Source type="geojson" data={route}>
          <Layer {...lineLayer} />
        </Source>
        <Source type="geojson" data={point}>
          <Layer {...animLayer} />
        </Source>
      </MapGL>
    </>
  );
}
