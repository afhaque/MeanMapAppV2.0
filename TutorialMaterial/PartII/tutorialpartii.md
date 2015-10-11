## Introduction

Welcome back!

[Last time][1], we created an application that integrated Google Maps directly into the MEAN stack. The app provided us a panel to create users, tag their location based on latitude and longitude, and validate their whereabouts using HTML5 geolocation.

As of this writing, over 150 users have added themselves to our [demo map][2], with diverse locations strewn from San Francisco to Melbourne -- which is already pretty cool when you think about it!

![1-MapCurrent][3]

Today, we'll be taking our work a step further by adding a new control panel that allows us to filter users based on a variety of fields. The final product will allow us to query our map based on gender, age, favorite language, proximity, and whether a user's location has been HTML5 verified. Additionally, this tutorial will give us an opportunity to introduce some of MongoDB's geospatial query tools.

As you follow along, feel encouraged to grab the [source code][4]. Also, if you're joining us for the first time, you can download the code from [Part I using this link][5].

## Revised App Skeleton

To begin, let's make some adjustments to our app's structure. Go ahead and create a new `queryCtrl.js` file as well as a directory called `partials`, which will hold the files `addForm.html` and `queryForm.html`.

<pre><code class="language-bash">
MapApp
-- app // BACKEND 
---- model.js 
---- routes.js 

-- public // FRONTEND
---- index.html 
---- js
------ app.js 
------ addCtrl.js 
------ queryCtrl.js // *new* 
------ gservice.js 
---- style.css
---- partials // *new*
------ addForm.html // *new*
------ queryForm.html // *new*

-- server.js // EXPRESS SERVER
-- package.json
</code></pre>

## Creating the Query View

Since our app wil now have two separate control panels -- one for adding users and one for querying users, we're going to utilize Angular's routing module [ngRoute][6] to display the correct panel when needed.

To do this, we're going to store the code associated with each panel in its own HTML partial. We'll then specify in our main Angular module (`app.js`) that our application should display the `queryForm` partial when the URL includes `/find` and the `addForm` partial for all other URLs.

Let's go ahead and extract the 'Add Form' code previously found in our `index.html` file and paste it into the `addForm.html` file of our `partials` folder.

<pre><code class="language-markup">
&lt;!-- addForm.html --&gt;
        
