import React, { Component } from 'react';
import L from 'leaflet';

import geojsonStations from '../../stations-edited.geojson';
import geojsonLines from '../../lines-edited.geojson';

import { config  } from '../config/leaflet';
import { lineParams, markerParams, filteredParams, fitBoundsParams } from '../config/styles';
import Menu from './menu' ;

// Making sure Leaflet is able to update itself with this component, rather than React 

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      map: null,
      _mapNode: null,
      geojsonLayer: null,
      railLinesFilter: '*',
    };

    this._mapNode = null;
    this.railLineNames = [];

    this.updateMap = this.updateMap.bind(this);
    this.onEachFeature = this.onEachFeature.bind(this);
    this.pointToLayer = this.pointToLayer.bind(this);
    this.styleGeojsonLines = this.styleGeojsonLines.bind(this);
    this.filterFeatures = this.filterFeatures.bind(this);
  }

  componentDidMount() {
    // Load geojson after map is in place
    this.getData();

    if (!this.state.map) {
      this.init(this._mapNode);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // add the geojson once map loaded & ready 
    if (this.state.geojsonCombined && this.state.map && !this.state.geojsonLayer) {
      this.addGeoJSONLayer(this.state.geojsonCombined);
    }

    // check to see if the rail lines filter has changed
    if (this.state.railLinesFilter !== prevState.railLinesFilter) {
      // filter / re-render geojson
      this.filterGeoJSONLayer();
    }
  }

  componentWillUnmount() {
    // clear leaflet listeners before map removed from dom
    this.state.map.remove();
  }

  onEachFeature(feature, layer) {
    // add unique names for lines
    if (feature.properties && feature.geometry.type === 'LineString') {
      feature.properties.LINE.split('/').forEach((item) => {
        // account for shared tracks
        let trackType = feature.properties.TYPE;
        if (item === 'A Loop' || item === 'B Loop') trackType = 'Streetcar';
        if (item === 'Orange') trackType = 'MAX';

        const lineName = `${item} (${trackType})`;

        if (this.railLineNames.indexOf(lineName) === -1) {
          this.railLineNames.push(lineName);
        }
      });
    }

    // add popups for stations
    if (feature.properties && feature.properties.STATION) {
      const popupContent = `<h5>${feature.properties.STATION}</h5>`;
      layer.bindPopup(popupContent);
    }
  }


  getData() {
    this.setState({
      numStations: geojsonStations.features.length,
      geojsonCombined: [geojsonLines, geojsonStations], 
    });
  }

  updateMap(e) {
    // change the rail line filter based on select field
    let railLine = e.target.value.split(' (')[0];
    
    if (railLine === 'All lines') {
      railLine = '*';
    }

    this.setState({
      railLinesFilter: railLine,
    });
  }


  filterFeatures(feature) {
    // check if each feature includes filtered line or include all if 'all lines' selected
    const lineTest = feature.properties.LINE.split('/').indexOf(this.state.railLinesFilter) !== -1;

    if (this.state.railLinesFilter === '*' || lineTest) {
      return true;
    }

    return false;
  }

  filterGeoJSONLayer() {
    // clear geojson layer, re-add the geojson to re-filter, adjust zoom to new bounds
    this.state.geojsonLayer.clearLayers();
    this.state.geojsonLayer.addData(this.state.geojsonCombined);
    this.zoomToFeature(this.state.geojsonLayer);
  }

  zoomToFeature(target) {
    // set the map's center & zoom so to fit extent of layer
    this.state.map.fitBounds(target.getBounds(), fitBoundsParams);
  }

  pointToLayer(feature, latlng) {
    // apply styling for point data
    if (this.state.railLinesFilter === '*') return L.circleMarker(latlng, markerParams);
    
    return L.circleMarker(latlng, filteredParams(this.state.railLinesFilter));
  }

  styleGeojsonLines(feature) {
    // apply styling for point data
    if (feature.properties && feature.geometry.type === 'LineString' && this.state.railLinesFilter !== '*') {
      return lineParams(this.state.railLinesFilter);
    }

    return undefined;
  }

  addGeoJSONLayer(geojson) {
    const geojsonLayer = L.geoJson(geojson, {
      onEachFeature: this.onEachFeature,
      pointToLayer: this.pointToLayer,
      filter: this.filterFeatures,
      style: this.styleGeojsonLines,
    });

    // add to map, store in state for later, adjust zoom
    geojsonLayer.addTo(this.state.map);
    this.railLineNames.sort().unshift('All lines');
    this.setState({ geojsonLayer });
    this.zoomToFeature(geojsonLayer);
  }

  init(node) {
    if (this.state.map) {
      return;
    }

    const map = L.map(node, config.params);
    L.control.zoom({ position: 'topright' }).addTo(map);
    L.control.scale({ position: 'topright' }).addTo(map);

    // TileLayer as "basemap"
    const tileLayer = L.tileLayer(config.tileLayer.uri, config.tileLayer.params).addTo(map);
    this.setState({ map, tileLayer });
  }

  render() {
    // count total stations for filtered features
    const filterStationCount = geojsonStations.features.filter(item => item.properties.LINE.split('/').indexOf(this.state.railLinesFilter) !== -1).length;

    return (
      <div id="mapUI">
        <Menu 
          lines={this.railLineNames} 
          numLines={this.railLineNames.length - 1} 
          stationCount={filterStationCount || this.state.numStations} 
          currFilter={this.state.railLinesFilter} 
          changeFilter={this.updateMap}  
        />
        <div ref={(node) => { this._mapNode = node; }} id="map" /> 
      </div>
    );
  }
}

export default Map;