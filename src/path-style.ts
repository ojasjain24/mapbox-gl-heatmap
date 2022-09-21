import type {LineLayer} from 'react-map-gl';

const MAX_ZOOM_LEVEL = 20;
export const lineLayer: LineLayer = {
  id: 'pathMap',
  maxzoom: MAX_ZOOM_LEVEL,
  type: 'line',
  source : 'route',
  layout : {
    'line-join': 'round',
    'line-cap': 'round'
  },
  paint: {
    "line-color" : "grey",
    "line-width" : 1,
  }
};
