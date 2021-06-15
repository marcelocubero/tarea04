// Mapa Leaflet
var mapa = L.map('mapid').setView([9.92, -84.20], 13);


// Definición de capas base
var capa_osm = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?', 
  {
    maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
).addTo(mapa);

var capa_cartoDB_darkMatter = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', 
    {
	  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	  subdomains: 'abcd',
	  maxZoom: 19
    }
).addTo(mapa);


// Conjunto de capas base
var capas_base = {
  "OSM": capa_osm,
  "CartoDB Dark Matter": capa_cartoDB_darkMatter
};	    

$.getJSON("https://marcelocubero.github.io/capas/dis-sa.geojson", function(geodata) {
  var capa_dis = L.geoJson(geodata, {
    style: function(feature) {
	  return {'color': "#ADFF2F", 'weight': 1, 'fillOpacity': 0.0, 'fillColor':'#ADFF2F'}
    },
    onEachFeature: function(feature, layer) {
      var popupText = "<strong>Nombre Distrito:</strong> " + feature.properties.distrito + "<br>" + "<strong>Cantón:</strong> " + feature.properties.canton
	  + "<br>" + "<strong>Provincia:</strong> " + feature.properties.provincia;
      layer.bindPopup(popupText);
    }			
  }).addTo(mapa);
  control_capas.addOverlay(capa_dis, 'Distritos de Santa Ana');
});


// Ícono personalizado para carnivoros
const icono_agua = L.divIcon({
  html: '<i class="fas fa-tint fa-1x"></i>',
  className: 'estiloIconos'
});


// Control de capas
control_capas = L.control.layers(capas_base).addTo(mapa);	


// Control de escala
L.control.scale({position: 'topright', imperial: false}).addTo(mapa);
   


$.getJSON("https://marcelocubero.github.io/capas/puntos_h.geojson", function(geodata) {

  var capa_h = L.geoJson(geodata, {
    style: function(feature) {
	  return {'color': "#013220", 'weight': 3}
    },
    onEachFeature: function(feature, layer) {
      var popupText = "<strong>Nombre:</strong> " + feature.properties.nombre  ;
      layer.bindPopup(popupText);
    },
    pointToLayer: function(getJsonPoint, latlng) {
        return L.marker(latlng, {icon: icono_agua});
    }
  });

  // Capa de calor (heatmap)
  coordenadas = geodata.features.map(feat => feat.geometry.coordinates.reverse());
  var capa_h_calor = L.heatLayer(coordenadas, {radius: 30, blur: 1});

  // Capa de puntos agrupados
  var capa_h_agrupados = L.markerClusterGroup({spiderfyOnMaxZoom: true});
  capa_h_agrupados.addLayer(capa_h);

  // Se añaden las capas al mapa y al control de capas
  capa_h_calor.addTo(mapa);
  control_capas.addOverlay(capa_h_calor, 'Mapa de calor de Puntos de Hidratación');

  control_capas.addOverlay(capa_h_agrupados, 'Puntos de Hidratación agrupados');

  control_capas.addOverlay(capa_h, 'Puntos de Hidratación');
});
