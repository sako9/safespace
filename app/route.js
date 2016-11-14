module.exports = function(router){
    var user = require('./controller/user');
    var chat = require('./controller/conversations')
    
    /*
    Routes
    */
    
    //user routes
    router.post('/register', user.register);
    router.post('/login', user.login);
    
    router.get('/conversations',chat.getConversations);
    router.get('/conversations/:id', chat.getConversation);
    router.post('/conversations/:id', chat.sendReply);
    router.post('/new/:recipient', chat.newConversation);
    
}