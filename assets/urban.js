var map;

//tile layers
var urban_tiles = new L.TileLayer(
    "http://media.hacktyler.com/maptiles/tyler-urban/{z}/{x}/{y}.png"
);

//for search
var southwest_limit = new google.maps.LatLng(32.2, -95.4);
var northeast_limit = new google.maps.LatLng(32.4, -95.2);   
var bounding_box = new google.maps.LatLngBounds(southwest_limit, northeast_limit);
var state_pattern = /\stx\s|\stexas\s/gi;
var state_swap = 'TX';
var tracts = {};
var drop_marker = function(lat,lon,zoom){
    if (zoom == null){
        zoom = 15;
    }
    map.setView(map.getCenter(), zoom, true);
    var latlng = new L.LatLng(lat, lon);
    var offset_center = map.latLngToLayerPoint(latlng);
    //width of the sidebar, over two
    offset_center.x = offset_center.x - $("#content").width() / 2;
    offset_latlng = map.layerPointToLatLng(offset_center);
    map.setView(offset_latlng, map.getZoom(), true);
    if(marker) {
        marker.setLatLng(latlng);
    }
    else {
        marker = new L.Marker(latlng);
        map.addLayer(marker);
    }
    map.setView(offset_latlng, zoom, true);
}
var search_callback = drop_marker;
var marker;

function update_hash(){
    window.location.hash = make_hash();
}

function parse_hash(s) {
    if (s == null) { s = window.location.hash; }
    if (!s) { return; }
    //IE gives you a # at the start. sonova
    s = s.replace('#','');
    parts = s.split(",");
    lat = parseFloat(parts[0]);
    lng = parseFloat(parts[1]);
    zoom = parseInt(parts[2]);
    if (parts.length == 5) {
        var markerLat = parseFloat(parts[3]);
		var markerLng = parseFloat(parts[4]);
        return [lat, lng, zoom, markerLat, markerLng];
    } else {
        return [lat, lng, zoom];
    }
    return null;
}

function make_hash() {
    var parts = [map.getCenter().lat, map.getCenter().lng, map.getZoom()]
    if (marker != null){
     parts.push(marker.getLatLng().lat);
     parts.push(marker.getLatLng().lng);
    }
    return parts.join(",");
}

$(document).ready(function() {
    map = new L.Map('map_canvas', { minZoom:11, maxZoom:15 });
    map.setView(new L.LatLng(32.325, -95.304), 12);

    map.addLayer(urban_tiles);
    
    loc = parse_hash();

    if (loc) {
        var center_lat = loc[0];
        var center_lng = loc[1];
        var zoom = loc[2];
        var markerLat = loc[3];
        var markerLng = loc[4];
        if (markerLat != null){
            drop_marker(markerLat, markerLng, zoom);
        } else {
            map.setView(new L.LatLng(center_lat, center_lng), zoom, true);
        }
    }

    map.on('move', function() {
        update_hash();
    });
});
