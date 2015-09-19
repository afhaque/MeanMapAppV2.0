/**
 * Created by Ahmed on 9/19/2015.
 */
function initMap() {
    var myLatLng = {lat: 29.737, lng: -95.546};

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: myLatLng
    });

    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'Hello World!'
    });
}