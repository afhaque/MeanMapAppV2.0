/**
 * Created by Ahmed on 9/18/2015.
 */

var meanMapApp = angular.module('meanMapApp', []);

function mainController($scope, $http) {
    $scope.formData = {};

    // when submitting the form, send the text to the api
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
}