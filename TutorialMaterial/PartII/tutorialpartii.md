## Introduction

## Quick Primer on MongoDB Geo-Query Tools

## Revised App Skeleton

## Creating the Query View

Initial app.js (now includes partial handling for queryForm)

    // Declares the initial angular module "meanMapApp". Module grabs other controllers and services. Note the use of ngRoute.
    var app = angular.module('meanMapApp', ['addCtrl', 'geolocation', 'gservice', 'ngRoute'])
    
        // Configures Angular routing -- showing the relevant view and controller when needed.
        .config(function($routeProvider){
    
            // Join Team Control Panel
            $routeProvider.when('/join', {
                controller: 'addCtrl',
                templateUrl: 'partials/addForm.html',
    
                // Find Teammates Control Panel
            }).when('/find', {
                templateUrl: 'partials/queryForm.html',
    
                // All else forward to the Join Team Control Panel
            }).otherwise({redirectTo:'/join'})
        });


queryForm.html partial

    <!-- Find Teammates (Query) Form -->
    <div class="col-md-5">
    
        <!-- Creates Main Panel -->
        <div class="panel panel-default">
    
            <!-- Panel Title -->
            <div class="panel-heading">
                <h2 class="panel-title text-center">Find Teammates! (Map Query) <span class="glyphicon glyphicon-search"></span></h2>
            </div>
    
            <!-- Panel Body -->
            <div class="panel-body">
    
                <!-- Creates Form -->
                <form name ="queryForm">
    
                    <!-- Text Boxes and Other User Inputs. Note ng-model binds the values to Angular $scope -->
                    <div class="form-group">
                        <label for="latitude">Your Latitude</label>
                        <input type="text" class="form-control" id="latitude" placeholder="39.5" ng-model="formData.latitude" readonly>
                    </div>
                    <div class="form-group">
                        <label for="longitude">Your Longitude</label>
                        <input type="text" class="form-control" id="longitude" placeholder="-98.35" ng-model="formData.longitude" readonly>
                    </div>
                    <div class="form-group">
                        <label for="distance">Max. Distance (miles)</label>
                        <input type="text" class="form-control" id="distance" placeholder="500" ng-model="formData.distance">
                    </div>
    
                    <!-- Note ng-true-value which translates check values into explicit gender strings -->
                    <label>Gender</label>
                    <div class="form-group">
                        <label class="checkbox-inline">
                            <input type="checkbox" name="optionsRadios" id="checkmale" value="Male" ng-model="formData.male" ng-true-value = "'Male'">
                            Male
                        </label>
                        <label class="checkbox-inline">
                            <input type="checkbox" name="optionsRadios" id="checkfemale" value="Female" ng-model="formData.female" ng-true-value="'Female'">
                            Female
                        </label>
                        <label class="checkbox-inline">
                            <input type="checkbox" name="optionsRadios" id="checkother" value="What's it to ya?" ng-model="formData.other" ng-true-value="'What\'s it to ya?'">
                            What's it to ya?
                        </label>
                    </div>
                    <div class="form-group">
                        <label for="minage">Min. Age</label>
                        <input type="number" class="form-control" id="minage" placeholder="5" ng-model="formData.minage">
                    </div>
                    <div class="form-group">
                        <label for="maxage">Max Age</label>
                        <input type="number" class="form-control" id="maxage" placeholder="80" ng-model="formData.maxage">
                    </div>
                    <div class="form-group">
                        <label for="favlang">Favorite Language</label>
                        <input type="text" class="form-control" id="favlang" placeholder="Fortran" ng-model="formData.favlang">
                    </div>
                    <div class="form-group">
                        <div class="checkbox">
                            <label>
                                <input type="checkbox" name="verified" id="radiomale" value="True" ng-model="formData.verified"> <strong>Include Only HTML5 Verified Locations?</strong>
                            </label>
                        </div>
                    </div>
    
                    <!-- Query button. Note that its tied to queryUsers() function from queryCtrl.  -->
                    <button type="submit" class="btn btn-danger btn-block" ng-click="queryUsers()">Search</button>
                </form>
            </div>
    
            <!-- Footer panel for displaying count. Note how it will only display if queryCount is greater than 0 -->
            <div ng-show="queryCount>0" class="panel-footer">
                <p class="text-center">Hot Dang! We Found {{queryCount}} Teammates.</p>
            </div>
        </div>
    </div>

