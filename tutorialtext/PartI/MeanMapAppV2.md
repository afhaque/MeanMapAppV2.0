## Introduction

"MEAN Apps with Google Maps" (A tongue twister to be true).

And yet, whether you're building an application to visualize bike lanes in your city, designing a tool to chart oil wells across the globe, or are simply creating an app to help choose your next date -- interactive, data-rich maps can be a critical function. In this two-part tutorial, we'll be writing code that directly integrates Google Maps with the views, controllers, and data of a MEAN-based application.

![Live To-Do App][1]

In Part I of the tutorial, we'll be building the initial interface and initiating the data-binding between HTML/Angular elements with MongoDB and Google Maps. In Part II of the tutorial, we'll be utilizing MongoDB's geospatial and other querying tools to create complex filters on the map itself.

As you follow along, feel encouraged to grab the source code in the link provided and follow-along. The "Download Source Code" link provides the working code from today's Part I, while the "View Code" link provides a link to a Github repo with the ultimate product.

## Intro to the Google Maps API

As the title clearly suggests, we'll be using the [Google Maps Javascript API][2] throughout. The API is richly documented, easy to learn, and free for low-volume usage. It may be worth flipping through the [documentation guides][3] now to see what's possible. Once you're ready to begin, head to the API homepage and sign-up to "Get a Key". Simply follow the instructions for creating a Project and you will be shown your unique API key. Hang onto this key!

![Sign-up][4]

Once you have your key, head to the APIs section of the Google Developer Console and click the link for the Google Maps Javascript API. Make sure the API is Enabled under your new Project. (If it says: "Disable API" then you're good).

![EnabledAPI][5]

## Overall App Skeleton

The final product we'll be building is a basic two panel application. On the left is a map and on the right is a control panel. In this part of the tutorial, the control panel will provide us a way of adding new users to the map. (In the second part, the control panel will also be able to flip to a "Filter Results" menu).

Before we get designing, go ahead and setup your app directory as follows:

<pre class=" language-bash"><code class=" language-bash">
MapApp
-- app // Backend 
---- model.js 
---- routes.js 

-- public // Frontend
---- index.html 
---- js
------ app.js 
------ addCtrl.js 
------ gservice.js 
---- style.css

-- server.js // Express Server
-- package.json
</code></pre>

We'll try to keep things as simple as possible. The app will be composed of three sections:

1. A frontend handling what's displayed to the user 
2. A controller and factory for performing AJAX calls and building the Google Map 
3. A server and database for hosting the user data

## Grabbing Dependencies and Setting up the HTML

Once you're ready, run the following commands in your terminal from within the app directory to grab the Bower dependencies:

<pre class=" language-bash"><code class=" language-bash">
bower install angular-route#1.4.6
bower install angularjs-geolocation#0.1.1
bower install bootstrap#3.3.5
bower install modernizr#3.0.0
</code></pre>

Next, add the following content to your package.json file

<pre class=" language-javascript"><code class=" language-javascript">
{
    "name": "MeanMapsApp",
    "main": "server.js",
    "dependencies" : {
        "express"    : "~4.7.2",
        "mongoose"   : "~4.1.0",
        "morgan"     : "~1.2.2",
        "body-parser": "~1.5.2",
        "jsonwebtoken": "^5.0.2",
        "method-override": "~2.1.2"
    }
}
</code></pre>

Then, run `npm install` to install the relevant node packages.

Next replace the content of your index.html file with the content below. There's nothing too fancy going on here just yet, so just paste and wait for the explanation after.

    <pre class=" language-markup"><code class=" language-markup">
    
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
            <!-- Holder JS -->
            <script src="../bower_components/holderjs/holder.js"></script>
            <!-- Google Maps API -->
            <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_HERE"></script>
            <!-- Modernizr -->
            <script src="../bower_components/modernizr/bin/modernizr"></script>
            <!-- JS Source -->
            <script src="../bower_components/jquery/jquery.js"></script>
            <script src="../bower_components/angular/angular.js"></script>
            <script src="../bower_components/angular-route/angular-route.js"></script>
            <script src="../bower_components/angularjs-geolocation/dist/angularjs-geolocation.min.js"></script>
        </head>
        <body>
        <div class="container">
            <div class="header">
                <ul class="nav nav-pills pull-right">
                    <li active><a href="">Join the Team</a></li>
                    <li disabled><a href="">Find Teammates</a></li>
                </ul>
                <h3 class="text-muted">The Scotch MEAN MapApp</h3>
            </div>
            <!-- Map and Side Panel -->
            <div class="row content">
                <!-- Google Map -->
                <div class="col-md-7">
                    <div id="map"><img src="holder.js/645x645"></div>
                </div>
                <!-- Side Panel -->
                <div class="col-md-5">
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
                                    <label for="verified">HTML5 Verified Location? <span><button class="btn btn-default btn-xs"><span class="glyphicon glyphicon-refresh"></span></button></span></label>
                                    <input type="text" class="form-control" id="verified" placeholder= "Nope (Thanks for spamming my map...)" ng-model="formData.htmlverified" readonly>
                                </div>
                                <!-- Submit button. Note that its tied to createUser() function from addCtrl. Also note ng-disabled logic which prevents early submits.  -->
                                <button type="submit" class="btn btn-danger btn-block" ng-disabled="addForm.$invalid">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
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
    
        </code></pre>
    

Lastly, in the style.css file, include the following to pre-allocate space for the Google Map to come:

    <pre class=" language-markup"><code class=" language-markup">
    
        /* Google Map! */
        #map {
            height: 645px;
            width: 645px;
        }
    
    </code></pre>
    
