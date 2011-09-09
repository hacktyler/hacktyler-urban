// TO USE THIS SEARCH CODE, define your bounding box like so:
// var southwest_limit = new google.maps.LatLng(41.6, -88);
// var northeast_limit = new google.maps.LatLng(42.05, -87.5);    
// var bounding_box = new google.maps.LatLngBounds(southwest_limit, northeast_limit);
// var state_pattern = /\sil\s|\sillinois\s/gi;
// var state_swap = 'IL';
// ALSO, set up the google maps API
// <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=true"></script>
// THIS REQUIRES JQUERY
// DEFINE A CALLBACK FOR dropping the pin, like so
// var search_callback = function process_location(lat, lng) {...};

var geocoder = new google.maps.Geocoder();

//you must define (listed above)
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
    alt_addresses(results);
 
    lat = results[0].geometry.location.lat();
    lng = results[0].geometry.location.lng();
    
    normalized_address = results[0].formatted_address;
    $('#query').val(normalized_address);
    search_callback(lat, lng);
}

function alt_addresses(results) {
    $('#alt-addresses').html('');
 
    keep = new Array();
 
    $.each(results, function(i,val) {
        if (i==0) return; // skip the first result
 
        for (var t in val.types) {
            if (val.types[t] == 'street_address' || val.types[t] == 'intersection') {
                keep.push(val.formatted_address);
                break;
            }
        }
    });
 
    if (keep.length <= 1) {
        $('#did-you-mean')
            .addClass('disabled-link')
            .unbind();
        
    } else {
        $('#did-you-mean')
                .removeClass('disabled-link')
                .click(function(e) { 
                        e.stopPropagation(); 
                        toggle_alt_addresses(); 
                        });
        $('#alt-addresses').append('<p>Did you mean...</p>');
        for (var i=0; i<keep.length; i++) {
            $('#alt-addresses').append('<a href="javascript:geocode(\'' + keep[i] + '\');">' + keep[i] + '</a>');
        }
        $('#alt-addresses').append('<a class="hide-alternatives" href="javascript:toggle_alt_addresses();">Hide this list</a>');
    }
}

function toggle_alt_addresses() {
    alt_adds_div = $('#alt-addresses');
    if (alt_adds_div.is(':hidden')) {
        show_alt_addresses();
    } else if (alt_adds_div.is(':visible')) {
        hide_alt_addresses();
    }
}
 
function show_alt_addresses() {
    $('#alt-addresses').slideDown(250);
    $('#did-you-mean').addClass('highlight');
}
 
function hide_alt_addresses() {
    $('#alt-addresses').hide();
    $('#did-you-mean.highlight').removeClass('highlight');
}

$(document).ready(function() {
    $("#search").submit(function(){
        geocode($("#query").val());
        return false;
    });
});