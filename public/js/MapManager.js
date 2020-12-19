class MapManager {
    constructor() {}

    // on page load, initialize a map and search button
    initMap() {
        var pm = new PageManager();  // for managing user input
        var drm = new DataRequestManager();  // for getting data from USGS
        var geocoder = new google.maps.Geocoder();  // for getting result data after searching google map

        // Default map location: San Francisco
        var longitude = -122.42;
        var latitude = 37.77;

        // embed a google map
        var map = new google.maps.Map(document.getElementById("map"), {
            zoom: 12,
            center: {lat: latitude, lng: longitude}
        });
        
        // clicking 'search' will display results on the map based on user input
        document.getElementById('search-button').addEventListener('click', async () => {
            var { latitude: latitude, longitude: longitude } = await this.searchLocation(geocoder, map); 
            var response = await drm.getData(latitude, longitude);  // wait for USGS to return JSON response

            if (response.features.length > 0) {
                var bounds = new google.maps.LatLngBounds();  // for updating map zoom level

                // draw results on the map
                for (var i = 0; i < response.features.length; i++) {
                    var coords = response.features[i].geometry.coordinates;
                    var magnitude = response.features[i].properties.mag;
                    this.drawCircle(map, bounds, coords, magnitude);
                }
                map.fitBounds(bounds);  // change map zoom level based on results
            }
        });
    };

    // async search for the location and return location coordinates
    async searchLocation(geocoder, map) {
        var address = document.getElementById("location").value;
        
        var getCoordinates = new Promise(function(resolve, reject) {
            // upon successful search, the geocoder returns an object containing info about location
            geocoder.geocode({'address': address}, function(results, status) {
                if (status === 'OK') {
                    map.setCenter(results[0].geometry.location);
            
                    // create a pin marker for the searched location
                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location,
                    });
            
                    var coords = results[0].geometry.location;  
                    resolve({latitude: coords.lat().toFixed(2), longitude: coords.lng().toFixed(2) })                                        
            
                } else {
                    reject(status);
                }
            });
        })

        var response = await getCoordinates.catch((err) => { console.log(err); });
        return {latitude: response.latitude, longitude: response.longitude};
    };

    // draw a circle on the map given event info
    drawCircle(map, bounds, coords, magnitude) {
        var eventCenter = { lat: coords[1], lng: coords[0] }  // maps api LatLngLiteral
        bounds.extend(eventCenter);  // update zoom level to fit existing results

        const eventCircle = new google.maps.Circle({
            map,
            fillColor: "red",
            fillOpacity: 0.25,
            strokeColor: "white",
            strokeWeight: 0.5,
            radius: Math.pow(2, magnitude) * 250,
            center: eventCenter,
        })
    }
}

var mm = new MapManager();
mm.initMap();