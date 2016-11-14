var Conversation = require('../models/conversation');
var Message = require('../models/message');
var User = require('../models/user');

module.exports = {
    getConversations: (req, res, next) => {
        Conversation.find({participants:"5828208da33613866df5a8c8"})
        .select('_id')
        .exec(function(err, conversations){
            if(err){
                res.send({error: err});
                return next(err);
            }
            
            var fullConverstations = [];
            conversations.forEach(function(conversation){
                Message.find({'conversationId': conversation._id})
                .sort('-createdAt')
                .limit(1)
                .populate({
                    path: "author",
                    select: "name"
                })
                .exec(function(err,message){
                    if(err){
                        res.send({error:err});
                        return next(err);
                    }
                    fullConverstations.push(message);
                    if(fullConverstations.length === conversations.length){
                        return res.status(200).json({conversations: fullConverstations});
                    }
                });
            });
        });
    },
    getConversation: (req, res,next) =>{
        Message.find({conversationId: req.params.id})
        .select('createdAt body author')
        .sort('-createdAt')
        .populate({
            path: 'author',
            select: 'name'
        })
        .exec(function(err, messages){
            if(err){
                res.send({error: err});
                return next(err);
            }
            res.status(200).json({conversation:messages});
        });
    
    
    },
    
    newConversation: (req,res,next)=>{
        if(!req.params.recipient){
            res.status(422).send({error: 'Please choose a valid recipient for your message.'});
            return next();
        }
        
        if(!req.body.composedMessage){
            res.status(422).send({error: 'Please enter a message.'});
            return next();
        }
        
        var converstation = new Conversation({
            participants: [req.body.user_id, req.params.recipient],
            topic: req.body.topic,
            view: req.body.view,
            oview: req.body.oview
        });
        console.log(converstation);
        
        converstation.save(function(err, newConversation){
            if(err){
                res.send({error: err});
                return next(err);
            }
            
            var message = new Message({
                conversationId: newConversation._id,
                body: req.body.composedMessage,
                author: req.body.user_id
            });
            
            message.save(function(err, newMessage){
                if(err){
                    res.send({error: err});
                    return next(err);
                }
                
                res.status(200).json({message:'Conversation started!', conversationId: converstation._id});
                return next();
            });
        });
    },
    sendReply: (req, res, next) =>{
        var reply = new Message({
            conversationId: req.params.id,
            body: req.body.composedMessage,
            author: req.body.user_id
        });
        
        reply.save(function(err, sentReply){
            if(err){
                res.send({error: err});
                return next(err);
                
            }
            
            res.status(200).json({message: 'Reply successfully sent!'});
            return(next);
        });
    }
};