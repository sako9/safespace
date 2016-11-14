var mongoose = require('mongoose');
var User = require('../models/user');

module.exports = {
    
    getAll: (req, res) => {
        var query= User.find.populate('profile');
        query.exec(function(err, users){
            if(err){res.json({error:err});}
            res.json(users);
        });
    },
    register: (req, res) => {
        var newUser = new User(req.body);
        console.log(newUser);
        
        newUser.validate(function(error){
            if(error){
                res.json({
                    error: error
                });
            }else{
                newUser.save(function(err){
                    if(err){
                        res.json({
                            error:err
                        });
                    }else{
                        res.status(200);
                        res.json({
                            "id":newUser._id
                        });
                    }
                });
            }
        });
    },
    login:(req,res)=> {
        User.findONe({email: req.email}, function(err, user){
            if (err){
                res.json({
                    error:err
                });
            }else if(user && user.password == req.password){
                res.status(200);
                res.json({
                    "id" : user._id
                });
            }else{
                res.status(401).json({
                    "message": "Invalid credentials"
                })
            }
            
        });
    }
    
}