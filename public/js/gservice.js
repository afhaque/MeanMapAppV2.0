angular.module('gservice', [])
    .factory('gservice', function($rootScope, $http, $timeout){

        // Service our Factory Will Return
        var googleMapService = {};
        googleMapService.clickLat  = 0;
        googleMapService.clickLong = 0;

        // Array of locations obtained from API call
        var locations = [];

        var lastMarker;

        // Starting Location (Htown Vicious)
        var startLat = 39.737;
        var startLng = -95.546;

        // Refresh function
        googleMapService.refresh = function(latitude, longitude){

            // Clears the holding array of locations
            locations = [];

            // Ajax call
            $http.get('/users').success(function(response){

                // Pulls the locations from the API and converts them into map coordinates

                locations = responseToLocations(response);

                // Initializes the Map
                initialize(latitude, longitude);
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

        function initialize(latitude, longitude) {
            var myLatLng = {lat: startLat, lng: startLng};
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

            // Move to the submitted location
            map.panTo(new google.maps.LatLng(latitude, longitude));

            google.maps.event.addListener(map, 'click', function(e){
                var marker = new google.maps.Marker({
                    position: e.latLng,
                    animation: google.maps.Animation.BOUNCE,
                    map: map,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                });

                if(lastMarker){
                    lastMarker.setMap(null);
                }
                lastMarker = marker;
                map.panTo(marker.position);


                // Update Broadcasted Variable
                googleMapService.clickLat = marker.getPosition().lat();
                googleMapService.clickLong = marker.getPosition().lng();
                $rootScope.$broadcast("clicked");
            });
        }

        google.maps.event.addDomListener(window, 'load',
            googleMapService.refresh(startLat, startLng));

        return googleMapService;
    });

