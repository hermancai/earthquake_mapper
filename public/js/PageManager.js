// The PageManager class manages user input on the page.
class PageManager {
    constructor() {
        document.getElementById("default-button").addEventListener("click", this.setDefaultValues);
        document.getElementById("clear-button").addEventListener("click", this.clearValues);
    }

    setDefaultValues = () => {
        this.setDefaultDates();
        document.getElementById("location").value = "San Francisco";
        document.getElementById("max-radius-km").value = "100";
        document.getElementById("min-magnitude").value = "2.5";
        document.getElementById("max-magnitude").value = "10";
        document.getElementById("results-limit").value = "100";
    }

    setDefaultDates() {
        var startDate = new Date();
        document.getElementById("end-date").valueAsDate = startDate;

        var endDate = new Date(startDate.valueOf() - 1000 * 60 * 60 * 24 * 30)  // 30 days ago
        document.getElementById("start-date").valueAsDate = endDate
    }

    clearValues() {
        document.getElementById("location").value = "";
        document.getElementById("start-date").value = "";
        document.getElementById("end-date").value = "";
        document.getElementById("max-radius-km").value = "";
        document.getElementById("min-magnitude").value = "";
        document.getElementById("max-magnitude").value = "";
        document.getElementById("results-limit").value = "";
    }

    validateInput() {
        var valid = true;

        for (var element of document.querySelectorAll(".error-message")) this.clearErrorMessage(element);

        if (!this.locationValid()) valid = false;
        if (!this.datesValid()) valid = false;
        if (!this.searchRadiusValid()) valid = false;
        if (!this.resultsLimitValid()) valid = false;
        
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
        var input = document.getElementById("max-radius-km").value.trim();
        if (!isNaN(input)) {
            if (input > 0 && input <= 20000) {
                return true;
            }
        }
        document.getElementById("search-radius-error").innerHTML = "Enter a number (1 - 20000).";
        return false;
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

    resultsLimitValid() {
        var input = document.getElementById("results-limit").value.trim();
        if (!isNaN(input)) {
            if (input % 1 == 0 && input > 0 && input <= 20000) {
                return true;
            }
        }
        document.getElementById("results-limit-error").innerHTML = "Enter a whole number (1 - 20000)."
        return false;
    }
}
