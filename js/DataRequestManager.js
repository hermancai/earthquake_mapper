// This class is responsible for making requests to USGS.
class DataRequestManager {
  constructor() {}

  // Gather user input from the page to create a URL.
  buildURL(latitude, longitude) {
    let baseURL =
      "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&orderby=magnitude";

    let startDate =
      "&starttime=" + document.getElementById("inputStartDate").value;
    let endDate = "&endtime=" + document.getElementById("inputEndDate").value;
    if (document.getElementById("checkStartDate").checked) {
      startDate = "";
    }
    if (document.getElementById("checkEndDate").checked) {
      endDate = "";
    }

    let coordinates = "&latitude=" + latitude + "&longitude=" + longitude;
    let maxRadiusKm =
      "&maxradiuskm=" + document.getElementById("searchRadius").value;
    let magnitudeRange =
      "&minmagnitude=" +
      document.getElementById("magMin").value +
      "&maxmagnitude=" +
      document.getElementById("magMax").value;
    let resultsLimit = "&limit=" + document.getElementById("resultLimit").value;

    baseURL +=
      startDate +
      endDate +
      coordinates +
      maxRadiusKm +
      magnitudeRange +
      resultsLimit;
    return baseURL;
  }

  // Async request to USGS and return JSON data.
  getData(latitude, longitude) {
    let urlBuilder = this.buildURL;
    return new Promise(function (resolve, reject) {
      let req = new XMLHttpRequest();
      let url = urlBuilder(latitude, longitude);
      req.open("GET", url, true);
      req.send();

      req.onload = function () {
        let response = JSON.parse(this.responseText);
        resolve(response);
      };

      req.onerror = function () {
        reject(this.status);
      };
    });
  }
}
