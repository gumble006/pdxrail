const railLineColors = {
  Red: 'red',
  Green: 'green',
  Blue: 'blue',
  Orange: 'orange',
  Yellow: 'yellow',
  WES: '#fff', 
  'A Loop': '#da0962',
  'B Loop': '#0091b3',
  'NS Line': '#95c11f',
};

// map feature padding
export const fitBoundsParams = {
  paddingTopLeft: [20, 50],
  paddingBottomRight: [20, 50],
};

export function lineParams(line) {
  return ({
    color: railLineColors[line],
    opacity: 0.85,
    weight: 1.85,
  });
}

export const markerParams = {
  radius: 4,
  fillColor: 'brown',
  color: '#fff',
  weight: 1,
  opacity: 0.5,
  fillOpacity: 0.8,
};

export function filteredParams(color)  {
  return {
    radius: 4,
    fillColor: railLineColors[color],
    color: '#fff',
    weight: 2,
    opacity: 0.5,
    fillOpacity: 0.9,
  };
}
