// This class initializes the Google Map onto the page.
class MapManager {
  constructor() {
    this.markers = [];
    this.map = null;
  }

  // on page load, initialize a map
  initMap() {
    // Default location: San Francisco
    let longitude = -122.42;
    let latitude = 37.77;
    let map = new google.maps.Map(document.getElementById("map"), {
      zoom: 12,
      center: { lat: latitude, lng: longitude },
    });
    this.map = map;
  }

  // async search for the location and return location coordinates
  async searchLocation(geocoder) {
    return new Promise((resolve, reject) => {
      let address = document.getElementById("inputLocation").value;

      geocoder.geocode({ address: address }, (results, status) => {
        if (status === "OK") {
          let coords = results[0].geometry.location; // LatLng object
          this.map.setCenter(coords);

          resolve({
            latitude: parseFloat(coords.lat().toFixed(2)),
            longitude: parseFloat(coords.lng().toFixed(2)),
          });
        } else {
          reject(status);
        }
      });
    });
  }

  // create a pin marker for the searched location
  addLocationMarker(latitude, longitude) {
    let marker = new google.maps.Marker({
      map: this.map,
      position: { lat: latitude, lng: longitude },
    });
    this.markers.push(marker);
  }

  // draw a custom marker on the map
  drawMarker(tableRow, fullHTMLStr, eventInfo, bounds) {
    let coords = eventInfo.geometry.coordinates;
    let magnitude = eventInfo.properties.mag;
    let eventCenter = { lat: coords[1], lng: coords[0] }; // maps api LatLngLiteral
    bounds.extend(eventCenter); // update zoom level to fit existing results

    let initialIcon = {
      path: google.maps.SymbolPath.CIRCLE,
      scale: magnitude * 5,
      fillColor: "red",
      fillOpacity: 0.25,
      strokeColor: "white",
      strokeWeight: 0.5,
    };

    let selectedIcon = {
      path: google.maps.SymbolPath.CIRCLE,
      scale: magnitude * 5,
      fillColor: "green",
      fillOpacity: 0.25,
      strokeColor: "black",
      strokeWeight: 0.5,
    };

    const eventCircle = new google.maps.Marker({
      position: eventCenter,
      icon: initialIcon,
      map: this.map,
    });

    let toggleMarker = function () {
      if (tableRow.cells[0].style.backgroundColor != "rgb(103, 224, 117)") {
        tableRow.cells[0].style.backgroundColor = "rgb(103, 224, 117)";
        eventCircle.setIcon(selectedIcon);
      } else {
        tableRow.cells[0].style.backgroundColor = "rgb(255, 255, 255)";
        eventCircle.setIcon(initialIcon);
      }
    };

    // toggle marker color on clicking row or marker
    tableRow.addEventListener("click", toggleMarker);
    eventCircle.addListener("click", toggleMarker);
    this.displayEventInfo(this.map, eventCircle, fullHTMLStr);
    this.markers.push(eventCircle);
  }

  // display map marker textbox on hover
  displayEventInfo(map, eventCircle, fullHTMLStr) {
    let infoWindow = new google.maps.InfoWindow({
      content: fullHTMLStr,
      position: eventCircle.center,
    });
    eventCircle.addListener("mouseover", () => {
      infoWindow.open(map, eventCircle);
    });
    eventCircle.addListener("mouseout", () => {
      infoWindow.close();
    });
  }

  // remove all old markers from the map after new search
  removeMarkers() {
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers = [];
  }
}
