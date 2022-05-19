// This class manages user input on the page.
class PageManager {
  constructor() {}

  // initialize map and buttons
  loadPage() {
    let fd = new FormValidation(); // validate inputs
    let drm = new DataRequestManager(); // get data from USGS
    let mm = new MapManager(); // draw on google map
    let geocoder = new google.maps.Geocoder(); // get results after searching google maps
    mm.initMap(); // load and display google map

    document
      .getElementById("searchButton")
      .addEventListener("click", this.searchButtonEvent(drm, mm, fd, geocoder));
    document.getElementById("exampleButton").addEventListener("click", () => {
      this.setDefaultValues();
      fd.clearInvalidMessages();
      document.getElementById("searchButton").click();
    });
    document
      .getElementById("clearButton")
      .addEventListener("click", this.clearValues);
    document
      .getElementById("checkStartDate")
      .addEventListener("click", this.disableStartDate);
    document
      .getElementById("checkEndDate")
      .addEventListener("click", this.disableEndDate);

    this.disableEndDate();
    this.disableStartDate();
  }

  // search google maps then make USGS request. display results
  searchButtonEvent(drm, mm, fd, geocoder) {
    return async () => {
      if (fd.validateInput() === true) {
        this.disableSearchButton();
        this.clearResults();
        mm.removeMarkers();

        document
          .getElementById("resultMessage")
          .scrollIntoView({ behavior: "smooth" });

        try {
          // wait for google maps to return location info
          var { latitude: latitude, longitude: longitude } =
            await mm.searchLocation(geocoder);
          mm.addLocationMarker(latitude, longitude);
        } catch (err) {
          this.restoreSearchButton();
          this.displayMessage(-1, err);
          return;
        }

        try {
          // wait for USGS to return JSON response
          let resultMessage = document.getElementById("resultMessage");
          resultMessage.innerHTML =
            "Requesting data from USGS. This may take a while, depending on your search terms.";
          resultMessage.style.animationIterationCount = "infinite";
          var response = await drm.getData(latitude, longitude);
        } catch (err) {
          this.restoreSearchButton();
          this.displayMessage(-2, err);
          return;
        }

        // display results on map after successful requests
        this.displayMessage(response.features.length, "");
        if (response.features.length > 0) {
          this.displayResults(mm, response.features, latitude, longitude);
        }
        this.restoreSearchButton();

        document
          .getElementById("resultMessage")
          .scrollIntoView({ behavior: "smooth" });
      }
    };
  }

  // fill all inputs with default values
  setDefaultValues() {
    document.getElementById("inputLocation").value = "San Francisco";
    document.getElementById("inputStartDate").value = "2000-01-01";
    document.getElementById("inputEndDate").disabled = true;
    document.getElementById("checkEndDate").checked = true;
    document.getElementById("checkStartDate").checked = false;
    document.getElementById("inputStartDate").disabled = false;
    document.getElementById("magMin").value = "6";
    document.getElementById("magMax").value = "10";
    document.getElementById("searchRadius").value = "500";
    document.getElementById("resultLimit").value = "20";
  }

  // clear all input values
  clearValues() {
    document.getElementById("inputLocation").value = "";
    document.getElementById("inputStartDate").value = "";
    document.getElementById("inputEndDate").value = "";
    document.getElementById("searchRadius").value = "";
    document.getElementById("magMin").value = "";
    document.getElementById("magMax").value = "";
    document.getElementById("resultLimit").value = "";
  }

  // disable start date input if checkbox is checked
  disableStartDate() {
    if (document.getElementById("checkStartDate").checked) {
      document.getElementById("inputStartDate").disabled = true;
    } else {
      document.getElementById("inputStartDate").disabled = false;
    }
  }

  // disable end date input if checkbox is checked
  disableEndDate() {
    if (document.getElementById("checkEndDate").checked) {
      document.getElementById("inputEndDate").disabled = true;
    } else {
      document.getElementById("inputEndDate").disabled = false;
    }
  }

  // reset results section and table after new search
  clearResults() {
    document.getElementById("resultMessage").innerHTML = "";
    document.getElementById("resultContainer").style.display = "none";
    document.getElementById("tableBody").replaceChildren();
  }

  // lock button while searching
  disableSearchButton() {
    document.getElementById("searchButton").setAttribute("disabled", true);
  }

