/**
 * Created by Ahmed on 9/19/2015.
 */
function initMap() {
    var myLatLng = {lat: 29.736655799999994, lng: -95.54598890000001};

    var minZoomLevel = 10;
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: myLatLng
    });

    map.data.loadGeoJson('/users');

    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'Hello World!'
    });

    var infowindow = new google.maps.InfoWindow({
        content: '<p><b>Username</b>: OldAndGold<br><b>Age</b>: 25<br>' +
        '<b>Gender</b>: Male<br><b>Favorite Language</b>: Fortran</p>'
    });

    marker.addListener('click', function(){
        infowindow.open(map, marker);
    });

    // Limit the zoom level
    google.maps.event.addListener(map, 'zoom_changed', function() {
        if (map.getZoom() > minZoomLevel) map.setZoom(minZoomLevel);
    });
}