&lt;!-- "Join Team" (Post) Form --&gt;
&lt;div class="col-md-5"&gt;

    &lt;!-- Creates Main Panel --&gt;
    &lt;div class="panel panel-default"&gt;

        &lt;!-- Panel Title --&gt;
        &lt;div class="panel-heading"&gt;
            &lt;h2 class="panel-title text-center"&gt;Join the Scotch Team! &lt;span class="glyphicon glyphicon-map-marker"&gt;&lt;/span&gt;&lt;/h2&gt;
        &lt;/div&gt;

        &lt;!-- Panel Body --&gt;
        &lt;div class="panel-body"&gt;

            &lt;!-- Creates Form (novalidate disables HTML validation, Angular will control) --&gt;
            &lt;form name ="addForm" novalidate&gt;

                &lt;!-- Text Boxes and Other User Inputs. Note ng-model binds the values to Angular $scope --&gt;
                &lt;div class="form-group"&gt;
                    &lt;label for="username"&gt;Username &lt;span class="badge"&gt;All fields required&lt;/span&gt;&lt;/label&gt;
                    &lt;input type="text" class="form-control" id="username" placeholder="OldandGold" ng-model="formData.username" required&gt;
                &lt;/div&gt;
                &lt;label class="radio control-label"&gt;Gender&lt;/label&gt;
                &lt;div class="radio"&gt;
                    &lt;label&gt;
                        &lt;input type="radio" name="optionsRadios" id="radiomale" value="Male" ng-model="formData.gender"&gt;
                        Male
                    &lt;/label&gt;
                &lt;/div&gt;
                &lt;div class="radio" required&gt;
                    &lt;label&gt;
                        &lt;input type="radio" name="optionsRadios" id="radiofemale" value="Female" ng-model="formData.gender"&gt;
                        Female
                    &lt;/label&gt;
                &lt;/div&gt;
                &lt;div class="radio"&gt;
                    &lt;label&gt;
                        &lt;input type="radio" name="optionsRadios" id="radioother" value="What&#039;s it to ya?" ng-model="formData.gender"&gt;
                        What&#039;s it to ya?
                    &lt;/label&gt;
                &lt;/div&gt;
                &lt;div class="form-group"&gt;
                    &lt;label for="age"&gt;Age&lt;/label&gt;
                    &lt;input type="number" class="form-control" id="age" placeholder="72" ng-model="formData.age" required&gt;
                &lt;/div&gt;
                &lt;div class="form-group"&gt;
                    &lt;label for="language"&gt;Favorite Language&lt;/label&gt;
                    &lt;input type="text" class="form-control" id="language" placeholder="Fortran" ng-model="formData.favlang" required&gt;
                &lt;/div&gt;
                &lt;div class="form-group"&gt;
                    &lt;label for="latitude"&gt;Latitude&lt;/label&gt;
                    &lt;input type="text" class="form-control" id="latitude" value="39.500" ng-model="formData.latitude" readonly&gt;
                &lt;/div&gt;
                &lt;div class="form-group"&gt;
                    &lt;label for="longitude"&gt;Longitude&lt;/label&gt;
                    &lt;input type="text" class="form-control" id="longitude" value="-98.350" ng-model="formData.longitude" readonly&gt;
                &lt;/div&gt;
                &lt;div class="form-group"&gt;
                    &lt;!-- Note RefreshLoc button tied to addCtrl. This requests a refresh of the HTML5 verified location. --&gt;
                    &lt;label for="verified"&gt;HTML5 Verified Location? &lt;span&gt;&lt;button ng-click="refreshLoc()" class="btn btn-default btn-xs"&gt;&lt;span class="glyphicon glyphicon-refresh"&gt;&lt;/span&gt;&lt;/button&gt;&lt;/span&gt;&lt;/label&gt;
                    &lt;input type="text" class="form-control" id="verified" placeholder= "Nope (Thanks for spamming my map...)" ng-model="formData.htmlverified" readonly&gt;
                &lt;/div&gt;

                &lt;!-- Submit button. Note that its tied to createUser() function from addCtrl. Also note ng-disabled logic which prevents early submits.  --&gt;
                &lt;button type="submit" class="btn btn-danger btn-block" ng-click="createUser()" ng-disabled="addForm.$invalid"&gt;Submit&lt;/button&gt;
            &lt;/form&gt;
        &lt;/div&gt;
    &lt;/div&gt;
&lt;/div&gt;
</code></pre>

Next, let's paste the code associated with our new Query Form into the `queryForm.html` of the same folder.

<pre><code class="language-markup">
&lt;!-- queryForm.html --&gt;

