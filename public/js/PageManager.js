class PageManager {
    constructor() {
        var map = document.getElementById("map");
    }

    loadPage() {
        this.setDefaultDates();
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