const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.use('/', express.static(__dirname + '/build'));
console.log(__dirname)

chat_server = io.of('/chat_server');
board_server = io.of('/board_server');
//var clients = io.of('/board_server').clients();

board_trees = [];

chat_server.on('connection', function (socket) {
    socket.on('channelJoin',function(data){
        socket.join(data.channel);
        console.log("채널입장");
        let dataAddinfo={uname:data.uname, msg:data.uname+"님이 "+data.channel+" 채널에 입장하셨습니다.", date:Date.now()};
        chat_server.to(data.channel).emit('receive', {chat:dataAddinfo});
    });
    socket.on('send', function (data) {
        console.log("send: "+data.msg);
        let dataAddinfo={uname:data.uname, msg:data.msg, date:Date.now()};
        chat_server.to(data.channel).emit('receive', {chat:dataAddinfo});
    });
    socket.on('channelLeave', function(data){
        socket.leave(data.channel);
    });
});

board_server.on('connection', function(socket){
    socket.on('channelJoin', function(data){
        socket.join(data.channel);
        //DB한테 트리 0, 1 요청
        //DB한테 트리 개수 요청
        let treeLetf, treeRight;
        let orderLeft, orderRight;
        let treenum;
        socket.to(data.channel).emit('channelJoin', 
        {treenum:treenum, tree: {Left:treeLetf, Right:treeRight}, order: {Left:orderLeft, Right:orderRight}});
        console.log(data.channel);
    });
    socket.on('channelLeave', function(data){
        socket.leave(data.channel);
        console.log(data.channel);
    });
    socket.on('addTree', function(data){
        //DB한테 새로운 트리 생성 요청, 트리 개수 요청
        let treenum;
        socket.to(data.channel).emit('addTree', {treenum:treenum});
        console.log(data.tree);
    });
    socket.on('addNode', function(data){
        //data.tree_id를 DB한테 보낸 후 새로운 block추가 요청
        let tree;
        socket.to(data.channel).emit('addNode', {tree_id:data.tree_id, tree:tree});
        console.log(data.text);
    });
    socket.on('deleteNode', function(data){
        //DB로부터 order 받아옴, 삭제 node id:data.node_id
        let order = [];
        let delete_nodes = [data.node_id];
        delBlock(order, data.node_id, delete_nodes);
        delete_nodes = flat(delete_nodes);
        //data.tree_id와 delete_nodes, order을 디비로 보냄
        //delete_nodes: 삭제할 node의 id들
    });
    socket.on('selectMessage', function(data){
        
        console.log(data.text);
    });
    socket.on('changeAttribute', function(data){
        //DB한테 data.color, data.deco, data.weight, data.tree_id, data.node_id 보냄    
    });
    socket.on('changeTree', function(data){
        //DB로부터 새로운 tree 요청 data.tree_id
    });
    socket.on('migrateNode', function(data){
        //data.origin_tree -> data.target_tree, order
        
        console.log(data.text);
    });
    socket.on('moveNode', function(data){
        console.log(data.text);
    });
});

http.listen(4002, function(){
    console.log('listening on *:4002');
});

function delBlock(arr, target, result) { // 삭제 할 block의 child로 묶인 배열을 result에 리턴, 삭제 된 order을 arr에 리턴
    for(let i=0;i<arr.length;i++) {
        if(Array.isArray(arr[i])){
            delBlock(arr[i], target, result);
            if(Array.isArray(arr[i]) && !arr[i].length)
                arr.splice(i, 1);
        }
        else if(arr[i]===target){
            if(Array.isArray(arr[i+1])){
                result.push(arr[i+1])
                arr.splice(i, 2);
            }
            else
                arr.splice(i, 1);
        }
    }
}


function flat(arr) { // nested array를 flatten array로 변환
    return arr.reduce(
      (acc, val) =>
        Array.isArray(val) ? acc.concat(flat(val)) : acc.concat(val),
      [],
    );
  }