&lt;!-- Find Teammates (Query) Form --&gt;
&lt;div class="col-md-5"&gt;

    &lt;!-- Creates Main Panel --&gt;
    &lt;div class="panel panel-default"&gt;

        &lt;!-- Panel Title --&gt;
        &lt;div class="panel-heading"&gt;
            &lt;h2 class="panel-title text-center"&gt;Find Teammates! (Map Query) &lt;span class="glyphicon glyphicon-search"&gt;&lt;/span&gt;&lt;/h2&gt;
        &lt;/div&gt;

        &lt;!-- Panel Body --&gt;
        &lt;div class="panel-body"&gt;

            &lt;!-- Creates Form --&gt;
            &lt;form name ="queryForm"&gt;

                &lt;!-- Text Boxes and Other User Inputs. Note ng-model binds the values to Angular $scope --&gt;
                &lt;div class="form-group"&gt;
                    &lt;label for="latitude"&gt;Your Latitude&lt;/label&gt;
                    &lt;input type="text" class="form-control" id="latitude" placeholder="39.5" ng-model="formData.latitude" readonly&gt;
                &lt;/div&gt;
                &lt;div class="form-group"&gt;
                    &lt;label for="longitude"&gt;Your Longitude&lt;/label&gt;
                    &lt;input type="text" class="form-control" id="longitude" placeholder="-98.35" ng-model="formData.longitude" readonly&gt;
                &lt;/div&gt;
                &lt;div class="form-group"&gt;
                    &lt;label for="distance"&gt;Max. Distance (miles)&lt;/label&gt;
                    &lt;input type="text" class="form-control" id="distance" placeholder="500" ng-model="formData.distance"&gt;
                &lt;/div&gt;

                &lt;!-- Note ng-true-value which translates check values into explicit gender strings --&gt;
                &lt;label&gt;Gender&lt;/label&gt;
                &lt;div class="form-group"&gt;
                    &lt;label class="checkbox-inline"&gt;
                        &lt;input type="checkbox" name="optionsRadios" id="checkmale" value="Male" ng-model="formData.male" ng-true-value = "&#039;Male&#039;"&gt;
                        Male
                    &lt;/label&gt;
                    &lt;label class="checkbox-inline"&gt;
                        &lt;input type="checkbox" name="optionsRadios" id="checkfemale" value="Female" ng-model="formData.female" ng-true-value="&#039;Female&#039;"&gt;
                        Female
                    &lt;/label&gt;
                    &lt;label class="checkbox-inline"&gt;
                        &lt;input type="checkbox" name="optionsRadios" id="checkother" value="What&#039;s it to ya?" ng-model="formData.other" ng-true-value="&#039;What\&#039;s it to ya?&#039;"&gt;
                        What&#039;s it to ya?
                    &lt;/label&gt;
                &lt;/div&gt;
                &lt;div class="form-group"&gt;
                    &lt;label for="minage"&gt;Min. Age&lt;/label&gt;
                    &lt;input type="number" class="form-control" id="minage" placeholder="5" ng-model="formData.minage"&gt;
                &lt;/div&gt;
                &lt;div class="form-group"&gt;
                    &lt;label for="maxage"&gt;Max Age&lt;/label&gt;
                    &lt;input type="number" class="form-control" id="maxage" placeholder="80" ng-model="formData.maxage"&gt;
                &lt;/div&gt;
                &lt;div class="form-group"&gt;
                    &lt;label for="favlang"&gt;Favorite Language&lt;/label&gt;
                    &lt;input type="text" class="form-control" id="favlang" placeholder="Fortran" ng-model="formData.favlang"&gt;
                &lt;/div&gt;
                &lt;div class="form-group"&gt;
                    &lt;div class="checkbox"&gt;
                        &lt;label&gt;
                            &lt;input type="checkbox" name="verified" id="radiomale" value="True" ng-model="formData.verified"&gt; &lt;strong&gt;Include Only HTML5 Verified Locations?&lt;/strong&gt;
                        &lt;/label&gt;
                    &lt;/div&gt;
                &lt;/div&gt;

                &lt;!-- Query button. Note that its tied to queryUsers() function from queryCtrl.  --&gt;
                &lt;button type="submit" class="btn btn-danger btn-block" ng-click="queryUsers()"&gt;Search&lt;/button&gt;
            &lt;/form&gt;
        &lt;/div&gt;

        &lt;!-- Footer panel for displaying count. Note how it will only display if queryCount is greater than 0 --&gt;
        &lt;div ng-show="queryCount&gt;0" class="panel-footer"&gt;
            &lt;p class="text-center"&gt;Hot Dang! We Found {{queryCount}} Teammates.&lt;/p&gt;
        &lt;/div&gt;
    &lt;/div&gt;
&lt;/div&gt;
</code></pre>

Lastly, let's update our `meanMapApp` module in the `app.js` file to include the Angular `ngRoute` module and specify the `templateURL` associated with each URL route.

<pre><code class="language-javascript">
// app.js

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
</code></pre>

For those less familiar with Angular's `ngRoute` module, what we've done here is made use of Angular's `routeProvider` service to identify the URL our users are looking at in the browser. Thus, when a user is looking at a URL with a given suffix, Angular knows which pre-defined controller and templateURL to use.

As you can see, in the example above, when a user is looking at `/join` (or any URL other than `/find`), Angular will employ the `addCtrl` controller that we created in Part I and display the content from our `addForm.html` file. Similarly when a user is looking at `/find`, the user will be displayed the `queryForm.html` content. (Once we create the `queryCtrl` controller, we will specify this here as well.)

Now that we have our partials ready, let's update our `index.html` file.

<pre><code class="language-markup">
&lt;!-- index.html --&gt;

