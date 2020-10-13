const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.use('/', express.static(__dirname + '/build'));

io.sockets.on('connection', function (socket) {
    socket.on('channelJoin',function(data){
        socket.join(data.channel);
        let dataAddinfo={uname:data.uname, msg:data.uname+"님이 "+data.channel+" 채널에 입장하셨습니다.", date:Date.now()};
        io.to(data.channel).emit('receive', {chat:dataAddinfo});
    });
    socket.on('send', function (data) {
        let dataAddinfo={uname:data.uname, msg:data.msg, date:Date.now()};
        io.to(data.channel).emit('receive', {chat:dataAddinfo});
    });
    socket.on('channelLeave', function(data){
        socket.leave(data.channel);
        let dataAddinfo={uname:data.uname, msg:data.uname+"님이 "+data.channel+" 채널에 입장하셨습니다.", date:Date.now()};
        io.to(data.channel).emit('receive', {chat:dataAddinfo});
    });
});

http.listen(4002, function(){
    console.log('listening on *:4002');
});