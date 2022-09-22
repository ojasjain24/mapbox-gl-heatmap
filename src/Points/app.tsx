import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import { createRoot } from "react-dom/client";
import Map, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
} from "react-map-gl";

import ControlPanel from "./control-panel";
import Pin from "./pin";

const TOKEN =
  "pk.eyJ1IjoiYm9ja28iLCJhIjoiY2prbXFyaTdtMmVsODN2bnh1ZDJzeGoxZCJ9.X6eR9wy5MGukv2c3BwGxOQ"; // Set your mapbox token here

export default function Pointer() {
  const [popupInfo, setPopupInfo] = useState(null);
  const [path, setPath] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/varanasi/bin")
      .then((resp) => resp.json())
      .then((json) => {
        setPath(json);
      })
      .catch((err) => console.error("Could not load data", err));
  }, []);

  return (
    <>
      {path.map((city, index) => {
        return (
          <Marker
          key={`marker-${index}`}
            longitude={city["longitude"]}
            latitude={city["latitude"]}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setPopupInfo(city);
            }}
          >
            <Pin />
          </Marker>
        );
      })}

      {/* <Popup
        anchor="top"
        longitude={Number(popupInfo.longitude)}
        latitude={Number(popupInfo.latitude)}
        onClose={() => setPopupInfo(null)}
      >
        <div>
          {popupInfo.longitude}, {popupInfo.longitude} |{" "}
        </div>
        <img width="100%" src={popupInfo.image} />
      </Popup> */}
    
    </>
  );
}
