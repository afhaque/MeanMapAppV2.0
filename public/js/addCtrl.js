var addCtrl = angular.module('addCtrl', ['geolocation', 'gservice']);
addCtrl.controller('addCtrl', function($scope, $http, $rootScope, geolocation, gservice){

    // Initialize Variables
    $scope.formData = {};
    $scope.blah = "";
    var coords = {};
    var lat = 0;
    var long = 0;

    // Get User's Location on Window Load (uses ngGeolocation)
    geolocation.getLocation().then(function(data){
        coords = {lat:data.coords.latitude, long:data.coords.longitude};

        // Display coordinates in location textbox rounded to three decimal points
        $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
        $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);

        gservice.refresh(coords.lat, coords.long);


    });

    // Get Coordinates based on clicks
    $rootScope.$on("clicked", function(){
        $scope.$apply(function(){
            $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
            $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
        });
    });

    // Creates a new user using all of the form fields
    $scope.createUser = function(){
        // Grabs all of the text box fields
        var userData = {
            username: $scope.formData.username,
            gender: $scope.formData.gender,
            age: $scope.formData.age,
            favlang: $scope.formData.favlang,
            latitude: $scope.formData.latitude,
            longitude: $scope.formData.longitude
        };
        // Saves the user data to the db
        $http.post('/users', userData)
            .success(function(data){

                // Clear the Form (except location)
                $scope.formData.username = "";
                $scope.formData.gender = "";
                $scope.formData.age = "";
                $scope.formData.favlang = "";

            })
            .error(function(data){
                console.log('Error: ' + data);
            });

        // Launch GoogleMapService
        gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
    };
});
