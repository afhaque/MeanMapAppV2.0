var mongoose        = require('mongoose');
var User            = require('./model.js');

module.exports = function(app) {

// Redirect Route
// =======================================================

// GET Routes
// =======================================================
    // Retrieve JSON records for all users in the database
    app.get('/users', function(req, res){
        var query = User.find({});
        query.exec(function(err, users){
            if(err)
                res.send(err);

            console.log(JSON.stringify(users));
            res.json(users);
        });
    });


// POST Routes
// =======================================================
    // Create a New User on the Map
    app.post('/users', function(req, res){
        var newuser = new User(req.body);
        newuser.save(function(err){
            if(err)
                res.send(err);
            res.json(req.body);
        });
    });
    // Retrieve JSON records for all users who meet a certain set of query conditions
    app.post('/query/', function(req, res){
        // Grab all of the query parameters from the body.
        var lat             = req.body.latitude;
        var long            = req.body.longitude;
        var distance        = req.body.distance;
        var gender          = req.body.gender;
        var minAge          = req.body.minAge;
        var maxAge          = req.body.maxAge;
        var favLang         = req.body.favlang;
        var reqVerified     = req.body.htmlverified;

        // Open a generic Mongoose Query
        var query = User.find({});

        // ...include filter by Max Distance (converting miles to meters)
        if(distance){

            query = query.where('location').near({ center: {type: 'Point', coordinates: [long, lat]},
                maxDistance: distance * 1609.34,
                spherical: true});
        }

        // ...include filter by Gender (all options)
        if(gender){
            query = query.where('gender').in([gender])
        }

        // ...include filter by Min Age
        if(minAge){
            console.log(minAge);
            query = query.where('age').gte(minAge);
        }

        // ...include filter by Max Age
        if(maxAge){
            console.log(maxAge);
            query = query.where('age').lte(maxAge);
        }

        // ...include filter by Favorite Language
        if(favLang){
            query = query.where('favlang').equals(favLang);
        }

        // ...include filter for HTML5 Verified Locations
        if(reqVerified){
            query = query.where('htmlverified').equals(true);
        }

        // Execute Query and Return the Query Results
        query.exec(function(err, users){
            if(err)
                res.send(err);

            console.log(JSON.stringify(users));
            res.json(users);
        });
    });

// DELETE Routes (Dev Only)
// =======================================================
    // Delete a User off the Map
    app.delete('/users/:objID', function(req, res){
        var objID = req.params.objID;
        var update = req.body;

        User.findByIdAndRemove(objID, update, function(err, user){
            if(err)
                res.send(err);
            res.json(req.body);
            console.log(objID + "Is deleted");
        });
    });
};