addForm.html partial

    <!-- "Join Team" (Post) Form -->
    <div class="col-md-5">
    
        <!-- Creates Main Panel -->
        <div class="panel panel-default">
    
            <!-- Panel Title -->
            <div class="panel-heading">
                <h2 class="panel-title text-center">Join the Scotch Team! <span class="glyphicon glyphicon-map-marker"></span></h2>
            </div>
    
            <!-- Panel Body -->
            <div class="panel-body">
    
                <!-- Creates Form (novalidate disables HTML validation, Angular will control) -->
                <form name ="addForm" novalidate>
    
                    <!-- Text Boxes and Other User Inputs. Note ng-model binds the values to Angular $scope -->
                    <div class="form-group">
                        <label for="username">Username <span class="badge">All fields required</span></label>
                        <input type="text" class="form-control" id="username" placeholder="OldandGold" ng-model="formData.username" required>
                    </div>
                    <label class="radio control-label">Gender</label>
                    <div class="radio">
                        <label>
                            <input type="radio" name="optionsRadios" id="radiomale" value="Male" ng-model="formData.gender">
                            Male
                        </label>
                    </div>
                    <div class="radio" required>
                        <label>
                            <input type="radio" name="optionsRadios" id="radiofemale" value="Female" ng-model="formData.gender">
                            Female
                        </label>
                    </div>
                    <div class="radio">
                        <label>
                            <input type="radio" name="optionsRadios" id="radioother" value="What's it to ya?" ng-model="formData.gender">
                            What's it to ya?
                        </label>
                    </div>
                    <div class="form-group">
                        <label for="age">Age</label>
                        <input type="number" class="form-control" id="age" placeholder="72" ng-model="formData.age" required>
                    </div>
                    <div class="form-group">
                        <label for="language">Favorite Language</label>
                        <input type="text" class="form-control" id="language" placeholder="Fortran" ng-model="formData.favlang" required>
                    </div>
                    <div class="form-group">
                        <label for="latitude">Latitude</label>
                        <input type="text" class="form-control" id="latitude" value="39.500" ng-model="formData.latitude" readonly>
                    </div>
                    <div class="form-group">
                        <label for="longitude">Longitude</label>
                        <input type="text" class="form-control" id="longitude" value="-98.350" ng-model="formData.longitude" readonly>
                    </div>
                    <div class="form-group">
                        <!-- Note RefreshLoc button tied to addCtrl. This requests a refresh of the HTML5 verified location. -->
                        <label for="verified">HTML5 Verified Location? <span><button ng-click="refreshLoc()" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-refresh"></span></button></span></label>
                        <input type="text" class="form-control" id="verified" placeholder= "Nope (Thanks for spamming my map...)" ng-model="formData.htmlverified" readonly>
                    </div>
    
                    <!-- Submit button. Note that its tied to createUser() function from addCtrl. Also note ng-disabled logic which prevents early submits.  -->
                    <button type="submit" class="btn btn-danger btn-block" ng-click="createUser()" ng-disabled="addForm.$invalid">Submit</button>
                </form>
            </div>
        </div>
    </div>

Revised index.html File 

    <!doctype html>
    <!-- Declares meanMapApp as the starting Angular module -->
    <html class="no-js" ng-app="meanMapApp">
    <head>
        <meta charset="utf-8">
        <title>Scotch MEAN Map</title>
        <meta name="description" content="An example demonstrating Google Map integration with MEAN Apps">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- CSS -->
        <link rel="stylesheet" href="../bower_components/bootstrap/dist/css/bootstrap.css"/>
        <link rel="stylesheet" href="style.css"/>
    
        <!-- Google Maps API -->
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDrn605l7RPadiwdzsOlRw9O28lxfYBJ6s"></script>
        <!-- Modernizr -->
        <script src="../bower_components/modernizr/bin/modernizr"></script>
        <!-- JS Source -->
        <script src="../bower_components/jquery/jquery.js"></script>
        <script src="../bower_components/angular/angular.js"></script>
        <script src="../bower_components/angular-route/angular-route.js"></script>
        <script src="../bower_components/angularjs-geolocation/dist/angularjs-geolocation.min.js"></script>
        <!-- Angular Source -->
        <script src="js/app.js"></script>
        <script src="js/addCtrl.js"></script>
        <script src="js/gservice.js"></script>
    
    </head>
    <!-- Removed ng-controller. Now this will be handled in app.js -->
    <body>
    <div class="container">
        <div class="header">
            <ul class="nav nav-pills pull-right">
                <!-- Links to the two menu views included -->
                <li active><a href="/#/join">Join the Team</a></li>
                <li disabled><a href="/#/find">Find Teammates</a></li>
            </ul>
            <h3 class="text-muted">The Scotch MEAN MapApp</h3>
        </div>
        <!-- Map and Side Panel -->
        <div class="row content">
            <!-- Google Map -->
            <div class="col-md-7">
                <div id="map"></div>
            </div>
            <!-- Side Panel -- Now Handled by ng-view -->
            <div ng-view></div>
    
        </div>
        <hr/>
        <!-- Footer -->
        <div class="footer">
            <p class="text-center"><span class="glyphicon glyphicon-check"></span> Created by Ahmed Haque for Scotch IO -
                <a href="https://scotch.io/">App Tutorial</a> | <a href="https://github.com/afhaque/MeanMapAppV2.0">Github Repo</a></p>
        </div>
    </div>
    </body>
    </html>

