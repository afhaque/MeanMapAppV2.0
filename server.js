/**
 * Created by Ahmed on 9/18/2015.
 */
var express         = require('express');
var mongoose        = require('mongoose');
var port            = process.env.PORT || 3000;
var database        = require('./app/config');
var path            = require('path');
var morgan          = require('morgan');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var app             = express();

// Express Configuration
// =====================================================
mongoose.connect(database.local.url);

// Template Engine
app.set('views', path.join(__dirname, './app/views'));
app.set('view engine', 'jade');

// Logging and Parsing
app.use(express.static(__dirname + '/public'));                 // sets the static files location to public
app.use('/bower_components',  express.static(__dirname + '/bower_components')); // Use BowerComponents
app.use(morgan('dev'));
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.urlencoded({extended: true}));             // parse application/x-www-form-urlencoded
app.use(bodyParser.text());                                     // allows bodyParser to look at raw text
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));  // parse application/vnd.api+json as json
app.use(methodOverride());

// Routes
// =====================================================
require('./app/routes.js')(app);

app.use(function(req, res){
    res.render('404', {url:req.url}); // 404 handling
});

// Listen
// =====================================================
app.listen(port);
console.log('App listening on port ' + port);
