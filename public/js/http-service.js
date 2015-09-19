/**
 * Created by Ahmed on 9/18/2015.
 */

angular.module('httpService', [])

    .factory('Users', function($http) {
        return {
            get: function() {
                console.log("What");
                return $http.get('/api/users');
            },

            create: function(userData) {
                console.log("Now");
                return $http.post('/api/newuser', userData);
            }
        }
    });