&lt;!doctype html&gt;
&lt;!-- Declares meanMapApp as the starting Angular module --&gt;
&lt;html class="no-js" ng-app="meanMapApp"&gt;
&lt;head&gt;
    &lt;meta charset="utf-8"&gt;
    &lt;title&gt;Scotch MEAN Map&lt;/title&gt;
    &lt;meta name="description" content="An example demonstrating Google Map integration with MEAN Apps"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
    &lt;!-- CSS --&gt;
    &lt;link rel="stylesheet" href="../bower_components/bootstrap/dist/css/bootstrap.css"/&gt;
    &lt;link rel="stylesheet" href="style.css"/&gt;

    &lt;!-- Google Maps API --&gt;
    &lt;script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDrn605l7RPadiwdzsOlRw9O28lxfYBJ6s"&gt;&lt;/script&gt;
    &lt;!-- Modernizr --&gt;
    &lt;script src="../bower_components/modernizr/bin/modernizr"&gt;&lt;/script&gt;
    &lt;!-- JS Source --&gt;
    &lt;script src="../bower_components/jquery/jquery.js"&gt;&lt;/script&gt;
    &lt;script src="../bower_components/angular/angular.js"&gt;&lt;/script&gt;
    &lt;script src="../bower_components/angular-route/angular-route.js"&gt;&lt;/script&gt;
    &lt;script src="../bower_components/angularjs-geolocation/dist/angularjs-geolocation.min.js"&gt;&lt;/script&gt;
    &lt;!-- Angular Source --&gt;
    &lt;script src="js/app.js"&gt;&lt;/script&gt;
    &lt;script src="js/addCtrl.js"&gt;&lt;/script&gt;
    &lt;script src="js/gservice.js"&gt;&lt;/script&gt;

&lt;/head&gt;
&lt;!-- Removed ng-controller. Now this will be handled in app.js --&gt;
&lt;body&gt;
&lt;div class="container"&gt;
    &lt;div class="header"&gt;
        &lt;ul class="nav nav-pills pull-right"&gt;
            &lt;!-- Links to the two menu views included --&gt;
            &lt;li active&gt;&lt;a href="/#/join"&gt;Join the Team&lt;/a&gt;&lt;/li&gt;
            &lt;li disabled&gt;&lt;a href="/#/find"&gt;Find Teammates&lt;/a&gt;&lt;/li&gt;
        &lt;/ul&gt;
        &lt;h3 class="text-muted"&gt;The Scotch MEAN MapApp&lt;/h3&gt;
    &lt;/div&gt;
    &lt;!-- Map and Side Panel --&gt;
    &lt;div class="row content"&gt;
        &lt;!-- Google Map --&gt;
        &lt;div class="col-md-7"&gt;
            &lt;div id="map"&gt;&lt;/div&gt;
        &lt;/div&gt;
        &lt;!-- Side Panel -- Now Handled by ng-view --&gt;
        &lt;div ng-view&gt;&lt;/div&gt;

    &lt;/div&gt;
    &lt;hr/&gt;
    &lt;!-- Footer --&gt;
    &lt;div class="footer"&gt;
        &lt;p class="text-center"&gt;&lt;span class="glyphicon glyphicon-check"&gt;&lt;/span&gt; Created by Ahmed Haque for Scotch IO -
            &lt;a href="https://scotch.io/"&gt;App Tutorial&lt;/a&gt; | &lt;a href="https://github.com/afhaque/MeanMapAppV2.0"&gt;Github Repo&lt;/a&gt;&lt;/p&gt;
    &lt;/div&gt;
&lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;
</code></pre>

Here we've removed the content associated with our `addForm` side-panel and replaced it with a generic reference to `ng-view`. Angular's `routeProvider` will automatically replace this with the correct HTML partial.

Additionally, we've removed reference to the `addCtrl` controller that previously existed in our body tag. Once again, our `routeprovider` will instruct the page to use the correct controller based on the URL.

With that, its time for our first test!

Crank up your `mongod` instance and run `node server.js`. If you then head to `localhost:3000` you should see our familiar map from Part I. Click the 'Find Teammates' link to see our new Query Form basking in all its glory.

![2-TeamMatePanel][7]

## Creating the Query Logic and Express Routes

Now its time to create the backend code for handling queries. Open your `routes.js` file and paste the following code beneath your `app.post('users')` code.

