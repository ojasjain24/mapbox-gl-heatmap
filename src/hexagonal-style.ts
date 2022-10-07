import type {LayerProps} from 'react-map-gl';

export const hexagonalLayer: LayerProps = {
    id: 'crashesHexGrid',
    type: 'fill',
    source: 'hexGrid',
    layout: {},
    paint: {
      'fill-color': {
        property: 'bin',
        stops:[
            [0, "#feebe2"],
            [1, "#fcc5c0"],
            [2, "#fa9fb5"],
            [3, "#f768a1"],
            [4, "#dd3497"],
            [5, "#ae017e"],
            [6, "#7a0177"],
          ]
      },
      'fill-opacity': 0.6
    }
  }