var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// Create User Location Schema
var UserSchema = new Schema({
    username: {type: String, required: true} ,
    gender: String,
    age: Number,
    favlang: String,
    location: {type: [Number], required: true},
    htmlverified: String,
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

// Append current datetime for created_at
UserSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

// Indexes this schema in geoJSON format
UserSchema.index({location: '2dsphere'});

module.exports = mongoose.model('scotch-user', UserSchema);
