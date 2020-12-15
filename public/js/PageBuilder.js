class PageBuilder {
    constructor() {
        var map = document.getElementById("map");
    }

    loadPage() {
        document.getElementById("clickhere").addEventListener("click", function(event) {
            event.preventDefault();
            var drm = new DataRequestManager();
            var url = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=2014-01-02&minmagnitude=5";

            drm.getData(url);
        })
    }
}

var pb = new PageBuilder();
pb.loadPage();