## Creating the Query Logic and Express Routes

Modifications to Route.js for handling query (uses query builder)

    // Retrieves JSON records for all users who meet a certain set of query conditions
    app.post('/query/', function(req, res){

        // Grab all of the query parameters from the body.
        var lat             = req.body.latitude;
        var long            = req.body.longitude;
        var distance        = req.body.distance;
        var male            = req.body.male;
        var female          = req.body.female;
        var other           = req.body.other;
        var minAge          = req.body.minAge;
        var maxAge          = req.body.maxAge;
        var favLang         = req.body.favlang;
        var reqVerified     = req.body.reqVerified;

        // Opens a generic Mongoose Query. Depending on the post body we will...
        var query = User.find({});

        // ...include filter by Max Distance (converting miles to meters)
        if(distance){

            // Using MongoDB's geospatial querying features. (Note how coordinates are set [long, lat]
            query = query.where('location').near({ center: {type: 'Point', coordinates: [long, lat]},

                // Converting meters to miles. Specifying spherical geometry (for globe)
                maxDistance: distance * 1609.34, spherical: true});

        }

        // ...include filter by Gender (all options)
        if(male || female || other){
            query.or([{ 'gender': male }, { 'gender': female }, {'gender': other}]);
        }

        // ...include filter by Min Age
        if(minAge){
            query = query.where('age').gte(minAge);
        }

        // ...include filter by Max Age
        if(maxAge){
            query = query.where('age').lte(maxAge);
        }

        // ...include filter by Favorite Language
        if(favLang){
            query = query.where('favlang').equals(favLang);
        }

        // ...include filter for HTML5 Verified Locations
        if(reqVerified){
            query = query.where('htmlverified').equals("Yep (Thanks for giving us real data!)");
        }

        // Execute Query and Return the Query Results
        query.exec(function(err, users){
            if(err)
                res.send(err);

            // If no errors, respond with a JSON of all users that meet the criteria
            res.json(users);
        });
    });

## Creating the Query Controller

Query Controller

    // Creates the addCtrl Module and Controller. Note that it depends on 'geolocation' and 'gservice' modules.
    var queryCtrl = angular.module('queryCtrl', ['geolocation', 'gservice']);
    queryCtrl.controller('queryCtrl', function($scope, $log, $http, $rootScope, geolocation, gservice){
    
        // Initializes Variables
        // ----------------------------------------------------------------------------
        $scope.formData = {};
        var queryBody = {};
    
        // Functions
        // ----------------------------------------------------------------------------
    
        // Get User's actual coordinates based on HTML5 at window load
        geolocation.getLocation().then(function(data){
            coords = {lat:data.coords.latitude, long:data.coords.longitude};
    
            // Set the latitude and longitude equal to the HTML5 coordinates
            $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
            $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);
        });
    
        // Get coordinates based on mouse click. When a click event is detected....
        $rootScope.$on("clicked", function(){
    
            // Run the gservice functions associated with identifying coordinates
            $scope.$apply(function(){
                $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
                $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
            });
        });
    
        // Take query parameters and incorporate into a JSON queryBody
        $scope.queryUsers = function(){
    
            // Assemble Query Body
            queryBody = {
                longitude: parseFloat($scope.formData.longitude),
                latitude: parseFloat($scope.formData.latitude),
                distance: parseFloat($scope.formData.distance),
                male: $scope.formData.male,
                female: $scope.formData.female,
                other: $scope.formData.other,
                minAge: $scope.formData.minage,
                maxAge: $scope.formData.maxage,
                favlang: $scope.formData.favlang,
                reqVerified: $scope.formData.verified
            };
    
            // Post the queryBody to the /query POST route to retrieve the filtered results
            $http.post('/query', queryBody)
    
                // Store the filtered results in queryResults
                .success(function(queryResults){
    
                    // Query Body and Result Logging
                    console.log("QueryBody:");
                    console.log(queryBody);
                    console.log("QueryResults:");
                    console.log(queryResults);
   
                    // Count the number of records retrieved for the panel-footer
                    $scope.queryCount = queryResults.length;
                })
                .error(function(queryResults){
                    console.log('Error ' + queryResults);
                })
        };
    });

