var queryCtrl = angular.module('queryCtrl', ['geolocation', 'gservice']);
queryCtrl.controller('queryCtrl', function($scope, $log, $http, $rootScope, geolocation, gservice){

    // Initialize Variables
    $scope.formData = {};
    var queryBody = {};
    var queryResults = {};

    // Get User's Location on Window Load (uses ngGeolocation)
    geolocation.getLocation().then(function(data){
        coords = {lat:data.coords.latitude, long:data.coords.longitude};

        // Display coordinates in location textbox rounded to three decimal points
        $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
        $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);
    });

    // Get Coordinates based on clicks
    $rootScope.$on("clicked", function(){
        $scope.$apply(function(){
            $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
            $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
        });
    });

    // Get Query Parameters
    var lat = $scope.formData.latitude;
    var lng = $scope.formData.longitude;
    var distance = $scope.formData.distance;
    var minAge = $scope.formData.minage;
    var maxAge = $scope.formData.maxage;
    var favLang = $scope.formData.favlang;
    var htmlVerified = $scope.formData.verified;

    $scope.queryUsers = function(){

        // Assemble Query Body
        queryBody = {
            longitude: parseFloat($scope.formData.longitude),
            latitude: parseFloat($scope.formData.latitude),
            distance: parseFloat($scope.formData.distance),
            minAge: $scope.formData.minage,
            maxAge: $scope.formData.maxage,
            favlang: $scope.formData.favlang,
            reqVerified: $scope.formData.verified
        };

        // Do an HTTP call to get the filtered JSON
        $http.post('/query', queryBody)
            .success(function(queryResults){
                // Pass the filtered results to the Google Map Service and refresh the map
                gservice.refresh(queryBody.latitude, queryBody.longitude, queryResults);
            })
            .error(function(queryResults){
                console.log('Error ' + queryResults);
            })
    };
});

