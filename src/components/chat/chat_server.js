const express = require('express');
const { ToastBody } = require('react-bootstrap');
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
        let treeLeft, treeRight;
        let orderLeft, orderRight;
        let treenum;
        socket.to(data.channel).emit('channelJoin', 
        {treenum:treenum, tree: {Left:treeLeft, Right:treeRight}, order: {Left:orderLeft, Right:orderRight}});
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
    socket.on('addNode', function(data){ // 새로운 node는 클라에서 id -1이라는 정보가 오며, 안에 내용은 없음. db에 새로운 튜플 생성 요청
        //DB한테 새로운 block추가 요청
        let tree;
        //1. client로부터 flatdata가 오지 않을 경우: DB한테 data.channel, data.tree_id 보냄, order, tree 받아옴, 새로운 node id 받음(newnode_id)
        db.order.push(newnode_id)
        db.tree = rearrange(db.tree, db.order); //db2로 order update
        socket.to(data.channel).emit('sendTree', {tree:db.tree});
        //2. client로부터 flatdata가 올 경우: 
        order = getOrder(data.tree);
        data.tree = data.tree.map((cur) => cur.id==='-1' ? cur.id=newnode_id : cur.id);
        socket.to(data.channel).emit('sendTree', {tree:data.tree});
    });
    socket.on('deleteNode', function(data){
        //DB2로부터 order_db 받아옴, 삭제 node id:data.node_id
        let order_db = [];

        //1. 클라가 삭제되기 전 flatdata를 보내줄 경우
        let dellist = delNode(data.tree, data.node_id);
        data.tree = data.tree.filter(i => !dellist.includes(i.id));
        order = getOrder(data.tree);
        //2. 클라가 삭제하는 parent id만 보낼 경우: db한테 tree 전체 요청(db.tree)
        rearrange(db.tree, order_db);
        dellist = delNode(db.tree, data.node_id);
        db.tree = db.tree.filter(i => !dellist.includes(i.id));
        order = getOrder(db.tree);
        //3. 클라가 삭제하는 id 전체를 보낼 경우
        dellist = data.dellist; //DB 한테 지우는 노드들 알려준 후 업뎃 된 트리 받아옴
        order = getOrder(db.tree);
        //4. 클라가 삭제된 후 flatdata만 보낼 경우
        order = getOrder(data.tree);
        dellist = order_db.reduce((sequence, cur) => { //db의 order와 client의 order 비교 후 삭제 된 node들 추출
            if(!order.includes(cur))
                sequence.push(cur)
            return sequence;
        }, []);
        //db1로 dellist 보내서 node 삭제, db2로 order 업데이트

        socket.to(data.channel).emit('sendTree', {tree:db.tree}); 
        //or
        socket.to(data.channel).emit('sendTree', {tree:data.tree}); 
    });
    socket.on('sunsApple', function(data){ // 클라에서 sunsapple의 node_id는 -1로 전달
        //db1로 sunsApple node의 정보들 전달, flatdata로부터 order 추출, db1로부터 sunsapple id 얻음(apple_id)
        let order = getOrder(data.tree);
        order[order.indexOf('-1')] = apple_id;
        let changeParent = data.tree.reduce((nodes, cur) => {
            if(cur.parent==='-1')
                nodes.push(cur.id);
        }, []);
        //db1로 changeParent의 parent들 apple_id로 변경, db2로 order 업데이트

        socket.to(data.channel).emit('sendTree', {tree:data.tree});
    });
    socket.on('changeText', function(data) {
        //DB한테 data.text, data.tree_id, data.node_id 보냄
        socket.to(data.channel).emit('sendNode', {node:data.node_data});
    });
    socket.on('changeAttribute', function(data){
        //DB한테 data.color, data.deco, data.weight, data.tree_id, data.node_id 보냄
        if(data.deco!==undefined)
            to_db = (data.tree_id, data.node_id, data.deco);
        if(data.color!==undefined)
            to_db = (data.tree_id, data.node_id, data.color);
        if(data.weight!==undefined)
            to_db = (data.tree_id, data.node_id, data.weight);

        socket.to(data.channel).emit('sendNode', {node:data.node_data});
    });
    socket.on('changeTree', function(data){
        //DB로부터 새로운 tree 요청 data.tree_id
        socket.to(data.channel).emit('changeTree', {tree:db.tree});
    });
    socket.on('migrateNode', function(data){
        //data.origin_tree -> data.target_tree, order
        //옮긴 후의 flatdata 온다고 가정
        let origin_order = getOrder(data.origin_tree);
        let target_order = getOrder(data.target_tree);
        let dellist = delNode(data.target_tree, data.node_id);
        let datas = data.target_tree.filter(i => dellist.includes(i.id)); // 옮겨진 node들 정보
        //db1의 origin_tree에서 dellist 삭제, db2의 target_tree에 datas 추가

        socket.to(data.channel).emit('sendTrees', {tree:{origin: db.origin_tree, target: db.target_tree}});
    });
    socket.on('moveNode', function(data){
        //옮긴 후의 flatdata 온다고 가정
        let order = getOrder(data.tree);
        let dellist = delNode(data.tree, data.node_id);
        let datas = data.tree.filter(i => dellist.includes(i.id)); // 옮겨진 node들 정보
        //db1의 datas의 parent들 업뎃

        socket.to(data.channel).emit('sendTree', {tree:data.tree});
    });
});

