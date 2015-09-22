/**
 * Created by Ahmed on 9/18/2015.
 */
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var UserSchema = new Schema({
    username: String,
    gender: String,
    age: Number,
    favlang: String,
    longitude: {type: Number, default: 65.901224},
    latitude: {type: Number, default: -46.629026},
    htmlverified: String,
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
    popup: String
});

UserSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

module.exports = mongoose.model('scotch-user', UserSchema);