At this point, we have a basic HTML page with a div for a map and a div with an HTML form for adding users. That said, there are a few things to note:

1) We've included a link to the Google Maps API at the top of the page. Be sure to insert your own API into the script!

2) We've included the Angular directive `ng-app = meanMapApp` at the top of the page. We'll use this to reference an Angular module later on.

3) We're using a temporary holderjs image in place of the map for now. This will let us quickly get a visual for what we have.

4) We've included a `noValidate` attribute in the HTML form element. This disables HTML form validation. Instead, we'll be using Angular to validate our form.

5) **Most importantly** note the repeated use of `ng-model` throughout the form. Each of these directives takes the content in the textbox or control element to set the value of an associated property in the scope variable `formData`. So if a user sets his username to "WackaWackaMan", then the variable `$scope.formData.username` would be set to "WackaWackaMan" as well.

6) Lastly, note the function `ng-disabled="addForm.$invalid"` . This will prevent a user from clicking the Submit button unless the form is completely valid. In our case, since all fields have the attribute of `required`, this means that all fields will need to be populated before the button is enabled.

See. Nothing fancy! But at this point, you should be able to do a quick browser inspection.

![BrowserImage1][6]

## Setting up the Node/Express Server

Now that we have an initial HTML template, it's time to create the Node and Express server that will handle GET and POST requests for data. Paste the below code in the server.js file. The code below is a great template for building quick express servers. It includes morgan for handling request logs, body-parser for parsing JSON POST bodies, and specifies the location of the index.html file and bower_components.

Worth noting is that the server is configured to use `localhost:3000` in displaying the app and that we'll be connecting to a local instance of MongoDB. (Note: Because we're running this in localhost, remember to initiate Mongod during testing).

<pre class=" language-javascript"><code class=" language-javascript">

// Dependencies
// -----------------------------------------------------
var express         = require('express');
var mongoose        = require('mongoose');
var port            = process.env.PORT || 3000;
var morgan          = require('morgan');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var app             = express();

// Express Configuration
// -----------------------------------------------------
// Sets the connection to MongoDB
mongoose.connect("mongodb://localhost/MeanMapApp");

// Logging and Parsing
app.use(express.static(__dirname + '/public'));                 // sets the static files location to public
app.use('/bower_components',  express.static(__dirname + '/bower_components')); // Use BowerComponents
app.use(morgan('dev'));                                         // log with Morgan
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.urlencoded({extended: true}));               // parse application/x-www-form-urlencoded
app.use(bodyParser.text());                                     // allows bodyParser to look at raw text
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));  // parse application/vnd.api+json as json
app.use(methodOverride());

// Routes
// ------------------------------------------------------
// require('./app/routes.js')(app);

// Listen
// -------------------------------------------------------
app.listen(port);
console.log('App listening on port ' + port);


</code></pre>

Boot up `mongod` in the terminal. Then run a quick test of the server using the command `node server.js` in your terminal window. If all goes well, you should see our earlier HTML content when you navigate to `localhost:3000` in your browser.

![BrowserImage2][7]

## Create the Mongoose Schema

Next up, let's create a Mongoose Schema model that we can use to interact with the user data we'll be dumping into MongoDB. Navigate to your model.js file and paste the following code

