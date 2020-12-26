// The PageManager class manages user input on the page.
class PageManager {
    constructor() {}

    // initialize map and buttons
    loadPage() {
        var drm = new DataRequestManager();  // for getting data from USGS
        var mm = new MapManager();  // for creating map and map markers
        var geocoder = new google.maps.Geocoder();  // for getting result data after searching google maps
        mm.initMap();

        document.getElementById("default-button").addEventListener("click", this.setDefaultValues);
        document.getElementById("clear-button").addEventListener("click", this.clearValues);
        document.getElementById("search-button").addEventListener("click", this.searchButtonEvent(drm, mm, geocoder));
    }

    // search google maps then make USGS request. display results
    searchButtonEvent(drm, mm, geocoder) {
        return async () => {
            this.lockButton(document.getElementById("search-button"));
            if (this.validateInput() === true) {
                var requestMessage = document.getElementById("request-message");
                // wait for google maps to return location info
                try {
                    var { latitude: latitude, longitude: longitude } = await mm.searchLocation(geocoder);
                    latitude = parseFloat(latitude);
                    longitude = parseFloat(longitude);
                    mm.removeMarkers();
                    mm.addLocationMarker(latitude, longitude);
                } catch(err) {
                    requestMessage.classList.add("request-error");
                    requestMessage.innerHTML = "Google Maps Request Error: " + err;
                    return;
                }
                
                // wait for USGS to return JSON response
                try {
                    var response = await drm.getData(latitude, longitude);
                } catch(err) {
                    requestMessage.classList.add("request-error");
                    requestMessage.innerHTML = "USGS Request Error: " + err;
                    return;
                }

                // display results on map after successful requests
                requestMessage.classList.remove("request-error");
                requestMessage.innerHTML = "Quake Events Found: " + response.features.length;
                if (response.features.length > 0) {
                    mm.displayResults(latitude, longitude, response.features); 
                }
            };
        }
    }

    // fill all inputs with default values
    setDefaultValues = () => {
        this.setDefaultDates();
        document.getElementById("location").value = "San Francisco";
        document.getElementById("max-radius-km").value = "50";
        document.getElementById("min-magnitude").value = "1";
        document.getElementById("max-magnitude").value = "10";
        document.getElementById("results-limit").value = "20";
    }

    // set the default date values
    setDefaultDates() {
        var startDate = new Date();
        document.getElementById("end-date").valueAsDate = startDate;

        var endDate = new Date(startDate.valueOf() - 1000 * 60 * 60 * 24 * 30)  // 30 days ago
        document.getElementById("start-date").valueAsDate = endDate
    }

    // clear all input values
    clearValues() {
        document.getElementById("location").value = "";
        document.getElementById("start-date").value = "";
        document.getElementById("end-date").value = "";
        document.getElementById("max-radius-km").value = "";
        document.getElementById("min-magnitude").value = "";
        document.getElementById("max-magnitude").value = "";
        document.getElementById("results-limit").value = "";
    }

    // temp disable button after clicking to prevent multiple clicks
    lockButton(button) {
        var prevColor = button.style.backgroundColor;
        var prevValue = button.innerHTML;

        button.innerHTML = "Wait";
        button.setAttribute("disabled", true);
        button.style.backgroundColor = "#666666";

        setTimeout(function() {
            button.innerHTML = prevValue;
            button.removeAttribute("disabled");
            button.style.backgroundColor = prevColor;
        }, 3000)
    }

    // validate each input value
    validateInput() {
        var valid = true;

        for (var element of document.querySelectorAll(".error-message")) element.innerHTML = "<br>";

        if (!this.locationValid()) valid = false;
        if (!this.datesValid()) valid = false;
        if (!this.searchRadiusValid()) valid = false;
        if (!this.resultsLimitValid()) valid = false;
        if (!this.magnitudeRangeValid()) valid = false;
        
        return valid;
    }

    // check that the location input is not empty
    locationValid() {
        if (!document.getElementById("location").value.trim()) {
            var errorMessage = document.getElementById("location-error");
            errorMessage.innerHTML = "Enter a location to search.";
            return false;
        }
        return true;
    }

    // check that the search radius input is a number within 0 - 20000
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

    // validate the dates
    datesValid() {
        var valid = true;
        var today = new Date();

        // check that start and end dates are not later than today
        if (!this.startDateValid(today)) valid = false;
        if (!this.endDateValid(today)) valid = false;
        if (!valid) return valid;

        var startDate = new Date(document.getElementById("start-date").value);
        var endDate = new Date(document.getElementById("end-date").value);

        // check that end date is later than start date
        if (startDate >= endDate) {
            document.getElementById("start-date-error").innerHTML = "Enter a start date from before the end date."
            return false;
        }
        return true;
    }

    // check if start date is empty or after today
    startDateValid(today) {
        var startDateInput = document.getElementById("start-date").value;
        var startDateError = document.getElementById("start-date-error");

        if (!startDateInput) {  // start date is empty
            startDateError.innerHTML = "Enter a starting date."
            return false;
        } else {
            var startDate = new Date(startDateInput);
            if (today <= startDate) {  // start date is later than today
                startDateError.innerHTML = "The start date must be before today."
                return false;
            }
            return true;
        }
    }

    // check if end date is empty or after today
    endDateValid(today) {
        var endDateInput = document.getElementById("end-date").value;
        var endDateError = document.getElementById("end-date-error");

        if (!endDateInput) {  // end date is empty
            endDateError.innerHTML = "Enter an ending date."
            return false;
        } else {
            var endDate = new Date(endDateInput);
            if (today < endDate) {  // end date is later than today
                endDateError.innerHTML = "The end date cannot be later than today."
                return false;
            }
            return true;
        }
    }

    // check if results limit is an int between 1 - 20000
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

    // check if magnitude range input is numeric within 0 - 10
    magnitudeRangeValid() {
        var minMag = document.getElementById("min-magnitude").value;
        var maxMag = document.getElementById("max-magnitude").value;

        if (!isNaN(minMag) && !isNaN(maxMag)) {
            minMag = parseFloat(minMag);
            maxMag = parseFloat(maxMag);
            if (minMag < maxMag) {
                if ((minMag >= 0 && minMag <= 10) && (maxMag >= 0 && maxMag <= 10)) {
                    return true;
                }
            }
        }
        document.getElementById("magnitude-range-error").innerHTML = "Enter a number range within 0 - 10."
        return false;
    }
}

var pm = new PageManager();
pm.loadPage();