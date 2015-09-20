angular.module('meanMapApp',['geolocation'])
    .controller('mainCtrl', function ($scope, $http, geolocation) {

        // Initialize Variables
        $scope.formData = {};
        var coords = {};
        var lat = 0;
        var long= 0;

        // Get Location on Window Load
        geolocation.getLocation().then(function(data){
            coords = {lat:data.coords.latitude, long:data.coords.longitude};
            $scope.formData.location  = parseFloat(coords.lat).toFixed(3) + "," + parseFloat(coords.long).toFixed(3);

        });

        // Post New User
        $scope.createUser = function(){
            var userData = {
                username: $scope.formData.username,
                gender: $scope.formData.gender,
                age: $scope.formData.age,
                favlang: $scope.formData.favlang,
                geometry:{
                    coordinates: [coords.long, coords.lat]
                }
            };
            $http.post('/users', userData)
                .success(function(data){
                    $scope.formData = {}; // clear the form so user can start a fresh
                    $scope.users = data; // This makes the users list available to the scope users variable if needed. Could be used for the map.
                    console.log(data);
                })
                .error(function(data){
                    console.log('Error: ' + data);
                });
        };

    });