<pre class=" language-javascript"><code class=" language-javascript">

// Pulls Mongoose dependency for creating schemas
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// Creates a User Schema. This will be the basis of how user data is stored in the db
var UserSchema = new Schema({
    username: {type: String, required: true},
    gender: {type: String, required: true},
    age: {type: Number, required: true},
    favlang: {type: String, required: true},
    location: {type: [Number], required: true}, // [Long, Lat]
    htmlverified: String,
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

// Sets the created_at parameter equal to the current time
UserSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

// Indexes this schema in 2dsphere format (critical for running proximity searches)
UserSchema.index({location: '2dsphere'});

// Exports the UserSchema for use elsewhere. Sets the MongoDB collection to be used as: "scotch-users"
module.exports = mongoose.model('scotch-user', UserSchema);

</code></pre>

Here what we've done is established the structure we'll be expecting (and enforcing) our user JSON data to look. As you can see, we're expecting six fields: username, gender, age, favorite language, location, and whether or not a user's location has been html5 verified. We've also created pre-save logic which initially sets the created_at and updated_at fields equal to the datetime of insertion.

**Importantly** we've established that the `UserSchema` should be indexed using a `2dsphere` approach. This line is critical, because it allows MongoDB and Mongoose to run geospatial queries on our user data. This means being able to query users based on geographic inclusion, intersection, and proximity. Check out the reference docs on \[2dsphere indexes\]\[8\] for more information. As an example, we'll be using the \[$near\]\[9\] query condition in Part II to identify users that fall within so many miles of a given location.

**Also, important** is the fact that MongoDB requires coordinates to be ordered in [Long, Lat] format. Backwards-seeming. I know. But very important. This is especially important to remember, because Google Maps requires coordinates in the other direction [Lat, Long]. Just try to keep things straight as you're working.

Finally, the model.js file ends, with us exporting the Mongoose model and establishing a MongoDB collection of "scotch-users" as the holding location for our data. (Note: "scotch-users" isn't a typo. Mongoose adds an extra letter 's' when creating collections).

## Setup the Routes + Server + Testing the API

We're making great progress! Next up, we need to create the Express routes for retrieving and creating new users in our MongoDB database. For the purpose of this tutorial, we're going to create the bare minimum number of routes. One route to retrieve a list of all users (GET) and one route to add new users (POST). Paste the below code in your routes.js file to set this up.

<pre class="language-javascript"><code class="language-javascript">
// Dependencies
var mongoose        = require('mongoose');
var User            = require('./model.js');


// Opens App Routes
module.exports = function(app) {

    // GET Routes
    // --------------------------------------------------------
    // Retrieve records for all users in the db
    app.get('/users', function(req, res){

        // Uses Mongoose schema to run the search (empty conditions)
        var query = User.find({});
        query.exec(function(err, users){
            if(err)
                res.send(err);

            // If no errors are found, it responds with a JSON of all users
            res.json(users);
        });
    });

    // POST Routes
    // --------------------------------------------------------
    // Provides method for saving new users in the db
    app.post('/users', function(req, res){

        // Creates a new User based on the Mongoose schema and the post bo.dy
        var newuser = new User(req.body);

        // New User is saved in the db.
        newuser.save(function(err){
            if(err)
                res.send(err);

            // If no errors are found, it responds with a JSON of the new user
            res.json(req.body);
        });
    });
};  
</code></pre>

Then, in your `server.js` file, uncomment the line associated with routing to connect our routes to the server:

<pre class="language-javascript"><code class="language-javascript">
require('./app/routes.js')(app);
</code></pre>

Things to note here:

1) We're declaring our Mongoose model (here titled: "User") created earlier as a dependency. In the subsequent GET and POST routes we use Mongoose and the User model to query for records and create new records with simple syntax. We create users using the line: `var newuser = new User(req.body);` and retrieve all users with the line `var query = User.find({});`. (Note: These users are NOT yet added to our map. We're just dealing with the MongoDB database at this point.

2) We're using the route /user for both the GET and POST requests. At any point during testing we can direct our browser to `localhost:3000/users` to see what's in the database.

Speaking of testing, now's a good time to test the routes. Let's open up \[Postman][9\] (or a similar HTTP testing client) and run two tests.

First, let's run a POST request to create a new user. Paste the below content into the body of a POST request and send it to `localhost:3000/users`. Remember to set the content type to "Raw" and "JSON (application/json)" before sending.

![POSTManImage][8]

<pre class="language-javascript"><code class="language-javascript">
{
    "username": "scotcher",
    "gender": "Female",
    "age": "25",
    "favlang": "Javascript",
    "location": [-95.56, 29.735]
}
</code></pre>

Once you've sent the request, navigate your browser to `localhost:3000/users`. If all went well, you should see the JSON you just sent, displayed before you.

![PostResponse][9]

Huzzah!

## Create the Add Controller

We're slowly but surely clawing forward. Now it's time to bring in Angular. First things first, let's declare the intial angular module in `public->js->app.js`. This file will serve as the starting Angular module. Once again, let's keep it simple.

<pre class="language-javascript"><code class="language-javascript">
// Declares the initial angular module "meanMapApp". Module grabs other controllers and services.
var app = angular.module('meanMapApp', ['addCtrl', 'geolocation']);
</code></pre>

For now the module will pull only from addCtrl (the controller for our Add User Form) and geolocation, a module we downloaded earlier through Bower. We'll be using the 'Geolocation' module to provide an easy method for receiving a user's HTML5 verified location.

Next, let's open up the addCtrl.js file and begin creating our controller. Let's begin with the basics: creating the functions needed to add users to our database.

<pre class="language-javascript"><code class="language-javascript">

// Creates the addCtrl Module and Controller. Note that it depends on the 'geolocation' module and service.
var addCtrl = angular.module('addCtrl', ['geolocation']);
addCtrl.controller('addCtrl', function($scope, $http, geolocation){

    // Initializes Variables
    // ----------------------------------------------------------------------------
    $scope.formData = {};
    var coords = {};
    var lat = 0;
    var long = 0;

    // Set initial coordinates to the center of the US
    $scope.formData.latitude = 39.500;
    $scope.formData.longitude = -98.350;

    // Functions
    // ----------------------------------------------------------------------------
    // Creates a new user based on the form fields
    $scope.createUser = function() {

        // Grabs all of the text box fields
        var userData = {
            username: $scope.formData.username,
            gender: $scope.formData.gender,
            age: $scope.formData.age,
            favlang: $scope.formData.favlang,
            location: [$scope.formData.longitude, $scope.formData.latitude],
            htmlverified: $scope.formData.htmlverified
        };

        // Saves the user data to the db
        $http.post('/users', userData)
            .success(function (data) {

                // Once complete, clear the form (except location)
                $scope.formData.username = "";
                $scope.formData.gender = "";
                $scope.formData.age = "";
                $scope.formData.favlang = "";
                
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };
});
</code></pre>

The logic here is straightforward if you've worked with Angular before, but for those who haven't, the code essentially refers back to each of the textboxes and control elements using the $scope.formData.VAR format. These are initially set to blanks (except location, which has initial dummy numbers).

Once a user hits a button associated with the `createUser()` function, the Angular controller initiates a process of grabbing each of the textbox and control values and storing them to an object `userData`. From there, an http post request is made to the `'/users` route we created earlier. The form is cleared (except for location) and the function completes.

The next step is for us to return to our `index.html` file and attach our "Submit" button to the controller. To do this we need to make two modifications to our `index.html` file.

First, we need to include the scripts associated with `app.js` and `addCtrl.js` into our `index.html` file.

    <pre class="language-markup"><code class="language-markup">
            <!-- Angular Scripts -->
            <script src="js/app.js"></script>
            <script src="js/addCtrl.js"></script>
    </code></pre>
    

Then, we need to attach our `addCtrl` controller to the HTML body.

     <pre class="language-markup"><code class="language-markup">
             <body ng-controller="addCtrl">
     </code></pre>
    

Next, we need to attach our `createUser()` function through the "Submit" button's `ng-click` event.

     <pre class="language-markup"><code class="language-markup">
             <button type="submit" class="btn btn-danger btn-block" ng-click="createUser()" ng-disabled="addForm.$invalid">Submit</button>
     </code></pre>
    

Great. Now it's time to run a quick test. Fire up your server using `node server.js` then navigate to `localhost:3000`. At this point, try adding users via the HTML form. If everything's been coded correctly, you should be able to see your newest user on the `localhost:3000/users` page.

![AddFormTesting][10]

![AddFormFunctional][11]

Eureka! Now onto the real reason your here....

## Create the Google Maps Factory Service

Maps! This is where things get tricky. So follow closely.

At a high-level, what we need to do next is to take the user data we've collected to this point: 1) Convert each into a Google Maps readable format and 2) Drop a Google Maps markers to the correct coordinates. Additionally, we're going to need to build functionality for pop-ups and clickable map coordinates.

To do all of this, we're going to create a new Angular Factory. This factory will be used by our `addCtrl` controller to complete all of the logic associated with map building.

Go ahead and open your `public->app->gservice.js file`. Then paste the below code into place.

<pre class="language-javascript"><code class="language-javascript">

// Creates the gservice factory. This will be the primary means by which we interact with Google Maps
angular.module('gservice', [])
    .factory('gservice', function($http){

        // Initialize Variables
        // -------------------------------------------------------------
        // Service our factory will return
        var googleMapService = {};

        // Array of locations obtained from API calls
        var locations = [];

        // Selected Location (initialize to center of America)
        var selectedLat = 39.50;
        var selectedLong = -98.35;

        // Functions
        // --------------------------------------------------------------
        // Refresh the Map with new data. Function will take new latitude and longitude coordinates.
        googleMapService.refresh = function(latitude, longitude){

            // Clears the holding array of locations
            locations = [];

            // Set the selected lat and long equal to the ones provided on the refresh() call
            selectedLat = latitude;
            selectedLong = longitude;

            // Perform an AJAX call to get all of the records in the db.
            $http.get('/users').success(function(response){

                // Convert the results into Google Map Format
                locations = convertToMapPoints(response);

                // Then initialize the map.
                initialize(latitude, longitude);
            }).error(function(){});
        };

        // Private Inner Functions
        // --------------------------------------------------------------
        // Convert a JSON of users into map points
        var convertToMapPoints = function(response){

            // Clear the locations holder
            var locations = [];

            // Loop through all of the JSON entries provided in the response
            for(var i= 0; i &lt; response.length; i++) {
                var user = response[i];

                // Create popup windows for each record
                var  contentString =
                    &#039;&lt;p>&lt;b>Username&lt;/b>: ' + user.username +
                    '&lt;br>&lt;b>Age&lt;/b>: ' + user.age +
                    '&lt;br>&lt;b>Gender&lt;/b>: ' + user.gender +
                    '&lt;br>&lt;b>Favorite Language&lt;/b>: ' + user.favlang +
                    '&lt;/p>';

                // Converts each of the JSON records into Google Maps Location format (Note [Lat, Lng] format).
                locations.push({
                    latlon: new google.maps.LatLng(user.location[1], user.location[0]),
                    message: new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 320
                    }),
                    username: user.username,
                    gender: user.gender,
                    age: user.age,
                    favlang: user.favlang
            });
        }
        // location is now an array populated with records in Google Maps format
        return locations;
    };

// Initializes the map
var initialize = function(latitude, longitude) {

    // Uses the selected lat, long as starting point
    var myLatLng = {lat: selectedLat, lng: selectedLong};

    // If map has not been created already...
    if (!map){

        // Create a new map and place in the index.html page
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 3,
            center: myLatLng
        });
    }

    // Loop through each location in the array and place a marker
    locations.forEach(function(n, i){
        var marker = new google.maps.Marker({
            position: n.latlon,
            map: map,
            title: "Big Map",
            icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
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

};

// Refresh the page upon window load. Use the initial latitude and longitude
google.maps.event.addDomListener(window, 'load',
    googleMapService.refresh(selectedLat, selectedLong));

return googleMapService;
});

</code></pre>

Let's breakdown what's going on in here.

1) First, we created a generic Angular module and factory called gservice and specified that it depends on the $http service.

2) We initialized a set of key variables: * The `googleMapService` object that will hold the `refresh` function we'll use to rebuild the map,  
* The `locations` array which will hold all of the converted locations in the database. * The `selectedLat` and `selectedLong` variables, which hold the specific location we're looking at during any point in time.

3) We then created a `refresh()` function, which takes new coordinate data and uses it to refresh the map. To do this, the function performs an AJAX call to the database and pulls all of the saved records. It then takes these records and passes it to a function convertToMapPoints, which loops through each record -- creating an array of Google Formatted coordinates with pre-built pop-up messages. (Note that Google formats its coordinates [Lat, Long], so we needed to flip the order from how we saved things in MongoDb).

