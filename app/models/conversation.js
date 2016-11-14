var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ConversationSchema = new Schema({
    created: {type: Date, default: Date.now},
    topic: {type:String, required:true, trim: true,
           lowercase:true},
    view: {type:String, required:true},
    oview: {type:String, required:true},
    participants: [{ type: Schema.Types.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('Conversation', ConversationSchema); 