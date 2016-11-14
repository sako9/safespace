var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

var UserSchema = new Schema({
    email: {type:String, required:true, trim: true,
           lowercase:true, unique:true, validate:[validateEmail, 'Please fill a valid email address']},
    name: {type:String, required:true, trim: true, unique: true},
    password: { type: String, required: true},
    profile: {type: mongoose.Schema.Types.ObjectId,
             ref: 'pofile'}
});

module.exports = mongoose.model('User', UserSchema);