4) Once the values have been converted, the refresh function sets off the `initialize()` function. This function, creates a generic Google Map and places it in the `index.html` file where the div id of 'map' exists. The initialize function, then loops through each of the locations in the `locations` array and places a blue-dot marker on that location's geographic position. These markers are each given a listener that opens their message boxes on click. Finally, the `initialize()` function ends with a bouncing red marker being placed at the initial location (pre-set to center of America as of now).

5) The `refresh()` function is run immediately upon window load, allowing it to be seen right away.

If you're still with me, then let's incorporate our `gservice` and `refresh()` funciton in the rest of the app. Since we'll be using the `refresh()` function, whenever we add a new user, it makes sense to include it in our `addCtrl.js`.

Modify the initial call in `addCtrl` so it includes both the `gservice` module and controller.

<pre class="language-javascript"><code class="language-javascript">
var addCtrl = angular.module('addCtrl', ['geolocation', 'gservice']);
addCtrl.controller('addCtrl', function($scope, $http, geolocation, gservice){ ...
</code></pre>

Next add the 'gservice' module to our main `app.js` file.

<pre class="language-javascript"><code class="language-javascript">
var app = angular.module('meanMapApp', ['addCtrl', 'geolocation', 'gservice']);
</code></pre>

Lastly, let's add the 'gservice' script to our `index.html` file and delete the reference to our holder image.

        <pre class="language-markup"><code class="language-markup">
        <script src="js/gservice.js"></script>
        </code></pre>
    
        <pre class="language-markup"><code class="language-markup">
        <!-- Google Map -->
        <div class="col-md-7">
            <div id="map"><img src="holder.js/645x645"></div>
        </div>
        </code></pre>
    
And finally... it's time to test. Fire up your `server.js` and let's see what `localhost:3000` looks like now. If all went well, you should be seeing two blue dots correlating to the two users currently in your database.

![TwoLoneUsers][12]

Woohoo! We are mapping now! As a further test, go ahead and click any one of the markers you see. You should see a pop-up window with info.

![Popping][13]

Yay! Now we're popping as well!

## Adding Clickability

We've done some great things here, but right now -- there is no way for users to actually set their location on the map before submitting. Everyone is just stuck in the center of Kansas. So let's create some functionality for map clicks.

First, add the following service properties in the section for initializing variables:

<pre class="language-javascript"><code class="language-javascript">
// Handling Clicks and location selection
googleMapService.clickLat  = 0;
googleMapService.clickLong = 0;
</code></pre>

Next, add the below listener to the bottom of the `initialize()` function, right under the section that set the initial location as a bouncing red marker.

<pre class="language-javascript"><code class="language-javascript">
// Bouncing Red Marker Logic
// ...

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
});
</code></pre>

