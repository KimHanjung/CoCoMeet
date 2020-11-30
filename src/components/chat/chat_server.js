const express = require('express');
const { ToastBody } = require('react-bootstrap');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.use('/', express.static(__dirname + '/build'));
console.log(__dirname)

chat_server = io.of('/chat_server');
board_server = io.of('/board_server');
channel_server = io.of('/channel_server');
//var clients = io.of('/board_server').clients();

// const db_server = new GraphQLServer({

// })


const redis = require('redis');
// const r_cli = redis.createClient({port : 6379, host : 'localhost'}); - 됨 (local)
const r_cli = redis.createClient(6379, 'localhost');
const pub = redis.createClient(6379, 'localhost');
const sub = redis.createClient()
// const r_cli = redis.createClient({ host : "http://3.34.138.234", port : 6379}); - 안 됨.
//const r_cli = redis.createClient({ host : "3.34.138.234", port : 6379}); 
//const r_cli = redis.createClient(6379, '3.34.138.234'); // - 안 됨

r_cli.on("error", function(err) {
    console.log("ERROR"+err);
    process.exit(1);
});


// sample
// r_cli.hmset("R0_order", 0, "room0-tree0-order", 1, "room0-tree1-order");
// r_cli.hmset("R0-0", "room_id", 0, "tree_id", 0, "node_id", 0, "title", "0-0", "parent", "NULL", "color", "blue", "deco", "normal", "weight", "normal");

// default
r_cli.set("Rnum", 0) // room 개수 저장
r_cli.hmset("TID", 0, 1); // room별로 tree 개수 저장. room_id : tree_num
r_cli.hmset("NID", 0, 1); // room별로 node 개수 저장. room_id : node_num
r_cli.hmset("RCode","zxcvbnm", 999);
r_cli.hmset("RName",999,'cocococococo');

r_cli.get("Rnum", (err, obj) => {
    console.log("rnum:",obj)
});

function newRoom(roomCode, roomName) {
    // 생성될 room의 id
    var id;
    r_cli.get("Rnum", (err, obj) => {
        id = obj;
        r_cli.hmset("RCode", roomCode, String(id));
        r_cli.hmset("RName", id, roomName);
    });
    r_cli.incr("Rnum");

    var tree_0 = newTree(room_id);
    var tree_1 = newTree(room_id);

    return id;
}

// tree 정보는 Key는 R0-0 이런식으로, 해당 value는 hash 형태로 저장한다
function get_order(room_id, tree_id) {
    var r_info = "R" + String(room_id)+"_order";
    if (r_cli.EXISTS(r_info) == 0) {
        console.log("room does not exist")
        return null;
    }
    else {
        var order;
        r_cli.hmget(r_info, tree_id, (err,obj) => {
            console.log(obj)
            order = obj.split(",");
        });
        return order;
    }
}

function update_order(room_id, tree_id, order) {
    var r_info = "R" + String(room_id)+"_order";
    r_cli.hmset(r_info, tree_id, order);
}

function getTreeNum(room_id) {
    r_cli.hmget("TID", room_id, (err,obj) => {
        return obj;
    });
}

// 들어갈 트리가 있는 경우. Node만 업데이트 해 주면 된다.
function newApple(room_id, tree_id, text, parent) {
    var newid;
    r_cli.hmget("NID", room_id, (err, obj) => {
        // obj는 지금 만들어야 할 Node id가 담겨있음.
        newid = obj;
        var info = "R"+room_id+"-"+obj;
        // console.log(info);
        r_cli.hmset(String(info), "room_id", String(room_id), "tree_id", String(tree_id), "node_id", String(obj), "title", text , "parent", String(parent), "color", "blue", "deco", "normal", "weight", "normal");
    });
    r_cli.HINCRBY("NID", room_id, 1); //해당 room_num의 node 개수 +1
    return newid;
}
// new block은 new apple을 text, parent 지정해서 사용하면 된다.


function newTree(room_id) {
    var treeId;
    r_cli.hmget("TID", room_id, (err, obj) => {
        treeId = obj;
    })
    newApple(room_id, treeId, "New Block", "NULL");

    r_cli.HINCRBY("TID", room_id, 1);
    return treeId;
}

function delBlock(room_id, node_id) {
    var target = "R"+room_id+"-"+node_id;
    c_cli.del(target);   
    // 해당 room에서 node 수는 그대로 둔다 -> id는 유지되어야 하기 때문
    // key를 지운다
}

function editAttr(room_id, node_id, attr, content) {
    var target = "R" + room_id + "-" + node_id;
    c_cli.hmset(target, attr, content);
}


