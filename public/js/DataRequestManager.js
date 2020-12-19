// The DataRequestManager class is responsible for making requests to USGS.
class DataRequestManager {
    constructor() {}

    // Gather user input from the page to create a URL.
    buildURL(latitude, longitude) {
        var baseURL = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson";
        var startDate = "&starttime=" + document.getElementById("start-date").value;
        var endDate = "&endtime=" + document.getElementById("end-date").value;
        var coordinates = "&latitude=" + latitude + "&longitude=" + longitude;
        var maxRadiusKm = "&maxradiuskm=" + document.getElementById("max-radius-km").value;
        var magnitudeRange = "&minmagnitude=" + document.getElementById("min-magnitude").value
                                + "&maxmagnitude=" + document.getElementById("max-magnitude").value;
        var resultsLimit = "&limit=" + document.getElementById("results-limit").value;
        return baseURL + startDate + endDate + coordinates + maxRadiusKm + magnitudeRange + resultsLimit;
    }

    // Async request to USGS and return JSON data.
    getData(url) {
        return new Promise(function(resolve, reject) {
            var req = new XMLHttpRequest();
            req.open("GET", url, true);
            req.send();
        
            req.onload = function(){
                var response = JSON.parse(this.responseText);
                resolve(response);
            };

            req.onerror = function() { reject(this.status) }
        })
    }
}