  // unlock button when search completes
  restoreSearchButton() {
    document.getElementById("searchButton").removeAttribute("disabled");
  }

  // show message based on search results
  displayMessage(resultCount, messageString) {
    let message = document.getElementById("resultMessage");
    message.style.animationIterationCount = "0";
    switch (resultCount) {
      case -2:
        message.innerHTML = "USGS Error: " + messageString;
        break;
      case -1:
        message.innerHTML = "Google Maps Error: " + messageString;
        break;
      case 0:
        message.innerHTML = "No Earthquakes Found";
        break;
      default:
        message.innerHTML = "Earthquakes Found: " + resultCount;
    }
  }

  // use results to build table and draw markers on map
  displayResults(mm, results, lat, lng) {
    let tableBody = document.getElementById("tableBody");
    let bounds = new google.maps.LatLngBounds(); // for updating map zoom level
    bounds.extend({ lat: lat, lng: lng });

    // build table row and draw marker for each result
    for (let i = 0; i < results.length; i++) {
      let tableRow = document.createElement("tr");

      tableRow.appendChild(document.createElement("td"));

      let magStr = results[i].properties.mag.toFixed(1);
      let placeStr = results[i].properties.place;
      let dateStr = new Date(results[i].properties.time).toLocaleString();
      tableRow.appendChild(this.createTableCell(1, magStr));
      tableRow.appendChild(this.createTableCell(1, placeStr));
      tableRow.appendChild(this.createTableCell(1, dateStr));
      tableRow.appendChild(this.createTableCell(0, results[i].properties.time)); // hidden column for sorting

      tableBody.appendChild(tableRow);
      mm.drawMarker(
        tableRow,
        magStr + " - " + placeStr + "<br>" + dateStr,
        results[i],
        bounds
      );
    }

    mm.map.fitBounds(bounds); // zoom out on map to show all markers
    this.renewEventListeners(); // renew click events for sorting table columns
    document.getElementById("resultContainer").style.display = "flex";
  }

  // create table cell containing given text content
  createTableCell(contentFlag, cellContent) {
    let cell = document.createElement("td");
    cell.innerHTML = cellContent;
    if (contentFlag == 0) cell.style.display = "none";
    return cell;
  }

  // allow sorting table column by ascending or descending order
  sortTableColumn(columnIndex) {
    let tableBody = document.getElementById("tableBody");
    let rows = Array.from(tableBody.querySelectorAll("tr"));

    let columnHeader = document
      .getElementById("tableHeadRow")
      .querySelector(`th:nth-child(${columnIndex})`);
    let ascending = columnHeader.className == "asc";

    let querySelect = `td:nth-child(${columnIndex})`;
    if (ascending) {
      // sort in descending
      rows.sort((row1, row2) => {
        let val1 = parseFloat(row1.querySelector(querySelect).textContent);
        let val2 = parseFloat(row2.querySelector(querySelect).textContent);
        return val2 < val1 ? -1 : val2 > val1 ? 1 : 0;
      });
      columnHeader.className = "desc";
    } else {
      // sort in ascending
      rows.sort((row1, row2) => {
        let val1 = parseFloat(row1.querySelector(querySelect).textContent);
        let val2 = parseFloat(row2.querySelector(querySelect).textContent);
        return val1 < val2 ? -1 : val1 > val2 ? 1 : 0;
      });
      columnHeader.className = "asc";
    }

    rows.forEach((row) => tableBody.appendChild(row));
  }

  // remove and replace event listeners by cloning nodes
  renewEventListeners() {
    let magnitudeColumn = document.getElementById("magnitudeColumn");
    magnitudeColumn.parentNode.replaceChild(
      magnitudeColumn.cloneNode(true),
      magnitudeColumn
    );
    magnitudeColumn = document.getElementById("magnitudeColumn");
    magnitudeColumn.addEventListener("click", () => {
      this.sortTableColumn(2);
    });

    let dateColumn = document.getElementById("dateColumn");
    dateColumn.parentNode.replaceChild(dateColumn.cloneNode(true), dateColumn);
    dateColumn = document.getElementById("dateColumn");
    dateColumn.addEventListener("click", () => {
      this.sortTableColumn(5);
    });
  }
}

let pm = new PageManager();
pm.loadPage();
