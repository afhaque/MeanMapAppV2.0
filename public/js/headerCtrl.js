var headerCtrl = angular.module('headerCtrl', ['geolocation', 'gservice']);
queryCtrl.controller('queryCtrl', function($scope, $log, $http, $rootScope, geolocation, gservice){


function headerCtrl($scope, $location)
{
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
}