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
    var drm = new DataRequestManager();
    
    document.getElementById('search-button').addEventListener('click', async function() {
        var { latitude: latitude, longitude: longitude } = await geocodeAddress(geocoder, map);
        // var response = await drm.getData(drm.buildURL(latitude, longitude));
        var response = await drm.getData(drm.testURL());

        console.log(response)

        for (var i = 0; i < response.features.length; i++) {
            var coords = response.features[i].geometry.coordinates;
            var magnitude = response.features[i].properties.mag;
            drawCircle(map, coords, magnitude);
        }
        
    });
};

// search for location and display results
async function geocodeAddress(geocoder, map) {
    var address = document.getElementById("location").value;
    
    var getCoordinates = new Promise(function(resolve, reject) {
        // upon successful search, the geocoder returns an object containing info about location
        geocoder.geocode({'address': address}, function(results, status) {
            if (status === 'OK') {
                map.setCenter(results[0].geometry.location);
        
                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
        
                var coords = results[0].geometry.location;
                var lat = coords.lat().toFixed(2);
                var long = coords.lng().toFixed(2);    
                resolve({latitude: lat, longitude: long})                                        
        
            } else {
                reject(status);
            }
        });
    })

    var response = await getCoordinates.catch((err) => { console.log(err); });
    return {latitude: response.latitude, longitude: response.longitude};
};

function drawCircle(map, coords, magnitude) {
    const eventCircle = new google.maps.Circle({
        map,
        fillColor: "red",
        fillOpacity: 0.2,
        strokeColor: "white",
        strokeWeight: 0.5,
        radius: Math.pow(2, magnitude) * 500,
        center: { lat: coords[1], lng: coords[0] },
    })
}