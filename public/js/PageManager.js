class PageManager {
    constructor() {
        var map = document.getElementById("map");
    }

    loadPage() {
        document.getElementById("search-button").addEventListener("click", this.buttonEventListener);

        this.setDefaultDates();
    }

    buttonEventListener() {
        var drm = new DataRequestManager();
        var url = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=2014-01-02&minmagnitude=5";

        // drm.getData(url);
        console.log("button clicked");
    }

    setDefaultDates() {
        var today = new Date();
        document.getElementById("end-date").valueAsDate = today;

        var yesterday = new Date(today.valueOf() - 1000 * 60 * 60 * 24 * 1)
        document.getElementById("start-date").valueAsDate = yesterday

        console.log("start date:", yesterday)
        console.log("end date:", today)
    }
}

var pb = new PageManager();
pb.loadPage();