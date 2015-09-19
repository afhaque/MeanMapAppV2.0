/**
 * Created by Ahmed on 9/18/2015.
 */

angular.module('userController', [])

    .controller('mainController', function($scope, $http, Users) {
        $scope.formData = {};

        // When submitting the add form, send the text to the node API
        $scope.createUser = function() {
            if (!$.isEmptyObject($scope.formData)) {


                // call the create function from our service (returns a promise object)
                Users.create($scope.formData)

                    // if successful creation, call our get function to get all the new todos
                    .success(function(data) {
                        $scope.formData = {}; // clear the form so our user is ready to enter another
                        $scope.users = data; // assign our new list of users
                    });
            }
        };
    });