<pre><code class='language-javascript'>
// routes.js

// app.post('users') code for creating users... 
// ... 

// Retrieves JSON records for all users who meet a certain set of query conditions
app.post('/query/', function(req, res){

    // Grab all of the query parameters from the body.
    var lat             = req.body.latitude;
    var long            = req.body.longitude;
    var distance        = req.body.distance;

    // Opens a generic Mongoose Query. Depending on the post body we will...
    var query = User.find({});

    // ...include filter by Max Distance (converting miles to meters)
    if(distance){

        // Using MongoDB's geospatial querying features. (Note how coordinates are set [long, lat]
        query = query.where('location').near({ center: {type: 'Point', coordinates: [long, lat]},

            // Converting meters to miles. Specifying spherical geometry (for globe)
            maxDistance: distance * 1609.34, spherical: true});
    }
    
    // ... Other queries will go here ... 

    // Execute Query and Return the Query Results
    query.exec(function(err, users){
        if(err)
            res.send(err);

        // If no errors, respond with a JSON of all users that meet the criteria
        res.json(users);
    });
});
</code></pre>

We've done a couple of key things here. So let's break it down:

1.  First, we created a new `POST` request handler for URLs with the suffix `/query`. This handler expects a JSON request body, which specifies three parameters: latitude, longitude, and distance. These parameters are then converted and stored as variables in the handler.

2.  We then created a generic Mongoose Query using the [Query Builder][8] format. This format begins by establishing a generic `query` object equal to the unfiltered search of all users in our database.

3.  If a distance is provided, the Query Builder will add a new search condition that filters for all users that fall within the distance provided of the query's coordinates (latitude, longitude). Here we're using the MongoDB search parameter [$near][9] and its associated properties `maxDistance` and `spherical` to specify the range we're looking to cover. We're multiplying the distance of our query body by 1609.34, because we want to take our users' input (in miles) and convert it into the units MongoDB expects (in meters). Lastly, we're specifying that the distance should be determined assuming a spherical surface. This is important, because we'll be evaluating distances across the globe, as opposed to a flat Euclidean surface.

4.  Finally, we used `query.exec` to instruct Mongoose to run the final query. If the query encounters no errors, it will provide a JSON output of all users who meet the criteria.

At this point, let's test what we have. To do this, re-run your application using `node server.js` and place a few dummy markers on your map. Place two markers near each other on one side of the map and two markers a sizeable distance away. Then position your marker next to the first two markers and note the associated latitude and longitude.

![3-NearFarExample][10]

Now, open up [Postman][11] and create a raw JSON `POST` request to your `/query` URL. Specify the latitude and longitude that you just noted and set a distance of 100. Then send the request.

![5-100MileDistanceBody][12]

If all went well, your response body should list only the new nearby markers and exclude the distant ones.

![6-Results100MileDistance][13]

Repeat your `POST` request, but set the distance much farther. Try 1000 or 5000 instead.

![8-1000MileQuery][14]

If all went well, your response should list the remaining markers as well.

![9-1000MileResults][15]

We'll examine the precision capabilities of our query a bit later, but for now, let's add the remaining filter conditions.

To do this, paste the following code over the POST request we just created.

<pre><code class='language-javascript'>
// routes.js

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
</code></pre>

What we've done here is successively added conditions that check if our user has provided distance, gender, age, language, or HTML5 verified constraints to the `POST` body. If any of these constraints exist, we'll add the associated query condition to our Query Builder. Take note of this example as it really highlights the value of Mongoose's Query Builder for complex queries.

Speaking of complex queries, let's go ahead and test one now. To do this, create a set of mock users in various locations with assorted characteristics.

Here I've created a set of markers around Indianapolis.

![10-AdvancedQueryInitialMap][16]

Let's say, I'm creating a coding school that targets girls between the ages of 20-30 years of age, within the city limits (150 miles). I can convert these parameters into `POST` request fields as shown below.

![11-AdvancedQueryBody][17]

Then when I run the query, I see only the filtered set of results.

![12-AdvancedQueryResults][18]

Huzzah! IndyCodingSchool here we come.

## Creating the Query Controller

Okay. That was great, but writing JSON requests manually can seriously suck. We need to build our UI capabilities ASAP!

