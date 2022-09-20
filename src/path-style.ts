import type {LineLayer} from 'react-map-gl';

const MAX_ZOOM_LEVEL = 9;
// map.addSource('route', {
//   'type': 'geojson',
//   'data': {
//       'type': 'Feature',
//       'properties': {},
//       'geometry': {
//           'type': 'LineString',
//           'coordinates': [

//                     ]
//       }
//   }
// });

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
    "line-color" : "green",
    "line-width" : 10,
  }
};
