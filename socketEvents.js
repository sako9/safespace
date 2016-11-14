exports = module.exports = function(io){
    io.on('connection', (socket) =>{
        socket.on('enter conversation', (conversation) =>{
            socket.join(conversation);
            console.log("JOined")
        });
        
        socket.on('leave conversation', (conversation)=>{
            socket.leave(conversation);
        });
        
        socket.on('new message', (conversation)=> {
            io.sockets.in(conversation).emit('refresh messages', conversation);
        });
        
        socket.on('disconnect', () =>{
            
        });
    });
}