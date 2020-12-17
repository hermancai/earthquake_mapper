class DataRequestManager {
    constructor() {}

    buildURL() {
        return "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=2014-01-02&minmagnitude=5";
    }

    getData(url) {
        var req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.send();
    
        req.onreadystatechange = function(){
            // readyState: 4 means request finished and response is ready
            if(this.readyState == 4 && this.status >= 200 && this.status < 400) {
                var response = JSON.parse(this.responseText);
                console.log(response);
            }
        };
    }
}