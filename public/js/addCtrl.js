// Creates the addCtrl
var addCtrl = angular.module('addCtrl', ['geolocation', 'gservice']);
addCtrl.controller('addCtrl', function($scope, $http, $rootScope, geolocation, gservice){

    // Initialize Variables
    $scope.formData = {};
    var coords = {};
    var lat = 0;
    var long = 0;

    // Set initial coordinates to the center of the US
    $scope.formData.longitude = -98.350;
    $scope.formData.latitude = 39.500;

    // Get User's Location on Window Load (uses ngGeolocation)
    geolocation.getLocation().then(function(data){
        coords = {lat:data.coords.latitude, long:data.coords.longitude};

        // Display coordinates in location textbox rounded to three decimal points
        $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
        $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);
        $scope.formData.htmlverified = "Yep (Thanks for giving us real data!)";
        gservice.refresh(coords.lat, coords.long);
    });

    // Get Coordinates based on clicks
    $rootScope.$on("clicked", function(){
        $scope.$apply(function(){
            $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
            $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
            $scope.formData.htmlverified = "Nope (Thanks for spamming my map...)";
        });
    });

    // Get User's HTML5 Verified Location
    $scope.refreshLoc = function(){
        // Get User's Location on Window Load (uses ngGeolocation)
        geolocation.getLocation().then(function(data){
            coords = {lat:data.coords.latitude, long:data.coords.longitude};

            // Display coordinates in location textbox rounded to three decimal points
            $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
            $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);
            $scope.formData.htmlverified = "Yep (Thanks for giving us real data!)";
            gservice.refresh(coords.lat, coords.long);
        });
    };

    // Creates a new user using all of the form fields
    $scope.createUser = function() {
        // Grabs all of the text box fields
        var userData = {
            username: $scope.formData.username,
            gender: $scope.formData.gender,
            age: $scope.formData.age,
            favlang: $scope.formData.favlang,
            location: [$scope.formData.longitude, $scope.formData.latitude],
            htmlverified: $scope.formData.htmlverified
        };
        // Saves the user data to the db
        $http.post('/users', userData)
            .success(function (data) {

                // Clear the Form (except location)
                $scope.formData.username = "";
                $scope.formData.gender = "";
                $scope.formData.age = "";
                $scope.formData.favlang = "";

            })
            .error(function (data) {
                console.log('Error: ' + data);
            });

        // Launch GoogleMapService
        gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
    };
});