http.listen(4002, function(){
    console.log('listening on *:4002');
});

function delNode(tree, node_id) { // 지우는 노드 id들 return
    let deletenodes = [node_id];
    for(let i=0; i<tree.length; i++) {
      if(deletenodes.includes(tree[i].parent)) 
        deletenodes.push(tree[i].id);
    }
    return deletenodes;
  }
  
function rearrange(tree, sequence) { // tree들을 sequence 순서대로 재배치한 배열을 return
    let result = [];
    for(let i=0; i<sequence.length; i++) 
        result.push(tree[String(sequence[i])]);
    return result;
}

function getOrder(tree) { // tree의 order 뽑아내기
    return tree.reduce((sequence, cur) => {
        sequence.push(cur.id);
        return sequence;
    }, []);
}

/* client로부터의 flatdata 예시 (data.tree)
var tree = [{id: '1', title: 'N1', parent: 'NULL'},
            {id: '2', title: 'N2', parent: 'NULL'},
            {id: '3', title: 'N3', parent: '2'},
            {id: '4', title: 'N4', parent: '2'},
            {id: '5', title: 'N4', parent: '4'},
            {id: '6', title: 'N4', parent: '4'},
            {id: '7', title: 'N4', parent: '2'},
            {id: '8', title: 'N5', parent: 'NULL'},
*/

/* db로부터의 tree 예시 (db.tree)
var tree = {'1' : {id: '1', title: 'N1', parent: 'NULL'},
            '2' : {id: '2', title: 'N2', parent: 'NULL'},
            '3' : {id: '3', title: 'N3', parent: '2'},
            '4' : {id: '4', title: 'N4', parent: '2'},
            '5' : {id: '5', title: 'N4', parent: '4'},
            '6' : {id: '6', title: 'N4', parent: '4'},
            '7' : {id: '7', title: 'N4', parent: '2'},
            '8' : {id: '8', title: 'N5', parent: 'NULL'},
};
*/

/*tree에 지워진 데이터 바로 update 되는 version
function delNode(tree, node_id) { 
    let deletenodes = [node_id];
    for(let i=0; i<tree.length; i++) {
      if(tree[i].id === node_id)
        tree.splice(i, 1);
      else if(deletenodes.includes(tree[i].parent)) {
        deletenodes.push(tree[i].id);
        tree.splice(i, 1);
      }
    }
    return deletenodes;
  }
  */