To begin, let's paste the following code in our `queryCtrl.js` file.

<pre><code class="language-javascript">
// queryCtrl.js

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
</code></pre>

What we've done here is very similar to the work we did in Part I. We created a new module and controller called `queryCtrl`. This controller relies on `$scope` to pull all of the form data from our active `queryForm.html` file. These elements are converted into variables, which are then used to directly create an http `POST` request to the `/query` URL whenever the `$scope.queryUsers` function (associated with our query button) is triggered. Additionally, as was the case with our `addCtrl` controller, the `queryCtrl` has code for identifying a user's current location and for handling click capture.

Now that our controller is ready, let's add a reference to `queryCtrl` in our main Angular module in `app.js`.

<pre><code class="language-javascript">
// app.js

var app = angular.module('meanMapApp', ['addCtrl', 'queryCtrl', 'geolocation', 'gservice', 'ngRoute'])
</code></pre>

We'll also update our `$routeProvider` to utilize this new controller when a user is looking at the `/find` URL.

<pre><code class="language-javascript">
// app.js

    // Find Teammates Control Panel
}).when('/find', {
    controller: 'queryCtrl',
    templateUrl: 'partials/queryForm.html',
</code></pre>

Finally, we'll include a link to the `queryCtrl.js` script in our `index.html` file.

<pre><code class="language-markup">
&lt;script src="js/queryCtrl.js"&gt;&lt;/script&gt;    
</code></pre>

Now that we've completed everything, let's repeat the example from before. But this time, use the form itself to conduct the search.

Since we haven't updated our map service, we won't see changes on the map just yet. However, if we open up our Google Developers Console (`ctrl+shift+i`) and navigate to the console, we should see both our `queryBody` and the `queryResults` displayed.

![13-QueryResultsConsole][19]

If all went well, the query results should match the results you saw earlier.

![14-QueryResults][20]

Aha. Found them again!

## Modifying the Google Maps Service

Now that we're successfully filtering users, its time to visualize our results on the map itself. To do this, we're going to make a series of modifications to our googleMapService found in `gservice.js`.

Go ahead and paste the following code over our pre-existing refresh `googleMapService.refresh` function.

<pre><code class="language-javascript">
// gservice.js

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
</code></pre>

Here what we've done is introduced a new optional parameter `filteredResults` to the `refresh` function.

As you may recall, from Part I, the original purpose of the `refresh` function was to pull information on all users in our database through a `GET` request to `/users` and to convert this data into Google Map markers. These markers were then used to populate our map, which was then displayed to users with their own location marked as well.

By adding in the `filteredResults` parameter, we're adapting the `refresh` function for a second purpose. In cases, where we want to show only filtered results, we're going to circumvent the `$http` `GET` request, and instead directly send a JSON that includes only the filter-limited results. We'll be able to generate these results using the `POST` request to the `/query` route that we just created.

Once the `refresh` function receives these filtered results, it will pass the JSON to our `convertToMapPoints` function and store the converted set of Google Map markers in our `locations` array. We can then initialize our map as before, but this time only the filtered results will be shown.

Next, let's make one more change to make things more obvious. Go ahead and paste the below code over the `initialize` function.

<pre><code class="language-javascript">
// gservice.js

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
</code></pre>

The change here is minimal but visually significant. Here we've noted that if the `initialize` function is called with the boolean `filter` set to true, all markers should be yellow dots as opposed to the blue dots we'd been using before. This is helpful from a UI perspective, because it let's users immediately realize that their query worked successfully.

Now that our `refresh` function has been updated. Let's finally update our `queryCtrl` file to utilize this new service. Add the below line in place of the `console.log` lines we used earlier.

<pre><code class="language-javascript">
// queryCtrl.js

// $http.post('/query, queryBody).successs(function(queryResults){...
// Old console.log code ... 

// Pass the filtered results to the Google Map Service and refresh the map
gservice.refresh(queryBody.latitude, queryBody.longitude, queryResults);
</code></pre>

Here you can see that we're taking the queryResults from our `/query` `POST` and directly sending the filtered results to our `refresh` function for map building. And with this final step, let's run one final test of our app!

Boot up your `server.js` file and rerun the advanced query example we've run before using the Query Form. If all went well you should see prominent yellow markers, indicating the filtered results.

![15-FinalQuery][21]

Victory. I see you!

## Final Tweaks

There are plenty of ways to improve this app. As a few suggestions, I'd suggest reading up on [GeoJSON][22], the various [Google Map Options][23], and the different styling options available from [Snazzy Maps][24]. Additionally, there is significant momentum behind the [Angular-Google-Maps Project][25], something definitely worth looking into if you're planning to build more complex map applications.

That said, even with as simple a map application as this one -- it's remarkable how quickly you can draw meaningful information. Already our demo app has had close to 100 verified users sign up. Scanning through the locations, it's been awesome to see the diversity of locations that Scotch readers login from. (Who knew Scotch had a follower in Bishkek, Kyrgzstan?).

![16-FinalHTML5Verified][26]

Good luck with your own map making adventures! If you come up with something cool, definitely post about it in the comments.

We'd love to hear about it!

## BONUS: "But just how accurate is this Mongo $near thing...?"

Well. It turns out *pretty* damn accurate is the answer. While writing this tutorial, I'd stumbled into a few articles that anecdotally estimated that the `$near` function was good enough at discriminating distances within 5 miles -- so I decided to test and see for myself. I ran a few experiments with coordinates a known distance away from each other, and looked for the minimum distance I could use to discriminate locations.

For small distances (where Euclidean "flat" geometry takes hold), Mongo distance queries were right on the money -- consistently able to discriminate distances within 1 mile of the actual distance.

![17-LocalDistances][27]

For larger distances (where more complex "spherical" geometries become relevant), the MongoDB distance queries were off by about ~10 miles. Not as good, but not shabby at all -- especially, considering there exist multiple methods for calculating spherical distances.

![18-GlobalDistances][28]

All in all, this presents even more reason to play around with the Geospatial tools in MongoDB -- so go forth with confidence young cartographers!

 [1]: https://scotch.io/tutorials/making-mean-apps-with-google-maps-part-i
 [2]: https://mean-google-maps.herokuapp.com/
 [3]: https://scotch.io/wp-content/uploads/2015/10/1-MapCurrent.png
 [4]: https://github.com/afhaque/MeanMapAppV2.0
 [5]: https://github.com/afhaque/MeanMapAppV2.0/blob/master/TutorialMaterial/PartI/WorkingCodePartI.zip
 [6]: https://docs.angularjs.org/api/ngRoute
 [7]: https://scotch.io/wp-content/uploads/2015/10/2-TeamMatePanel.png
 [8]: http://mongoosejs.com/docs/queries.html
 [9]: http://docs.mongodb.org/manual/reference/operator/query/near/
 [10]: https://scotch.io/wp-content/uploads/2015/10/3-NearFarExample.png
 [11]: https://www.getpostman.com/
 [12]: https://scotch.io/wp-content/uploads/2015/10/5-100MileDistanceBody.png
 [13]: https://scotch.io/wp-content/uploads/2015/10/6-Results100MileDistance.png
 [14]: https://scotch.io/wp-content/uploads/2015/10/8-1000MileQuery.png
 [15]: https://scotch.io/wp-content/uploads/2015/10/9-1000MileResults.png
 [16]: https://scotch.io/wp-content/uploads/2015/10/10-AdvancedQueryInitialMap.png
 [17]: https://scotch.io/wp-content/uploads/2015/10/11-AdvancedQueryBody.png
 [18]: https://scotch.io/wp-content/uploads/2015/10/12-AdvancedQueryResults.png
 [19]: https://scotch.io/wp-content/uploads/2015/10/13-QueryResultsConsole.png
 [20]: https://scotch.io/wp-content/uploads/2015/10/14-QueryResults.png
 [21]: https://scotch.io/wp-content/uploads/2015/10/15-FinalQuery.png
 [22]: http://docs.mongodb.org/manual/reference/geojson/
 [23]: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
 [24]: https://snazzymaps.com/
 [25]: http://angular-ui.github.io/angular-google-maps/#!/
 [26]: https://scotch.io/wp-content/uploads/2015/10/Fullmap.png
 [27]: https://scotch.io/wp-content/uploads/2015/10/MapDistanceLocal.png
 [28]: https://scotch.io/wp-content/uploads/2015/10/MaxDistanceGlobe.png