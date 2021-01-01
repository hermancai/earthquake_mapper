// The DataRequestManager class is responsible for making requests to USGS.
class DataRequestManager {
    constructor() {}

    // Gather user input from the page to create a URL.
    buildURL(latitude, longitude) {
        var baseURL = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&orderby=magnitude";
        var startDate = "&starttime=" + document.getElementById("start-date").value;

        var endDate = "&endtime=" + document.getElementById("end-date").value;
        var now = new Date();
        var nowString = now.getFullYear() + "-" + ("0"+(now.getMonth()+1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);
        if (document.getElementById("end-date").value == nowString) {
            endDate = "";
        }
        
        var coordinates = "&latitude=" + latitude + "&longitude=" + longitude;
        var maxRadiusKm = "&maxradiuskm=" + document.getElementById("max-radius-km").value;
        var magnitudeRange = "&minmagnitude=" + document.getElementById("min-magnitude").value
                                + "&maxmagnitude=" + document.getElementById("max-magnitude").value;
        var resultsLimit = "&limit=" + document.getElementById("results-limit").value;

        baseURL += startDate + endDate + coordinates + maxRadiusKm + magnitudeRange + resultsLimit;
        console.log(baseURL);
        return baseURL;
    }

    // Async request to USGS and return JSON data.
    getData(latitude, longitude) {
        var urlBuilder = this.buildURL;
        return new Promise(function(resolve, reject) {
            var req = new XMLHttpRequest();
            var url = urlBuilder(latitude, longitude);
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