// This class is responsible for making requests to USGS.
class DataRequestManager {
  constructor() {}

  // Gather user input from the page to create a URL.
  buildURL(latitude, longitude) {
    let baseURL = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&orderby=magnitude";

    let startDate = "&starttime=" + document.getElementById("input-start-date").value;
    let endDate = "&endtime=" + document.getElementById("input-end-date").value;
    if (document.getElementById("check-start-date").checked) {
      startDate = "";
    }
    if (document.getElementById("check-end-date").checked) {
      endDate = "";
    }

    let coordinates = "&latitude=" + latitude + "&longitude=" + longitude;
    let maxRadiusKm = "&maxradiuskm=" + document.getElementById("search-radius").value;
    let magnitudeRange =
      "&minmagnitude=" +
      document.getElementById("mag-min").value +
      "&maxmagnitude=" +
      document.getElementById("mag-max").value;
    let resultsLimit = "&limit=" + document.getElementById("result-limit").value;

    baseURL += startDate + endDate + coordinates + maxRadiusKm + magnitudeRange + resultsLimit;
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
