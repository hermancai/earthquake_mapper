class PageManager {
    constructor() {
        var map = document.getElementById("map");
    }

    loadPage() {
        this.setDefaultDates();
    }

    setDefaultDates() {
        var startDate = new Date();
        document.getElementById("end-date").valueAsDate = startDate;

        var endDate = new Date(startDate.valueOf() - 1000 * 60 * 60 * 24 * 7)
        document.getElementById("start-date").valueAsDate = endDate

        console.log("start date:", endDate)
        console.log("end date:", startDate)
    }
}

var pb = new PageManager();
pb.loadPage();