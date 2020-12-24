class MapManager {
    constructor() {
        this.markers = [];
    }

    // on page load, initialize a map and search button
    initMap() {
        var pm = new PageManager();  // for managing user input
        var drm = new DataRequestManager();  // for getting data from USGS
        // var geocoder = new google.maps.Geocoder();  // for getting result data after searching google map

        // // embed google map. Default location: San Francisco
        // var longitude = -122.42;
        // var latitude = 37.77;
        // var map = new google.maps.Map(document.getElementById("map"), {
        //     zoom: 12,
        //     center: { lat: latitude, lng: longitude }
        // });
        
        // clicking 'search' will display results on the map based on user input
        var searchButton = document.getElementById("search-button");
        searchButton.addEventListener("click", async () => {
            pm.lockButton(searchButton);
            if (pm.validateInput() === true) {
                // var requestMessage = document.getElementById("request-message");
                // // wait for google maps to return location info
                // try {
                //     var { latitude: latitude, longitude: longitude } = await this.searchLocation(geocoder, map);
                //     latitude = parseFloat(latitude);
                //     longitude = parseFloat(longitude);
                //     this.removeMarkers();
                //     this.addLocationMarker(map, latitude, longitude);
                // } catch(err) {
                //     requestMessage.classList.add("request-error");
                //     requestMessage.innerHTML = "Google Maps Request Error: " + err;
                //     return;
                // }
                
                // // wait for USGS to return JSON response
                // try {
                //     var response = await drm.getData(latitude, longitude);
                // } catch(err) {
                //     requestMessage.classList.add("request-error");
                //     requestMessage.innerHTML = "USGS Request Error: " + err;
                //     return;
                // }

                // requestMessage.classList.remove("request-error");
                // requestMessage.innerHTML = "Quake Events Found: " + response.features.length;
                // if (response.features.length > 0) {
                //     requestMessage.innerHTML += "<br>Hover over each quake circle on the map for more info." + 
                //                                 "<br>Zoom in on the map for more precise locations.";
                //     this.displayResults(map, latitude, longitude, response.features); 
                // }
            };
        });
    };

    // async search for the location and return location coordinates
    async searchLocation(geocoder, map) {
        return new Promise((resolve, reject) => {
            var address = document.getElementById("location").value;

            geocoder.geocode({'address': address}, (results, status) => {
                if (status === 'OK') {
                    var coords = results[0].geometry.location;  // LatLng object
                    map.setCenter(coords);
                     
                    resolve({latitude: coords.lat().toFixed(2), longitude: coords.lng().toFixed(2) })                                        
                } else {
                    reject(status);
                }
            });
        })
    };

    // create a pin marker for the searched location
    addLocationMarker(map, latitude, longitude) {
        var marker = new google.maps.Marker({
            map: map,
            position: { lat: latitude, lng: longitude },
        });
        this.markers.push(marker);
    }

    // for each USGS response, draw on the map
    displayResults(map, latitude, longitude, results) {
        var bounds = new google.maps.LatLngBounds();  // for updating map zoom level
        bounds.extend({ lat: latitude, lng: longitude });

        // draw results on the map
        for (var i = 0; i < results.length; i++) {
            this.drawCircle(map, bounds, results[i]);
        }
        map.fitBounds(bounds);  // change map zoom level based on results
    }

    // draw a circle on the map given event info
    drawCircle(map, bounds, eventInfo) {
        var coords = eventInfo.geometry.coordinates;
        var magnitude = eventInfo.properties.mag;

        var eventCenter = { lat: coords[1], lng: coords[0] }  // maps api LatLngLiteral
        bounds.extend(eventCenter);  // update zoom level to fit existing results

        const eventCircle = new google.maps.Marker({
            position: eventCenter,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: magnitude * 5,
                fillColor: "red",
                fillOpacity: 0.25,
                strokeColor: "white",
                strokeWeight: 0.5,
            },
            map: map,
        })

        this.markers.push(eventCircle);
        this.displayEventInfo(map, eventCircle, eventInfo.properties.title, eventInfo.properties.time);
    }

    // display a tooltip box for each quake event
    displayEventInfo(map, eventCircle, title, time) {
        let infoWindow = new google.maps.InfoWindow({
            content: title + "<br>" + new Date(time).toString(),
            position: eventCircle.center,
        });

        eventCircle.addListener("mouseover", () => { infoWindow.open(map, eventCircle) });
        eventCircle.addListener("mouseout", () => { infoWindow.close() });
    };

    // remove all old markers from the map after new search
    removeMarkers() {
        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(null);
        }
        this.markers = [];
    }
}

var mm = new MapManager();
mm.initMap();