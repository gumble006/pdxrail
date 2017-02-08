export const config = {
  params: {
    center: [45.5231, -122.6765],
    zoomControl: false,
    zoom: 13,
    minZoom: 10,
    scrollwheel: false,
    legends: true,
    infoControl: false,
    attributionControl: true,
  },

  tileLayer: {
    uri: 'https://api.mapbox.com/styles/v1/adamsgreg100/ciweevhid003o2qoiv03j79o1/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWRhbXNncmVnMTAwIiwiYSI6ImNpdWl3ZDUwMzAxNzMyeW55Z2xldTU0ZXcifQ.TthhgwWHDLaLt5yzcuzp8A',
    params: {
      minZoom: 10,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
      id: '',
      accessToken: '',
    },
  },
};