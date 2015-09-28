// Create the headerCtrl module and controller. Note that it depends on $location service
var headerCtrl = angular.module('headerCtrl', []);
headerCtrl.controller('headerCtrl', function($scope, $location) {

    // Sets the isActive value based on the current URL location
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
});