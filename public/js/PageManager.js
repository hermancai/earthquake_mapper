// The PageManager class manages user input on the page.
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

    validateInput() {
        var valid = true;

        for (var element of document.querySelectorAll(".error-message")) this.clearErrorMessage(element);

        if (!this.locationValid()) valid = false;
        if (!this.datesValid()) valid = false;
        if (!this.searchRadiusValid()) valid = false;
        
        console.log(valid);

        for (var element of document.querySelectorAll(".error-message")) this.displayErrorMessage(element);
    }

    clearErrorMessage(element) {
        element.innerHTML = "<br>";
        element.classList.remove("fade-in");
        element.classList.add("hide-message");
    }

    displayErrorMessage(element) {
        element.classList.remove("hide-message");
        element.classList.add("fade-in");
    }

    locationValid() {
        if (!document.getElementById("location").value.trim()) {
            var errorMessage = document.getElementById("location-error");
            errorMessage.innerHTML = "Enter a location to search.";
            return false;
        }
        return true;
    }

    searchRadiusValid() {
        var str = document.getElementById("max-radius-km").value.trim();
        if (!str || !/^\-?[0-9]+(e[0-9]+)?(\.[0-9]+)?$/.test(str)) {
            var errorMessage = document.getElementById("search-radius-error");
            errorMessage.innerHTML = "Enter a number (0 - 20000).";
            return false;
        }
        return true;
    }

    datesValid() {
        var valid = true;
        var today = new Date();

        if (!this.startDateValid(today)) valid = false;
        if (!this.endDateValid(today)) valid = false;
        if (!valid) return valid;

        if (!this.compareStartEnd(today)) {
            return false;
        }
        return true;
    }

    startDateValid(today) {
        var startDateInput = document.getElementById("start-date").value;
        var startDateError = document.getElementById("start-date-error");
        if (!startDateInput) {
            startDateError.innerHTML = "Enter a starting date."
            return false;
        } else {
            var startDate = new Date(startDateInput);
            if (today <= startDate) {
                startDateError.innerHTML = "The start date must be before today."
                return false;
            }
            return true;
        }
    }

    endDateValid(today) {
        var endDateInput = document.getElementById("end-date").value;
        var endDateError = document.getElementById("end-date-error");
        if (!endDateInput) {
            endDateError.innerHTML = "Enter an ending date."
            return false;
        } else {
            var endDate = new Date(endDateInput);
            if (today < endDate) {
                endDateError.innerHTML = "The end date cannot be later than today."
                return false;
            }
            return true;
        }
    }

    compareStartEnd(today) {
        var valid = true;
        var startDate = new Date(document.getElementById("start-date").value);
        var endDate = new Date(document.getElementById("end-date").value);

        if (startDate >= endDate) {
            document.getElementById("start-date-error").innerHTML = "Enter a start date from before the end date."
            valid = false;
        }
        if (today < startDate) {
            document.getElementById("start-date-error").innerHTML = "The start date cannot be later than today.";
            valid = false;
        }
        if (today < endDate) {
            document.getElementById("end-date-error").innerHTML = "The end date cannot be later than today.";
            valid = false;
        }
        return valid;
    }
}
