var geocoder = new google.maps.Geocoder();

var bounding_box;
var state_pattern;
var state_swap;
var search_callback;

function geocode(query) {
    if (typeof(query) == 'string') {
        pattr = state_pattern;
        match = query.match(pattr);
        if (!match) {
            query = query + ' ' + state_swap;
        }
        gr = { 'address': query };
    } else {
        gr = { 'location': query };
    }
    geocoder.geocode(gr, handle_geocode);
}
 
function handle_geocode(results, status) {
    lat = results[0].geometry.location.lat();
    lng = results[0].geometry.location.lng();
    
    normalized_address = results[0].formatted_address;
    $('#query').val(normalized_address);
    search_callback(lat, lng);
}

$(document).ready(function() {
    $("#search").submit(function(){
        geocode($("#query").val());
        return false;
    });
});
