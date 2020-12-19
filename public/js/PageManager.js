// The PageManager class sets default input values on the page.
class PageManager {
    constructor() {
        this.setDefaultDates();
    }

    setDefaultDates() {
        var startDate = new Date();
        document.getElementById("end-date").valueAsDate = startDate;

        var endDate = new Date(startDate.valueOf() - 1000 * 60 * 60 * 24 * 30)  // 30 days ago
        document.getElementById("start-date").valueAsDate = endDate
    }
}

var pb = new PageManager();