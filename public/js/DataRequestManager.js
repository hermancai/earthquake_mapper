class DataRequestManager {
    constructor() {}

    testURL() {
        return "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-12-11&endtime=2020-12-18&latitude=37.77&longitude=-122.42&maxradiuskm=50"
    }

    buildURL(latitude, longitude) {
        var baseURL = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson";
        var startDate = "&starttime=" + document.getElementById("start-date").value;
        var endDate = "&endtime=" + document.getElementById("end-date").value;
        var coordinates = "&latitude=" + latitude + "&longitude=" + longitude;
        var maxRadiusKm = "&maxradiuskm=" + document.getElementById("max-radius-km").value;
        return baseURL + startDate + endDate + coordinates + maxRadiusKm;
    }

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