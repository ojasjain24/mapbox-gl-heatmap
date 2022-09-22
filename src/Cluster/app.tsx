import * as React from "react";
import { useRef, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Map, Source, Layer } from "react-map-gl";

import ControlPanel from "./control-panel";
import {
  clusterLayer,
  clusterCountLayer,
  unclusteredPointLayer,
} from "./layers";

import type { MapRef } from "react-map-gl";
import type { GeoJSONSource } from "react-map-gl";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYm9ja28iLCJhIjoiY2prbXFyaTdtMmVsODN2bnh1ZDJzeGoxZCJ9.X6eR9wy5MGukv2c3BwGxOQ"; // Set your mapbox token here

export default function Cluster() {
  const mapRef = useRef<MapRef>(null);
  const [path, setPath] = useState(null);

  // const onClick = event => {
  //   const feature = event.features[0];
  //   const clusterId = feature.properties.cluster_id;

  //   const mapboxSource = mapRef.current.getSource('earthquakes') as GeoJSONSource;

  //   mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
  //     if (err) {
  //       return;
  //     }

  //     mapRef.current.easeTo({
  //       center: feature.geometry.coordinates,
  //       zoom,
  //       duration: 500
  //     });
  //   });
  // };

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/varanasi/bin")
      .then((resp) => resp.json())
      .then((json) => {
        setPath({
          type: "FeatureCollection",
          crs: {
            type: "name",
            properties: {
              name: "urn:ogc:def:crs:OGC:1.3:CRS84",
            },
          },
          features: [
            json.map((val) => {
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
          ],
        });
      })
      .catch((err) => console.error("Could not load data", err));
  }, []);

  console.log(path);
  return (
    <>
      <Source
        id="earthquakes"
        type="geojson"
        data={path}
        cluster={true}
        clusterMaxZoom={14}
        clusterRadius={50}
      >
        <Layer {...clusterLayer} />
        <Layer {...clusterCountLayer} />
        <Layer {...unclusteredPointLayer} />
      </Source>
    </>
  );
}
