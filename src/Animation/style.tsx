import type { LayerProps } from "react-map-gl";

export const animLayer: LayerProps = {
  id: "point",
  source: "point",
  type: "symbol",
  layout: {
    "icon-image": "airport-15",
    "icon-size": 2,
    "icon-rotate": ["get", "bearing"],
    "icon-rotation-alignment": "map",
    "icon-allow-overlap": true,
    "icon-ignore-placement": true,
  },
};