Run your `server.js` file and test it out. If everything is working, you should be able to move the red dot around the map.

![MovingDot][14]

This looks great, but astute readers may have noticed that the coordinates in our form never changed to reflect the dot's movement. The coordinates still point to Kansas. This makes sense because we never created any logic linking our coordinate movement with our Angular controller. Let's do that now.

First, let's add the `$rootScope` to the dependency list of the gservice factory. The reason we're including $rootScope here is because we'll be broadcasting the result of clicks back to our original Angular form, so we can see the coordinates clicked onto.

<pre class="language-javascript"><code class="language-javascript">
angular.module('gservice', [])
 .factory('gservice', function($rootScope, $http){
</code></pre>

Then add the logic associated with broadcasting the click events to `$rootScope` at the conclusion of the click listener event we just created.

<pre class="language-javascript"><code class="language-javascript">
// Update Broadcasted Variable (lets the panels know to change their lat, long values)
googleMapService.clickLat = marker.getPosition().lat();
googleMapService.clickLong = marker.getPosition().lng();
$rootScope.$broadcast("clicked");
</code></pre>

Now, return back to the addCtrl.js file and include the `$rootScope` service in our `addCtrl` controller.

<pre class="language-javascript"><code class="language-javascript">
addCtrl.controller('addCtrl', function($scope, $http, $rootScope, geolocation, gservice){
</code></pre>

Finally, add the below function above the `createUser` function. Here you can see that this function listens for when the `gservice` function broadcasts the "click" event. On click, the addCtrl controller will set the value of the latitude and longitude values of the form equal to the click coordinates (rounded to 3). It will also note that the location has not been HTML Verified (to differentiate between spam and authentic locations).

<pre class="language-javascript"><code class="language-javascript">
// Get coordinates based on mouse click. When a click event is detected....
$rootScope.$on("clicked", function(){

    // Run the gservice functions associated with identifying coordinates
    $scope.$apply(function(){
        $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
        $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
        $scope.formData.htmlverified = "Nope (Thanks for spamming my map...)";
    });
});

// Create User Function
// ...
</code></pre>

Go ahead and test it now.

![MovingDotRightCoordinates][15]

Looking good.

## Getting HTML5 Verified Locations

At this point, we have a pretty slick app on our hands. So if you feel like checking-out, I won't stop you. But for those hungry for the cherry on top, let's add one last function. Up until now, we're leaving it to users to provide us with their actual location. This might be fine if we're okay with crappy, spam data. But if we want a way to discriminate true locations -- we need something better.

This is where [HTML5 Geolocation][16] comes in. With the latest version of HTML, comes the ability to identify precisely where a user is located, so long as they grant permission in the browser. We'll add one last function to our app that sets the initial location of our user's dot to their HTML5 verified location.

To do this, we'll be utilizing the open-source [angularjs-geolocation][17] library. The library makes it easy to incorporate HTML5 geolocation requests in Angular applications. Since we've already added references to the `geolocation` service in our addCtrl and app.js files, all we need to do is include the logic associated with such a call in `addCtrl`. Simply paste the below code in the initialization section of `addCtrl.js` after the initial coordinates are set.

<pre class="language-javascript"><code class="language-javascript">
// Initial Coordinates set
// ...

// Get User's actual coordinates based on HTML5 at window load
geolocation.getLocation().then(function(data){

    // Set the latitude and longitude equal to the HTML5 coordinates
    coords = {lat:data.coords.latitude, long:data.coords.longitude};

    // Display coordinates in location textboxes rounded to three decimal points
    $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
    $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);

    // Display message confirming that the coordinates verified.
    $scope.formData.htmlverified = "Yep (Thanks for giving us real data!)";

    gservice.refresh($scope.formData.latitude, $scope.formData.longitude);

});
</code></pre>

The logic here uses a simple `geolocation.getLocation` function to return coordinate data. This coordinate data is then parsed, rounded to three decimal points (for privacy reasons), and then passed to the `$scope.formData.longitude` and `$scope.formData.latitude`. Once this takes place, we refresh the map and pass in the newest coordinates to be added.

Let's test this out.

![VerifiedLocation][16]

Voila! If things went correctly, your browser should have asked you for location access and then moved your red dot to near your precise location.

## ... onto Part II!

Phew. We really covered a lot of ground today. But hopefully, this exercise has left you feeling empowered to chart your own map-making path and to lay your mark on the world at large. (Puns definitely intended!)

We'll be back in a week or so for Part II, where we build a new panel for querying our map results. In the meantime, keep experimenting and adding new features at your own pace.

![PartII][17]

Stay tuned!

 [1]: https://scotch.io/wp-content/uploads/2015/09/1-LiveApp.png
 [2]: https://developers.google.com/maps/documentation/javascript/
 [3]: https://developers.google.com/maps/documentation/javascript/tutorial
 [4]: https://scotch.io/wp-content/uploads/2015/09/GoogleMapsAPIGetKey.png
 [5]: https://scotch.io/wp-content/uploads/2015/09/EnabledJavascriptAPI.png
 [6]: https://scotch.io/wp-content/uploads/2015/09/InitialHTMLContent.png
 [7]: https://scotch.io/wp-content/uploads/2015/09/InitialLocalHost.png
 [8]: https://scotch.io/wp-content/uploads/2015/09/POSTTtest.png
 [9]: https://scotch.io/wp-content/uploads/2015/09/POSTTestReceived.png
 [10]: https://scotch.io/wp-content/uploads/2015/09/FormTest.png
 [11]: https://scotch.io/wp-content/uploads/2015/09/FormTestReceived.png
 [12]: https://scotch.io/wp-content/uploads/2015/09/MapTestOne.png
 [13]: https://scotch.io/wp-content/uploads/2015/09/MarkerTestOne.png
 [14]: https://scotch.io/wp-content/uploads/2015/09/ClickableOne.png
 [15]: https://scotch.io/wp-content/uploads/2015/09/ClickableTwo.png
 [16]: https://scotch.io/wp-content/uploads/2015/09/VerifiedLocation.png
 [17]: https://scotch.io/wp-content/uploads/2015/09/PartII.png