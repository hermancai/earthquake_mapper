// This class handles form validation.
class FormValidation {
  constructor() {}

  // validate all form input fields
  validateInput() {
    let valid = true;

    this.clearInvalidMessages();

    if (!this.locationValid()) valid = false;
    if (!this.datesValid()) valid = false;
    if (!this.searchRadiusValid()) valid = false;
    if (!this.resultsLimitValid()) valid = false;
    if (!this.magnitudeRangeValid()) valid = false;

    return valid;
  }

  // reset form messages
  clearInvalidMessages() {
    for (let element of document.querySelectorAll(".invalid-message")) element.innerHTML = "<br>";
  }

  // location needs to be non-empty
  locationValid() {
    if (!document.getElementById("input-location").value.trim()) {
      document.getElementById("invalid-location").innerHTML = "Enter a location.";
      return false;
    }
    return true;
  }

  // search radius needs to be a number within 0 - 20000
  searchRadiusValid() {
    let input = document.getElementById("search-radius").value.trim();
    if (!isNaN(input)) {
      if (input > 0 && input <= 20000) {
        return true;
      }
    }
    document.getElementById("invalid-search-radius").innerHTML = "Enter a number (1 to 20,000)";
    return false;
  }

  // validate the dates
  datesValid() {
    let startDateChecked = document.getElementById("check-start-date").checked;
    let endDateChecked = document.getElementById("check-end-date").checked;

    // auto-valid if both date checkboxes are checked
    if (startDateChecked && endDateChecked) {
      return true;
    }

    // custom dates need to exist if boxes are not checked
    if (!this.dateInputsExist(startDateChecked, endDateChecked)) {
      return false;
    }

    let today = new Date();
    let startDate;
    let endDate;

    // get end date
    if (endDateChecked) {
      endDate = today;
    } else {
      if (this.endDateValid(today)) {
        endDate = new Date(document.getElementById("input-end-date").value);
      } else {
        return false;
      }
    }

    // get start date
    if (startDateChecked) {
      startDate = new Date(endDate.valueOf() - 1000 * 60 * 60 * 24 * 30); // 30 days ago
    } else {
      if (this.startDateValid(today)) {
        startDate = new Date(document.getElementById("input-start-date").value);
      } else {
        return false;
      }
    }

    // check that end date is later than start date
    if (startDate >= endDate) {
      document.getElementById("invalid-start-date").innerHTML = "Enter a start date from before the end date.";
      return false;
    }
    return true;
  }

  // custom dates need to exist if boxes are not checked
  dateInputsExist(startDateChecked, endDateChecked) {
    let valid = true;
    if (!startDateChecked && !document.getElementById("input-start-date").value) {
      document.getElementById("invalid-start-date").innerHTML = "Enter a starting date.";
      valid = false;
    }
    if (!endDateChecked && !document.getElementById("input-end-date").value) {
      document.getElementById("invalid-end-date").innerHTML = "Enter an ending date.";
      valid = false;
    }
    return valid;
  }

  // check if start date is empty or after today
  startDateValid(today) {
    let startDate = new Date(document.getElementById("input-start-date").value);

    if (today <= startDate) {
      // start date is later than today
      document.getElementById("invalid-start-date").innerHTML = "The start date must be before today.";
      return false;
    }
    return true;
  }

  // check if end date is empty or after today
  endDateValid(today) {
    let endDate = new Date(document.getElementById("input-end-date").value);

    if (today < endDate) {
      // end date is later than today
      document.getElementById("invalid-end-date").innerHTML = "The end date cannot be later than today.";
      return false;
    }
    return true;
  }

  // result limit needs to be an int between 1 - 1000
  resultsLimitValid() {
    let input = document.getElementById("result-limit").value.trim();
    if (!isNaN(input)) {
      if (input % 1 == 0 && input > 0 && input <= 1000) {
        return true;
      }
    }
    document.getElementById("invalid-result-limit").innerHTML = "Enter a number (1 to 1,000)";
    return false;
  }

  // magnitude range needs to be a numeric range 0 - 10
  magnitudeRangeValid() {
    let minMag = document.getElementById("mag-min").value;
    let maxMag = document.getElementById("mag-max").value;

    if (!isNaN(minMag) && !isNaN(maxMag)) {
      minMag = parseFloat(minMag);
      maxMag = parseFloat(maxMag);
      if (minMag <= maxMag) {
        if (minMag >= 0 && minMag <= 10 && maxMag >= 0 && maxMag <= 10) {
          return true;
        }
      }
    }
    document.getElementById("invalid-mag-range").innerHTML = "Magnitude Range: 0 - 10";
    return false;
  }
}