Modified app.js

    var app = angular.module('meanMapApp', ['addCtrl', 'queryCtrl', 'geolocation', 'gservice', 'ngRoute'])

Modified Teammates control panel

            // Find Teammates Control Panel
        }).when('/find', {
            controller: 'queryCtrl',
            templateUrl: 'partials/queryForm.html',

Add queryCtrl.js to index.html

    <script src="js/queryCtrl.js"></script>

Rerun the example we ran previously.

## Modifying the Google Maps Service

Gservice Refresh Function with optional filtered results parameter

        // Refresh the Map with new data. Takes three parameters (lat, long, and filtering results)
        googleMapService.refresh = function(latitude, longitude, filteredResults){

            // Clears the holding array of locations
            locations = [];

            // Set the selected lat and long equal to the ones provided on the refresh() call
            selectedLat = latitude;
            selectedLong = longitude;

            // If filtered results are provided in the refresh() call...
            if (filteredResults){

                // Then convert the filtered results into map points.
                locations = convertToMapPoints(filteredResults);

                // Then, initialize the map -- noting that a filter was used (to mark icons yellow)
                initialize(latitude, longitude, true);
            }

            // If no filter is provided in the refresh() call...
            else {

                // Perform an AJAX call to get all of the records in the db.
                $http.get('/users').success(function(response){

                    // Then convert the results into map points
                    locations = convertToMapPoints(response);

                    // Then initialize the map -- noting that no filter was used.
                    initialize(latitude, longitude, false);
                }).error(function(){});
            }
        };

Gservice Initialization Function modified to handle filtering

        // Initializes the map
        var initialize = function(latitude, longitude, filter) {

            // Uses the selected lat, long as starting point
            var myLatLng = {lat: selectedLat, lng: selectedLong};

            // If map has not been created...
            if (!map){

                // Create a new map and place in the index.html page
                var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 3,
                    center: myLatLng
                });
            }

            // If a filter was used set the icons yellow, otherwise blue
            if(filter){
                icon = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
            }
            else{
                icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
            }

            // Loop through each location in the array and place a marker
            locations.forEach(function(n, i){
                var marker = new google.maps.Marker({
                    position: n.latlon,
                    map: map,
                    title: "Big Map",
                    icon: icon,
                });

                // For each marker created, add a listener that checks for clicks
                google.maps.event.addListener(marker, 'click', function(e){

                    // When clicked, open the selected marker's message
                    currentSelectedMarker = n;
                    n.message.open(map, marker);
                });
            });

            // Set initial location as a bouncing red marker
            var initialLocation = new google.maps.LatLng(latitude, longitude);
            var marker = new google.maps.Marker({
                position: initialLocation,
                animation: google.maps.Animation.BOUNCE,
                map: map,
                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            });
            lastMarker = marker;

            // Function for moving to a selected location
            map.panTo(new google.maps.LatLng(latitude, longitude));

            // Clicking on the Map moves the bouncing red marker
            google.maps.event.addListener(map, 'click', function(e){
                var marker = new google.maps.Marker({
                    position: e.latLng,
                    animation: google.maps.Animation.BOUNCE,
                    map: map,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                });

                // When a new spot is selected, delete the old red bouncing marker
                if(lastMarker){
                    lastMarker.setMap(null);
                }

                // Create a new red bouncing marker and move to it
                lastMarker = marker;
                map.panTo(marker.position);

                // Update Broadcasted Variable (lets the panels know to change their lat, long values)
                googleMapService.clickLat = marker.getPosition().lat();
                googleMapService.clickLong = marker.getPosition().lng();
                $rootScope.$broadcast("clicked");
            });
        };

Modifying the queryCtrl to refresh google maps

        // Pass the filtered results to the Google Map Service and refresh the map
        gservice.refresh(queryBody.latitude, queryBody.longitude, queryResults);

## Final Tweaks

There are plenty of ways to improve this app. Including bounding boxes for the entire maps, using GEOJson, setting permanent max zooms, or styling the Google Map using a pre-made style.