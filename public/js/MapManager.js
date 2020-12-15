function initMap() {
    // Default map location: OSU
    var longitude = -123.2794443;
    var latitude = 44.5637806;

    // embed a google map
    var map = new google.maps.Map(this.map, {
        zoom: 12,
        center: {lat: latitude, lng: longitude}
    });
};