board_trees = [];
channel_names = {};

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

        //DB한테 트리 0, 1 요청 -o
        //DB한테 트리 개수 요청 -o
        let treeLetf, treeRight;
        let orderLeft, orderRight;
        let treenum;
        orderLeft = get_order(data.room_id, 0);
        orderRight = get_order(data.room_id, 1);
        treenum = getTreeNum(data.room_id);
        var info;
        for (var elem in orderLeft) {
            info = "R" + r_id+"-"+elem;
            r_cli.HMGET(String(info), "node_id","room_id", "tree_id", "title", "parent", "color", "weight", "deco", (err, obj) => {
                var treeeeee = {"room_id" : obj[1], "node_id" : obj[0], "tree_id" : obj[2], "title" : obj[3], "parent": obj[4], "color" : obj[5], "weight" : obj[6], "deco" : obj[7]};
                treeLeft[elem] = treeeeee;
            });
        }
        for (var elem in orderRight) {
            info = "R" + r_id+"-"+elem;
            r_cli.HMGET(String(info), "node_id","room_id", "tree_id", "title", "parent", "color", "weight", "deco", (err, obj) => {
                var treeeeee = {"room_id" : obj[1], "node_id" : obj[0], "tree_id" : obj[2], "title" : obj[3], "parent": obj[4], "color" : obj[5], "weight" : obj[6], "deco" : obj[7]};
                treeRight[elem] = treeeeee;
            });
        }

        rearrange(treeLeft, orderLeft);
        rearrange(treeRight, orderRight);
        //socket.to(data.channel).emit('channelJoin', 
        //{treenum:treenum, tree: {Left:treeLeft, Right:treeRight}});
        socket.to(data.channel).emit('sendTree', {treenum:treenum, treeid: 0, tree:treeLeft});
        socket.to(data.channel).emit('sendTree', {treenum:treenum, treeid: 1, tree:treeRight});

        console.log(data.channel);
    });
    socket.on('channelLeave', function(data){
        socket.leave(data.channel);
        console.log(data.channel);
    });
    socket.on('addTree', function(data){ 

        //DB한테 새로운 트리 생성 요청 -o
        //트리 개수 요청 -o
        let treenum, treeid;
        treeid = newTree(data.room_id);
        treenum = getTreeNum(data.room_id);

        socket.to(data.channel).emit('addTree', {treeid: treeid, treenum: treenum});

        console.log(data.tree);
    });

    socket.on('addNode', function(data){ // room_id, tree_id 새로운 node는 클라에서 id -1이라는 정보가 오며, 안에 내용은 없음. db에 새로운 튜플 생성 요청
        //DB한테 새로운 block추가 요청
        let tree;

        //1. client로부터 flatdata가 오지 않을 경우: DB한테 data.channel, data.tree_id 보냄, order, tree 받아옴, 새로운 node id 받음(newnode_id)
        // db.order.push(newnode_id)
        // db.tree = rearrange(db.tree, db.order); //db2로 order update
        // socket.to(data.channel).emit('sendTree', {treeid: treeid, tree:db.tree});
        //2. client로부터 flatdata가 올 경우: 
        order = getOrder(data.tree);
        data.tree = data.tree.map((cur) => cur.id==='-1' ? cur.id=newnode_id : cur.id);
        newApple(data.room_id, data.tree_id, "newNode", "NULL");
        socket.to(data.channel).emit('sendTree', {treeid: treeid, tree:data.tree});
    });

    socket.on('deleteNode', function(data){
        //DB2로부터 order_db 받아옴, 삭제 node id:data.node_id
        let order_db = [];
        order_db =get_order(data.room_id, data.tree_id)
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

        //db1로 dellist 보내서 node 삭제 -o
        // db2로 order 업데이트 -o
        for (var elem in dellist) {
            delBlock(data.room_id, elem);
        }
        update_order(dtat.room_id, String(dellist));

        socket.to(data.channel).emit('sendTree', {treeid: treeid, tree:db.tree}); 
        //or
        socket.to(data.channel).emit('sendTree', {treeid: treeid, tree:data.tree}); 
    });

    socket.on('sunsApple', function(data){ // 클라에서 sunsapple의 node_id는 -1로 전달
        //db1로 sunsApple node의 정보들 전달 -o , flatdata로부터 order 추출, db1로부터 sunsapple id 얻음(apple_id) -o
        let apple_id = newApple(data.room_id, data.tree_id, data.text);

        let order = getOrder(data.tree);
        order[order.indexOf('-1')] = apple_id;
        let changeParent = data.tree.reduce((nodes, cur) => {
            if(cur.parent==='-1')
                nodes.push(cur.id);
        }, []);
        //db1로 changeParent의 parent들 apple_id로 변경 -o
        for (var elem in changeParent) {
            editAttr(data.room_id, elem, "parent", apple_id);
        }
        //db2로 order 업데이트 -o
        update_order(data.room_id, data.tree_id, String(order));

        socket.to(data.channel).emit('sendTree', {treeid: treeid, tree:data.tree});
    });

    socket.on('changeText', function(data) {
        //DB한테 data.text, data.tree_id, data.node_id 보냄 -o
        editAttr(data.room_id, data.node_id, "title", data.text);
        socket.to(data.channel).emit('sendNode', {treeid: treeid, node:data.node_data});
    });

    socket.on('changeAttribute', function(data){
        //DB한테 data.color, data.deco, data.weight, data.tree_id, data.node_id 보냄
        for (var treeid in data.tree_id_list) {
            if(data.deco!==undefined)
                // to_db = (treeid, data.tree_id_list[treeid], data.deco);
                editAttr(data.room_id, data.node_id, "deco", data.deco);
            if(data.color!==undefined)
                // to_db = (treeid, data.tree_id_list[treeid], data.color);
                editAttr(data.room_id, data.node_id, "color", data.color);
            if(data.weight!==undefined)
                // to_db = (treeid, data.tree_id_list[treeid], data.weight);
                editAttr(data.room_id, data.node_id, "weight", data.weight);
        }

        socket.to(data.channel).emit('sendNode', {treeid: treeid, node:data.node_data});
    });
    socket.on('changeTree', function(data){
        //DB로부터 새로운 tree 요청 data.tree_id
        order = get_order(data.room_id, data.tree_id);
        var treee = {};
        var r_id = data.room_id;
        var info;
        var TOTAL = {};
        for (var elem in order) {
            info = "R" + r_id+"-"+elem;
            r_cli.HMGET(String(info), "node_id","room_id", "tree_id", "title", "parent", "color", "weight", "deco", (err, obj) => {
                var treeeeee = {"room_id" : obj[1], "node_id" : obj[0], "tree_id" : obj[2], "title" : obj[3], "parent": obj[4], "color" : obj[5], "weight" : obj[6], "deco" : obj[7]};
                TOTAL[elem] = treeeeee;
            });
        }
        var reTree = rearrange(TOTAL, order);
        socket.to(data.channel).emit('changeTree', {treeid: treeid, tree:reTree});
    });

    socket.on('migrateNode', function(data){
        //data.origin_tree -> data.target_tree, order
        //옮긴 후의 flatdata 온다고 가정
        let origin_treeid, target_treeid;
        let origin_order = getOrder(data.origin_tree);
        let target_order = getOrder(data.target_tree);
        let parent = target_tree.filter(i => i.id===node_id)[0].parent;

        let delList = delNode(data.target_tree, node_id); //delList : tree만 바꾸면 되는 애들
        for (var elem in delList) {
            editAttr(data.room_id, elem, "tree_id", String(target_treeid));
        }
        editAttr(data.room_id, node_id, "parent", String(parent));


        socket.to(data.channel).emit('sendTree', {treeid: origin_treeid, tree:db.origin_tree});
        socket.to(data.channel).emit('sendTree', {treeid: target_treeid, tree:db.target_tree});
    });
    
    socket.on('moveNode', function(data){ //같은 트리 안에서의 이동
        //옮긴 후의 flatdata 온다고 가정
        let order = getOrder(data.tree);
        let parent = data.tree.filter(i => i.id===node_id)[0].parent;
        //db1의 datas의 parent들 업뎃
        editAttr(data.room_id, data.node_id, "parent", String(parent));
        socket.to(data.channel).emit('treeid: treeid, sendTree', {tree:data.tree});
    });
});

sub.subscribe("channel");
channel_server.on('connection', function(socket) {
    client_id = socket.id;
    socket.on('createChannel', function (data, callback) {    
        let code = ''
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        Array.from(Array(5)).forEach(() => {
        code += possible.charAt(Math.floor(Math.random() * possible.length))
        });
        var room_id;
        r_cli.set("seungyeon", "hello", function(e, r){
            pub.publish("channel", "seungyeon");
        } );
        // 코드 - room_id 연결
        //room_id = newRoom(code, data.channel);  


        callback(code, room_id);
        channel_names[code] = data.channel;
        });

    socket.on('joinChannel', function(data, callback) {
        var RID; // Room_id
        var RNAME;
        r_cli.hmget("RCode", String(data.channel_code), (err, obj) => {
            RID = obj; // ROOM_ID 가 저장되어있음
        });
        r_cli.hmget("RName", RID, (err,ojb) => {
            RNAME = obj;
        });
        callback(RID,RNAME);
    });
})

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