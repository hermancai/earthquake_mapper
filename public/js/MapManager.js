function initMap() {
    // Default map location: OSU
    var longitude = -123.2794443;
    var latitude = 44.5637806;

    // embed a google map
    var map = new google.maps.Map(this.map, {
        zoom: 12,
        center: {lat: latitude, lng: longitude}
    });

    // geocoder is used to search for locations using user input
    var geocoder = new google.maps.Geocoder();

    document.getElementById('search-button').addEventListener('click', function() {
        geocodeAddress(geocoder, map);
    });
};

// search for location and display results
function geocodeAddress(geocoder, map) {
    var address = document.getElementById("location").value;
  
    // upon successful search, the geocoder returns an object containing info about location
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === 'OK') {
            map.setCenter(results[0].geometry.location);
    
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
    
            var coords = results[0].geometry.location;
            
            var lat = coords.lat().toFixed(7);
            var long = coords.lng().toFixed(7);    
            console.log(lat, long);                                                
    
        } else {
            console.log(status);
        }
    });
};