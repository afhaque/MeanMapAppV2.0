angular.module('gservice', [])
    .factory('gservice', function($http, $timeout){

        // Service our Factory Will Return
        var googleMapService = {};

        // Array of locations obtained from API call
        var locations = [];

        // Refresh function
        googleMapService.refresh = function(){

            // Clears the holding array of locations
            locations = [];

            // Ajax call
            $http.get('/users').success(function(response){

                // Pulls the locations from the API and converts them into map coordinates

                locations = responseToLocations(response);

                // Initializes the Map
                initialize();
            }).error(function(){});
        };


        /***************************
         * Get the bounds from an array
         * of locations
         **************************/
        function getBounds(locations) {
            var latlngbounds = new google.maps.LatLngBounds();
            locations.forEach(function(n) {
                latlngbounds.extend(n.latlon);
            });
            return latlngbounds;
        }

        function responseToLocations(response){
            var locations = [];

            // Loop through all of the locations
            for(var i= 0; i < response.length; i++) {
                var user = response[i];

                // Create popup window
                var  contentString = '<p><b>Username</b>: ' + user.username + '<br><b>Age</b>: ' + user.age + '<br>' +
                    '<b>Gender</b>:' + user.gender + '<br><b>Favorite Language</b>:' + user.favlang + '</p>';

                locations.push(new Location(
                    new google.maps.LatLng(user.latitude, user.longitude),
                    new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 320
                    }),
                    user.username,
                    user.gender,
                    user.age,
                    user.favlang
                ))
            }
            return locations;
        }

        function Location(latlon, message, username, gender, age, favlang){
            this.latlon = latlon;
            this.message = message;
            this.username = username;
            this.gender = gender;
            this.age = age;
            this.favlang = favlang
        }

        function setMarker(position, map){
            var marker = new google.maps.Marker({
                position: position,
                animation: google.maps.Animation.BOUNCE,
                map: map
            });
            map.panTo(position);
        }

        function initialize() {

            var myLatLng = {lat: 29.737, lng: -95.546};

            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 5,
                center: myLatLng
            });

            locations.forEach(function(n, i){
               var marker = new google.maps.Marker({
                   position: n.latlon,
                   map: map,
                   title: "Big Title",
                   icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
               });
            });

/*            locations.forEach(function(n, i){
                //We create a marker
                var marker = new google.maps.Marker({
                    position: n.latlon,
                    map: map,
                    title: "Hello world",
                    icon: icon
                });
            });*/
        }

        google.maps.event.addDomListener(window, 'load',
            googleMapService.refresh);

        return googleMapService;
    });

