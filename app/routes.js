/**
 * Created by Ahmed on 9/18/2015.
 */
var mongoose        = require('mongoose');
var User            = require('./model.js');

module.exports = function(app) {

    // GET Routes
    // ===============================================

    // Retrieve JSON records for all users in the database
    app.get('/users', function(req, res){
        var query = User.find({});
        query.exec(function(err, users){
            if(err)
                res.send(err);
            res.json(users);
        });
    });


    // Retrieve JSON records for all users a certain distance away from a given address
    app.get('/filteredusers/:address/:distance', function(req, res){
/*        var address     = req.params.address;
        var distance    = req.params.distance;

        // convert address into latitude and longitude
        // calculate the farthest latitude and longitude from the point using an algorithm
        // Use the geonear formula from MongoDB 3.0

        var query = User.find({});
        query.exec(function(err, users){
            if(err)
                res.send(err);
            res.json(users);
        });*/
    });

    // POST Routes
    // ===============================================

    // Create a New User on the Map
    app.post('/users', function(req, res){
        var newuser = new User(req.body);
        newuser.save(function(err){
            if(err)
                res.send(err);
            res.json(req.body);
        });
    });

    // DELETE Routes (Dev Only)
    // ===============================================
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