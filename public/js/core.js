angular.module('meanMapApp',['geolocation'])
    .controller('mainCtrl', function ($scope, $http, geolocation) {

        // Initialize Variables
        $scope.formData = {};
        var coords = {};

        // Get Location on Window Load
        geolocation.getLocation().then(function(data){
            coords = {lat:data.coords.latitude, long:data.coords.longitude};
            $scope.formData.location  = parseFloat(coords.lat).toFixed(3) + "," + parseFloat(coords.long).toFixed(3);
        });

        // Post New User
        $scope.createUser = function(){
            $http.post('/api/users', $scope.formData)
                .success(function(data){
                    $scope.formData = {}; // clear the form so user can start a fresh
                    $scope.users = data;
                    console.log(data);
                })
                .error(function(data){
                    console.log('Error: ' + data);
                });
        };

    });