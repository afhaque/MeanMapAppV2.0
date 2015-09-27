var headerCtrl = angular.module('headerCtrl', []);
headerCtrl.controller('headerCtrl', function($scope, $location) {

    // Checks which menu item is active
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
});