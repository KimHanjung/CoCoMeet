const express = require('express');
const { title } = require('process');
const { stringify } = require('querystring');
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
const r_cli = redis.createClient(6379, "3.34.138.234");
const pub = redis.createClient(6379, "3.34.138.234");
const sub = redis.createClient(6379, "3.34.138.234");
//sub.setMaxListeners(0);
// localhost
// const r_cli = redis.createClient(6379, "localhost");
// const pub = redis.createClient(6379, "localhost");
// const sub = redis.createClient(6379, "localhost");

sub.subscribe("merry");
sub.subscribe('christ');
sub.subscribe("mas");


r_cli.on("error", function(err) {
    console.log("ERROR"+err);
    process.exit(1);
});


// sample
// r_cli.hmset("R0_order", 0, "0,2", 1, "1");
// r_cli.hmset("R0-0", "room_id", 0, "tree_id", 0, "node_id", 0, "title", "0-0", "parent", "NULL", "color", "blue", "deco", "normal", "weight", "normal");

// default
r_cli.set("Rnum", 0) // room 개수 저장
r_cli.hmset("Tnum", 0, 0);
r_cli.hmset("Nnum", 0, 0)
// r_cli.hmset("TID", 0, 0); // room별로 tree id 누적. room_id : tree_num
r_cli.hmset("NID", 0, 0); // room별로 node id 누적. room_id : node_num
r_cli.hmset("RCode","zxcvbnm", 999);
r_cli.hmset("RName",999,'cocococococo');


// tree 정보는 Key는 R0-0 이런식으로, 해당 value는 hash 형태로 저장한다
function get_order(room_id, tree_id) {
    //console.log("room_id", room_id, "tree_id", tree_id)
    var r_info = "R" + String(room_id)+"_order";
    console.log("r_info" , r_info)
    if (r_cli.EXISTS(r_info) == 0) {
        console.log("room does not exist")
        return null;
    }
    else {
        var order;

        console.log("tree_id", tree_id);        
        r_cli.hmget(r_info, tree_id, (err,obj) => {
            console.log('r_order', obj[0])
            order = obj[0].split("");
            order.shift();
            order.pop();
            order = order.filter(i => i !== ',');
            console.log("getorder",order);
            let dic = {}
            dic['room_id'] = room_id;
            dic['tree_id'] = tree_id;
            dic['order'] = order;
            dic['type']="gord";
            dic = JSON.stringify(dic);

            pub.publish("christ", dic);
        });
    }
}

function update_order(room_id, tree_id, order) {
    var r_info = "R" + String(room_id)+"_order";
    //console.log("before order DB", "room_num", r_info, "tree_id", tree_id, "order", order)
    if (r_cli.HEXISTS(r_info, tree_id) == 0) {
        console.log("In R-",room_id, "tree",tree_id, "does not exist")
        return false;
    }
    r_cli.hmset(r_info, tree_id, order);
    return true;
}

function getTreeNum(room_id) {
    r_cli.hmget("Tnum", room_id, (err,obj) => {
        return obj;
    });
}


function newApple(room_id, tree_id, text, parent, sock_msg) {
    //console.log('newApple entered with room_id :', room_id, "tree_id :", tree_id);
    var newid;// = [999];
    r_cli.hmget("NID", room_id, (err, obj) => {
        if (err) {
            console.log("newApple err",err)
        }   
        // obj는 지금 만들어야 할 Node id가 담겨있음.
        //newid = newid.concat(obj);
        newid=obj[0];
        var info = "R"+room_id+"-"+obj;
        
        r_cli.hmset(String(info), "room_id", String(room_id), "tree_id", String(tree_id), "node_id", String(obj), "title", text , "parent", String(parent), "color", "blue", "deco", "none", "weight", "normal");
        r_cli.HINCRBY("NID", room_id, 1); //해당 room_num의 node 개수 +1
        r_cli.HINCRBY("Nnum", room_id, 1);
        let msg = {"type" : "apple", "room_id" : room_id, "newid" : newid, "treeid" : tree_id, "sock_msg" : sock_msg};
        msg = JSON.stringify(msg);

        //console.log("In newApple, node", newid, "generated")
        pub.publish("merry", msg);

    });
    return true;
    
}
// new block은 new apple을 text, parent 지정해서 사용하면 된다.

/*
function newTree(room_id) {
    var treeId;
    r_cli.hmget("TID", room_id, (err, obj) => {
        treeId = obj;
    })
    newApple(room_id, treeId, "New Block", "NULL");

    r_cli.HINCRBY("TID", room_id, 1);
    return treeId;
}
*/

function editAttr(room_id, node_id, attr, content, sock_msg, order) {
    var target = "R" + room_id + "-" + node_id;

    if (r_cli.EXISTS(target) == 0) {
        console.log(target, "does not exist")
    }
    else {
        r_cli.hmset(target, attr, content);
        let dic = {};
        dic["room_id"] = room_id;
        dic["type"] = "edt";
        dic["node_id"] = node_id;
        dic["sock_msg"] = sock_msg;
        dic["order"] = order;
        
        dic = JSON.stringify(dic);
        pub.publish("mas", dic);
    }
}


board_trees = [];
channel_names = {};

chat_server.on('connection', function (socket) {
    socket.on('channelJoin',function(data){
        socket.join(data.channel);
        console.log("채팅방입장");
        let dataAddinfo={uname:data.uname, msg:data.uname+"님이 "+data.channel+" 채널에 입장하셨습니다.", date:Date.now()};
        chat_server.to(data.channel).emit('receive', {chat:dataAddinfo});
    });
    socket.on('send', function (data) {
        //console.log("send: "+data.msg);
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
        
        console.log("보드방입장");
        //DB한테 트리 0, 1 요청 -o
        //DB한테 트리 개수 요청 -o
        let treeLeft = {};
        let treeRight = {};
        let orderLeft, orderRight;
        let treenum;

        let room_id = data.room_id;
        let r_info = "R"+room_id+"_order";
        console.log(socket.id,"+room_id : ", data.room_id, room_id)
        if (r_cli.EXISTS(r_info) == 0) {
            console.log("room does not exist")
        }
        else {
            r_cli.hmget(r_info, 0, 1, (err, obj) => {
                orderLeft = obj[0];
                orderLeft = orderLeft.split("");
                
                orderLeft.shift(); // [
                orderLeft.pop(); // ]
                orderLeft = orderLeft.filter(i => i !== ',');

                orderRight = obj[1];
                orderRight = orderRight.split("");
                
                orderRight.shift();
                orderRight.pop();
                orderRight = orderRight.filter(i => i !== ',');

                r_cli.hmget("Tnum", room_id, (err,obj) => {
                    //console.log("treenum", obj);
                    treenum = obj[0];

                    var info_l;
                    var info_r;
                    for(var i=0, elem; elem=orderLeft[i]; i++){

                        info_l = "R" + room_id+"-"+elem;
                        r_cli.HMGET(info_l, "node_id","room_id", "tree_id", "title", "parent", "color", "weight", "deco", (err, obj) => {
                            var treeeeee = {"room_id" : obj[1], "node_id" : obj[0], "tree_id" : obj[2], "title" : obj[3], "parent": obj[4], "color" : obj[5], "weight" : obj[6], "deco" : obj[7]};
                            treeLeft[obj[0]] = treeeeee;
                            let dic = {};
                            dic["room_id"] = room_id;
                            dic["type"] = "b_join";
                            dic["content"] = obj[0]; // node_id
                            dic["treedata"] = treeLeft;
                            dic["order"] = orderLeft;
                            dic = JSON.stringify(dic);
                            pub.publish("christ", dic);
                        });
                    }

                    for(var i=0,elem1; elem1=orderRight[i]; i++){

                        info_r = "R" + room_id+"-"+elem1;
                        r_cli.HMGET(info_r, "node_id","room_id", "tree_id", "title", "parent", "color", "weight", "deco", (err, objj) => {
                            var treeeeee = {"room_id" : objj[1], "node_id" : objj[0], "tree_id" : objj[2], "title" : objj[3], "parent": objj[4], "color" : objj[5], "weight" : objj[6], "deco" : objj[7]};
                            treeRight[objj[0]] = treeeeee;
                            let dic1 = {};
                            dic1["room_id"] = room_id;
                            dic1["type"] = "b_join";
                            dic1["content"] = objj[0];
                            dic1["treedata"] = treeRight;
                            dic1["order"] = orderRight;
                            dic1 = JSON.stringify(dic1);
                            pub.publish("merry", dic1);

                        });
                    }
                    
                    sub.on("message", (channel, message) => {
                        message = JSON.parse(message);
                        if (message.type === "b_join") {
                            if (message.room_id === room_id && channel === "christ" && message.content === message.order[message.order.length-1]) {
                                treeLeft = rearrange(message.treedata, orderLeft);
                                //console.log("before sendtree", treeLeft)
                                board_server.to(data.channel).emit('sendTree', {sunny: data.channel, treenum:"2", treeid: "0", tree:treeLeft});

                            }
                            if (message.room_id === room_id && channel === "merry" && message.content === message.order[message.order.length-1]){
                                treeRight = rearrange(message.treedata, orderRight);
                                board_server.to(data.channel).emit('sendTree', {sunny: data.channel, treenum:"2", treeid: "1", tree:treeRight});
                                
                            }
                        }
                    })
                    
                    //socket.to(data.channel).emit('channelJoin', 
                    //{treenum:treenum, tree: {Left:treeLeft, Right:treeRight}});
                    
            
                    // console.log(data.channel);
                });
            })
        }

    });

    socket.on('channelLeave', function(data){
        socket.leave(data.channel);
        console.log(data.channel);
    });

    socket.on('addTree', function(data){ 
        let treenum, treeid;
        let room_id = data.room_id;
        r_cli.hmget("Tnum", room_id, (err, obj) => {
            treeid = obj[0];
            console.log("treeid", treeid)
            let cc = "Tree: "+treeid+" New Block"
            newApple(room_id, treeid, cc, "NULL", "addTree"); // 새로운 노드 만듦. 신호 보냈음.
            /// new apple의 id를 받아서 order를 만들고, db에 업데이트 해야함
            
            sub.on("message", (channel, message) => { // 이거는 tree 정보를 다 받아오고나서 실행된다. treedata를 client 전용으로 재배열
                if (channel === 'merry') {
                    message = JSON.parse(message);
                    // console.log(".....message", message);
                    // console.log("22222222222treeid", treeid)
                    if (message.room_id === data.room_id && message.type === "apple" && message.treeid === treeid && message.sock_msg === "addTree") {
                        let newid = message.newid;
        
                        order = "["+newid+"]";
                        //console.log("]]]]]]]]]]]]]]]]]]order", order);
                        let r_info = "R"+data.room_id+"_order";
                        r_cli.hmset(r_info, treeid, order); 
                        // 어떻게 order 형태를 만든 다음에 update
                    }
                }
            })
            //r_cli.HINCRBY("TID", room_id, 1);
            console.log("여긴 오면 안 되는 Tnum")
            r_cli.HINCRBY("Tnum", room_id, 1);
            r_cli.hmget("Tnum", room_id, (err, obj) => {
                treenum = obj;
                // console.log("before addTree, treeid:", treeid[0], "treenum:",treenum[0])
                board_server.to(data.channel).emit('addTree', {treeid: treeid[0], treenum: treenum[0]});
            })
        })

        
    });


    socket.on('addNode', function(data){ // room_id, tree_id 새로운 node는 클라에서 id -1이라는 정보가 오며, 안에 내용은 없음. db에 새로운 튜플 생성 요청
        //DB한테 새로운 block추가 요청
        order = getOrder(data.tree); // 여기서 client로부터 order 가져오고
        room_id = data.room_id;
        //room_id=5
        tree_id = data.tree_id;
       newApple(room_id, tree_id, "newNode", "NULL", "addNode"); // 새로운 노드를 만든다. -> 여기서 apple 신호를 보냄. 다 만들면!
        let r_info = "R"+room_id+"_order"; // 이거는 order 값 저장하기 위한 거. 순서 상관 없음.

        sub.on('message', function(channel, message) {
            message = JSON.parse(message);
            let ORDER = order;
            let tree = {};
            if (message.room_id === data.room_id && channel == "merry" && message.type === "apple" && message.sock_msg === "addNode") { // && message.newid === hmget-1 필요하면 넣기 
                // 새로운 노드의 아이디를 받아온다
                let newnode_id = message.newid;
                //console.log("Newnode_id",newnode_id, ",", data.channel, ",", socket.id);

                if (newnode_id > 1) { // 초기 노드가 0,1이니까 그게 아니라면~
                    for(var i=0, elem; elem=order[i]; i++){ // 새로운 Order에 있는 원소를 하나씩 보면서 ( -1이 들어가있음 )
                        if (elem === "-1") {
                            //console.log("found -1 and change to ", newnode_id, data.channel, ",", socket.id)
                            ORDER.splice(i,1,newnode_id);
                            elem = newnode_id;
                        }
                        info_l = "R" + room_id+"-"+elem; // 원소 정보 받아오기 위한 것
                        r_cli.HMGET(info_l, "node_id","room_id", "tree_id", "title", "parent", "color", "weight", "deco", (err, obj) => {
                            var treeeeee = {"room_id" : obj[1], "node_id" : obj[0], "tree_id" : obj[2], "title" : obj[3], "parent": obj[4], "color" : obj[5], "weight" : obj[6], "deco" : obj[7]};
                            tree[obj[0]] = treeeeee; // 원소를 받아와서 tree{} 에 저장하고
                            let dic = {}; // 이거는 publish 위한 것
                            // console.log(">dic<",obj[0], tree);
                            dic["room_id"] = room_id;
                            dic["type"] = "a_node"; 
                            dic["tdata"] = tree;
                            dic["order"] = ORDER;
                            dic["len"] = Object.keys(tree).length;
                            dic = JSON.stringify(dic);
                            pub.publish("christ", dic); // publish에 a_node, 방금 받아온 노드 번호를 담아서 보낸다.!
                        });
                    }
                }
            }
        })
            


        sub.on("message", (channel, message) => { // 이거는 tree 정보를 다 받아오고나서 실행된다. treedata를 client 전용으로 재배열
            message = JSON.parse(message);
            //console.log("a_node subscribe", message)

            if (message.room_id === data.room_id && channel === "christ" && message.type === "a_node" && message.len === message.order.length){
                tree = message.tdata;
                order = message.order;
                // console.log("-----------------order", order);
                // lc_Ten
                let tree_keys = Object.keys(tree)
                let before_tree="\n"
                for(var k=0, tree_node; tree_node=tree[tree_keys[k]];k++){
                    before_tree+="be_nodeid: "+tree_node.node_id+" be_treeid: "+tree_node.tree_id+"\n"
                }
                //console.log(">>a_node>>>>>>>>>>?>>>before>>>>", before_tree)
                tree = rearrange(tree, order);
                let after_tree="\n"
                for(var k=0, tree_node ; tree_node = tree[k]; k++){
                    after_tree+="nodeid: "+tree_node.node_id+" treeid: "+tree_node.tree_id+"\n"
                }
                

                // order DB update
                let storder = "["+order.map(i=>parseInt(i)).toString()+"]";
                // a=['0','1','2']
                // b=a.map(i=>parseInt(i)).toString()
                // b="[0,1,2]"

                r_cli.hmset(r_info, tree_id, storder); 
                // console.log("a_node before sendTree, treeid :",tree_id, "tree :",tree);
                // socket emit
                board_server.to(data.channel).emit('sendTree', {sunny: data.channel, treeid: tree_id, tree:tree});            
            }
        })

 

        //   datatree = datatree.map(cur => cur.node_id==='-1' ? {...cur, node_id: String(newnode_id)} : cur);
      
    });


    socket.on('deleteNode', function(data){
        //DB2로부터 order_db 받아옴, 삭제 node id:data.node_id
        rid = data.room_id;
        tid = data.tree_id;
        nid = data.node_id;
        let tree = {};

        get_order(rid, tid); 
        post_order = getOrder(data.tree);

        sub.on("message", (channel, message) => {
            if (channel === "christ") {
                message = JSON.parse(message);
                if (message.room_id === data.room_id && message.type === "gord" && message.tree_id === tid) {
                    let prev_order = message.order;
                    console.log("prev_order", prev_order);

                    dellist = prev_order.reduce((sequence, cur) => { //db의 order와 client의 order 비교 후 삭제 된 node들 추출
                        if(!post_order.includes(cur))
                            sequence.push(cur)
                        return sequence;
                    }, []); // dellist에 삭제되어야하는 애들 다 들어있음

                    // delete Block
                    for (var i,elem; elem = dellist[i]; i++) {
                        var target = "R" + rid + "-" + elem;
                        r_cli.del(target);
                        r_cli.hincrby("NID", rid, -1)
                    }

                    // db update
                    let info = "R"+rid+"_order" ;
                    let strorder = "["+post_order.map(i=>parseInt(i)).toString()+"]";

                    r_cli.hmset(info, tid, strorder);

                    // tree data 받아와야 함 
                    for (var i = 0, elem; elem = post_order[i]; i++) {
                        var n_info = "R"+rid+"-"+elem;
                        r_cli.HMGET(n_info, "node_id","room_id", "tree_id", "title", "parent", "color", "weight", "deco", (err, obj) => {
                            var treeeeee = {"room_id" : obj[1], "node_id" : obj[0], "tree_id" : obj[2], "title" : obj[3], "parent": obj[4], "color" : obj[5], "weight" : obj[6], "deco" : obj[7]};
                            tree[obj[0]] = treeeeee;
                            let dic = {};
                            dic["room_id"] = rid;
                            dic["type"] = "rmNode";
                            dic["n_id"] = obj[0];
                            dic["treedata"] = tree;
                            dic["order"] = post_order;
                            dic = JSON.stringify(dic);
                            pub.publish("merry", dic);
                        })
                    }

                    sub.on('message', (channel, message) => {
                        if (channel === "merry") {
                            let msg = JSON.parse(message);
                            if (msg.room_id === data.room_id && msg.type === "rmNode" && msg.n_id === post_order[post_order.length-1]) {
                                tree = msg.treedata;
                                retree = rearrange(tree, msg.order);
                                // console.log("Delete Node sendTree, treeid :",tid, "tree:", retree);
                                board_server.to(data.channel).emit('sendTree',{sunny: data.channel, 'treeid': tid, 'tree' : retree});
                            }
                        }
                    })
                }
            }
        })
    });


    socket.on('sunsApple', function(data){ // 클라에서 sunsapple의 node_id는 -1로 전달
        //db1로 sunsApple node의 정보들 전달 -o , flatdata로부터 order 추출, db1로부터 sunsapple id 얻음(apple_id) -o
        // console.log(">>>>>>>>>>>>>>>>>>>>>>>data", data);
        rid = data.room_id;
        tid = data.tree_id;
        txt = data.node_title;
        par = data.node_parent;

        let tree = {};
        newApple(rid, tid, txt, par, "sunsapple"); // 먼저 새로운 노드를 만든다.
        // return으로 새로운 아이디를 보내주고, 트리 아이디도 보내줄 거야.
        // type : apple, newid : newid, treeid : tree_id
        
        let order = getOrder(data.tree);
        
         // 오더를 받아와. 이건 client로부터
        


        sub.on("message", (channel, message) => { // 이거는 tree 정보를 다 받아오고나서 실행된다. treedata를 client 전용으로 재배열
            if (channel === 'merry') {
                message = JSON.parse(message);
                if (message.room_id === data.room_id && message.type === "apple" && message.treeid === tid && message.sock_msg === "sunsapple") {
                    // console.log(" apple done ")
                    let apple_id = message.newid;

                    // let changeParent = data.tree.reduce((nodes, cur) => { // changeParent 해야하는 애들
                    //     if(cur.parent==='-1')
                    //         nodes.push(cur.node_id);
                    // }, []);
                    // order안에 '-1'로 있어서
                    // order[key]=value
                    // order = array != dict
                    // dict문법
                    if (order.indexOf("-1") !== -1) {
                        order[order.indexOf("-1")] = apple_id; // order -1로 되어있는 거 apple_id로 업데이트. apple_id를 미리 받아서 설정해둬야 한다.

                    }
                    // parent update 
                    //console.log("AFTER -1 change", order)

                    // if (changeParent) {
                    //     for (var i = 0, elem; elem = changeParent[i]; i++) {
                    //         editAttr(rid, elem, "parent", apple_id);
                    //     }
                    // }
                    
                    var r_info = "R"+String(rid)+"_order";
                    let storder = "["+order.map(i=>parseInt(i)).toString()+"]";
                    
                    
                    r_cli.hmset(r_info, tid, storder);
                
                    

                    for (var i = 0, ele; ele = order[i]; i++) {
                        var info = "R"+rid+"-"+ele;
                        r_cli.HMGET(info, "node_id","room_id", "tree_id", "title", "parent", "color", "weight", "deco", (err, obj) => {
                            var treeeeee = {"room_id" : obj[1], "node_id" : obj[0], "tree_id" : obj[2], "title" : obj[3], "parent": obj[4], "color" : obj[5], "weight" : obj[6], "deco" : obj[7]};
                            tree[obj[0]] = treeeeee;
                            let dic = {};
                            dic["room_id"] = rid;
                            dic["type"] = "sapple";
                            dic["content"] = obj[0];
                            dic["treedata"] = tree;
                            dic["order"] = order;
                            dic["len"] = Object.keys(tree).length;
                            dic = JSON.stringify(dic);
                            pub.publish("christ", dic);
                            
                        })
                    }
                            
                        
                    
                    
                }
            }
        })

        sub.on("message", (channel, message) => { // 이거는 tree 정보를 다 받아오고나서 실행된다. treedata를 client 전용으로 재배열
            message = JSON.parse(message);
            if (message.room_id === data.room_id && channel === "christ" && message.type === "sapple" && message.len === message.order.length){
                tree = message.treedata;
                order = message.order;
                // console.log("-----------------order", order);
                let tree_keys = Object.keys(tree)
                let before_tree="\n"
                for(var k=0, tree_node; tree_node=tree[tree_keys[k]];k++){
                    before_tree+="nodeid: "+tree_node.node_id+" treeid: "+tree_node.tree_id+"\n"
                }
                //console.log(">>sunsapple>>>>>>>>>>>>>before>>>>", before_tree)
                tree = rearrange(tree, order);
                let after_tree="\n"
                for(var k=0, tree_node ; tree_node = tree[k]; k++){
                    after_tree+="nodeid: "+tree_node.node_id+" treeid: "+tree_node.tree_id+"\n"
                }
            

                // order DB update
                // let storder = "["+order.map(i=>parseInt(i)).toString()+"]";
                // a=['0','1','2']
                // b=a.map(i=>parseInt(i)).toString()
                // b="[0,1,2]"
                // console.log("before sunsapple sendTree, treeid", tid, "tree", tree);
                board_server.to(data.channel).emit('sendTree', {sunny: data.channel, treeid: tid, tree:tree});        
            }
        })


    });

    socket.on('changeText', function(data) {
        //DB한테 data.text, data.tree_id, data.node_id 보냄 -o
        let rid = data.room_id;
        let nid = data.node_id;
        let tid = data.tree_id;
        editAttr(rid, nid, "title", data.text, "changeText");
        

        sub.on("message", (channel, message)=>{
            if (channel === "mas") {
                message = JSON.parse(message);
                if (message.room_id === data.room_id && message.type == "edt", message.sock_msg === "changeText" && message.node_id === nid) {
                    let n_info = "R"+rid+"-"+nid;
                    r_cli.HMGET(n_info, "node_id","room_id", "tree_id", "title", "parent", "color", "weight", "deco", (err, obj) => {
                        var nodee = {"room_id" : obj[1], "node_id" : obj[0], "tree_id" : obj[2], "title" : obj[3], "parent": obj[4], "color" : obj[5], "weight" : obj[6], "deco" : obj[7]};
                        let dic = {};
                        dic["room_id"] = rid;
                        dic["type"] = "cText";
                        dic["nid"] = obj[0];
                        dic["nodedata"] = nodee;
                        dic = JSON.stringify(dic);
                        pub.publish("christ", dic);
                    });
                }
            }
        })

        sub.on("message", (channel, message) => {
            if (channel === "christ") {
                message = JSON.parse(message);
                if (message.room_id === data.room_id && message.type === "cText" && message.nid === nid) {
                    let node = message.nodedata;
                    // console.log(">>>>>>before sendNode, treeid", tid, "node", node)
                    board_server.to(data.channel).emit('sendNode', {sunny: data.channel, treeid: tid, node:node});
            
                }
            }
        })
    });



    socket.on('changeAttribute', function(data){
        // 얘네는 sendTree로 변경

        let c_list = data.node_list;
        let rid = data.room_id;

        for (var i=0 , elem; elem = c_list[i]; i++) {
            if(typeof data.deco !== "undefined"){
                editAttr(rid, elem, "deco", data.deco, "changeAttr");
            }
            if(typeof data.color !== "undefined"){
                editAttr(rid, elem, "color", data.color,"changeAttr");
            }
            if(typeof data.weight !== "undefined"){
                editAttr(rid, elem, "weight", data.weight,"changeAttr");
            }
        }

        sub.on("message", (channel, message)=> {
            if (channel === "mas") {
                message = JSON.parse(message);
                if (message.room_id === data.room_id && message.type === "edt" && message.sock_msg === "changeAttr") {
                    let nn = message.node_id;
                    let n_inf = "R" + rid + "-" + nn ;
                    r_cli.HMGET(n_inf, "node_id","room_id", "tree_id", "title", "parent", "color", "weight", "deco", (err, obj) => {
                        var node = {"room_id" : obj[1], "node_id" : obj[0], "tree_id" : obj[2], "title" : obj[3], "parent": obj[4], "color" : obj[5], "weight" : obj[6], "deco" : obj[7]};
                        //console.log(">>>>>>>>>>>before sendNode, treeid", node.tree_id, "node", node);
                        board_server.to(data.channel).emit('sendNode', {sunny: data.channel, treeid: node.tree_id, "node":node});
                    });
                }
            }
        })

        
    });



    socket.on('changeTree', function(data){
        //DB로부터 새로운 tree 요청 data.tree_id
        let tid = data.tree_id;
        let rid = data.room_id;
        let tree = {}
        get_order(rid, tid);
        
        sub.on('message', (channel, message) => {
            if (channel === "christ") {
                let msg = JSON.parse(message);

                if (msg.room_id === data.room_id && msg.tree_id === tid && msg.type === "gord") {
                    // console.log(">>>>>>>>>>>>>>>>>>>>>CHRIST GORD, msg : ", msg);
                    order = msg.order; 
                    for (var i = 0, elem; elem = order[i]; i++) {
                        var info = "R"+rid+"-"+elem;
                        r_cli.HMGET(info, "node_id","room_id", "tree_id", "title", "parent", "color", "weight", "deco", (err, obj) => {
                            var treeeeee = {"room_id" : obj[1], "node_id" : obj[0], "tree_id" : obj[2], "title" : obj[3], "parent": obj[4], "color" : obj[5], "weight" : obj[6], "deco" : obj[7]};
                            tree[obj[0]] = treeeeee;
                            let dic = {};
                            dic["type"] = "cTree";
                            dic["room_id"] = rid;
                            dic["content"] = obj[0];
                            dic["treedata"] = tree;
                            dic["order"] = order;
                            dic["len"] = Object.keys(tree).length;
                            dic = JSON.stringify(dic);
                            pub.publish("merry", dic);
                            
                        })
                    }
                }
            }
        });

        sub.on('message', (channel, message)=> {
            if (channel === "merry") {
                let msg = JSON.parse(message);
                if (msg.room_id === data.room_id && msg.type === "cTree" && msg.order.length === msg.len){
                    ///////////선위 고쳐야함 2번 실행됌
                    tree = msg.treedata;
                    order = msg.order;
                    // console.log(">>>>>>>>order", order)
                    //console.log(">>>>>before tree", tree);
                    tree = rearrange(tree, order);
                    //console.log(">>>>>>>>after tree", tree)
                    board_server.to(socket.id).emit('changeTree', {treeid: (tree[0].tree_id), tree:tree});

                }
            }
        })
    });

    socket.on('migrateNode', function(data){
        //data.origin_tree -> data.target_tree, order
        //옮긴 후의 flatdata 온다
        console.log("migratenode됨", data.tree)
        let rid = data.room_id;
        let origin_tid = data.origin_tree_id;
        let target_tid = data.target_tree_id;
        let origin_order = getOrder(data.origin_tree);
        let target_order = getOrder(data.target_tree);
        let node_id = data.node_id;

        let parent = data.node_parent; // 옮겨갈 곳의 parent

        let originTree = {};
        let targetTree = {};


        let delList = delNode(data.target_tree, node_id); //delList : tree만 바꾸면 되는 애들
        editAttr(rid, node_id, "parent", String(parent), "migrate_p", delList);
        for (var j = 0, elem; elem = delList[j] ;j++) {
            editAttr(data.room_id, elem, "tree_id", String(target_tid), "migrate_t", delList);
        }

        let r_info = "R" + rid + "_order"

        let str_o_order = "["+origin_order.map(i=>parseInt(i)).toString()+"]";
        let str_t_order = "["+target_order.map(i=>parseInt(i)).toString()+"]";

        r_cli.hmset(r_info, origin_tid, str_o_order);
        r_cli.hmset(r_info, target_tid, str_t_order);

        //수정 완료
        sub.on("message", (channel, message)=> {
            if (channel === "mas") {
                message = JSON.parse(message);
                if (message.room_id === data.room_id && message.type === "edt" && message.sock_msg === "migrate_t" && message.node_id === message.order[message.order.length-1]) {

                    for (var i = 0, elem; elem = origin_order[i]; i++) {
                        var n_info = "R"+rid+"-"+elem;
                        r_cli.HMGET(n_info, "node_id","room_id", "tree_id", "title", "parent", "color", "weight", "deco", (err, obj) => {
                            var treeeeee = {"room_id" : obj[1], "node_id" : obj[0], "tree_id" : obj[2], "title" : obj[3], "parent": obj[4], "color" : obj[5], "weight" : obj[6], "deco" : obj[7]};
                            originTree[obj[0]] = treeeeee;
                            let dic = {};
                            dic["type"] = "origin";
                            dic["room_id"] = rid;
                            dic["n_id"] = obj[0];
                            dic["treedata"] = originTree;
                            dic["order"] = origin_order;
                            dic = JSON.stringify(dic);
                            pub.publish("merry", dic);
                        })
                    }

                    for (var i = 0, elem; elem = target_order[i]; i++) {
                        var n_info = "R"+rid+"-"+elem;
                        r_cli.HMGET(n_info, "node_id","room_id", "tree_id", "title", "parent", "color", "weight", "deco", (err, obj) => {
                            var treeeeee = {"room_id" : obj[1], "node_id" : obj[0], "tree_id" : obj[2], "title" : obj[3], "parent": obj[4], "color" : obj[5], "weight" : obj[6], "deco" : obj[7]};
                            targetTree[obj[0]] = treeeeee;
                            let dic = {};
                            dic["type"] = "target";
                            dic["room_id"] = rid;
                            dic["n_id"] = obj[0];
                            dic["treedata"] = targetTree;
                            dic["order"] = target_order;
                            dic = JSON.stringify(dic);
                            pub.publish("christ", dic);
                        })
                    }
                    
                    sub.on("message", (channel, message) => {
                        if (channel === "merry") {
                            let msg1 = JSON.parse(message);
                            if (msg1.room_id === data.room_id && msg1.type === "origin" && msg1.n_id === msg1.order[msg1.order.length-1]){
                                let tree1 = msg1.treedata;
                                let order1 = msg1.order;
                                let reTree = rearrange(tree1, order1);
                                //console.log("migrate 왼쪽 emit됨", reTree)
                                board_server.to(data.channel).emit('sendTree', {sunny: data.channel, treeid: origin_tid, tree:reTree});
                                
                            }
                        }
                        if (channel === "christ" ) {
                            let msg2 = JSON.parse(message);
                            if (msg2.room_id === data.room_id && msg2.type === "target" && msg2.n_id === msg2.order[msg2.order.length-1]) {
                                let tree2 = msg2.treedata;
                                let order2 = msg2.order;
                                let reTree2 = rearrange(tree2, order2);
                                //console.log("migrate 올쪽 emit됨", reTree2)
                                board_server.to(data.channel).emit('sendTree', {sunny: data.channel,treeid: target_tid, tree:reTree2});
                                
                            }
                        }
                    })

                }
            }
        })

        
    });
    
    socket.on('moveNode', function(data){ //같은 트리 안에서의 이동
        console.log("movenode됨", data.tree)
        let order = getOrder(data.tree);
        let nid = data.node_id;
        let tid = data.tree_id;
        let rid = data.room_id;
        let parent = data.node_parent;
        let tree = {};
        

        // order 업데이트, parent 업데이트
        let r_info = "R"+rid+"_order";
        let n_info = "R"+rid+"-"+nid;
        let strorder = "["+order.map(i=>parseInt(i)).toString()+"]";
        r_cli.hmset(r_info, tid, strorder);
        r_cli.hmset(n_info, "parent", parent);

        // tree data 받아오는 과정
        for (var i = 0, elem; elem = order[i]; i++) {
            var info = "R"+rid+"-"+elem;
            r_cli.HMGET(info, "node_id","room_id", "tree_id", "title", "parent", "color", "weight", "deco", (err, obj) => {
                var treeeeee = {"room_id" : obj[1], "node_id" : obj[0], "tree_id" : obj[2], "title" : obj[3], "parent": obj[4], "color" : obj[5], "weight" : obj[6], "deco" : obj[7]};
                tree[obj[0]] = treeeeee;
                let dic = {};
                dic["room_id"] = rid;
                dic["type"] = "mNode";
                dic["n_id"] = obj[0];
                dic["treedata"] = tree;
                dic["order"] = order;
                dic = JSON.stringify(dic);
                pub.publish("christ", dic);
            })
        }

        sub.on('message', (channel, message) => {
            if (channel === "christ") {
                let msg = JSON.parse(message);
                if (msg.room_id === data.room_id && msg.type === "mNode" && msg.n_id === msg.order[msg.order.length-1]) {
                    tree = msg.treedata;
                    console.log("전전",Object.keys(tree),",",msg.n_id,",",msg.order)
                    order = msg.order;
                    console.log("무브노드전",Object.keys(tree),",",msg.n_id,",",order)
                    retree = rearrange(tree, order);
                    // console.log("before sendTree, treeid :",tid, "tree:", retree);
                    console.log("movenode emit됨", retree)
                    board_server.to(data.channel).emit('sendTree',{sunny: data.channel, 'treeid': data.tree_id, 'tree' : retree});
                }
            }
        })
        // let parent = data.tree.filter(i => i.node_id===node_id)[0].parent;
        //db1의 datas의 parent들 업뎃
        //editAttr(data.room_id, data.node_id, "parent", String(parent));
 
    });
});



channel_server.on('connection', function(socket) {
    client_id = socket.id;
    socket.on('createChannel', function (data, callback) {    
        let code = ''
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        Array.from(Array(5)).forEach(() => {
        code += possible.charAt(Math.floor(Math.random() * possible.length))
        });
        var room_id;

        // r_cli.get("Rnum", (err, obj) => {
        //     console.log("say 123", obj);
        // })
        r_cli.get("Rnum", (err, obj) => { //일단 방 갯수를 알아와서
            room_id = obj; //room _id를 설정하고
            r_cli.hmset("RCode", code, String(room_id)); //room code - room id 설정,
            r_cli.hmset("RName", room_id, data.channel); //room id - room name 설정
            r_cli.hmset("Tnum", room_id, 0);
            
            r_cli.hmset("Nnum", room_id, 0);
            r_cli.hmset("NID", room_id, 0);
            
            r_cli.incr("Rnum"); // 방 갯수 하나 ++
            var i=0;

            var treeId=[]; // 방에 만들 트리 id를 담는 변수. 처음에는 0이 있는 게 맞음
            console.log("roomid", room_id);
            

            r_cli.hmget("Tnum", room_id, (err, obj) => { //방에 있는 트리 개수를 받아옴. 0이 있겠지
                if(err){
                    console.log("hmget ERROR", err)
                }
                treeId = obj[0];
                // 승연 여기임

                newApple(room_id, treeId, "Left Initial Block", "NULL", "createChannel"); //트리에 들어갈 블록을 만든다
                
                
                sub.on('message', (channel, message) => {
                    let msg = JSON.parse(message);
                    if (msg.room_id === room_id && msg.type === "apple" && msg.sock_msg === "createChannel" &&  msg.treeid === '0'){
                        let ord = "["+msg.newid+"]"
                        update_order(room_id, msg.treeid,ord );
                        
                        console.log("0번 트리 increase")
                        r_cli.HINCRBY("Tnum", room_id, 1);

                        // treenum = 1

                        // 두 번째 트리를 만들기 위한 과정
                        r_cli.hmget("Tnum", room_id, (err, obj) => {
                            if(err){
                                console.log("hmget2 ERROR", err)
                            }
                            treeId = obj[0];
                            console.log("real for real?",treeId)
                            newApple(room_id, treeId, "Right Initial Block", "NULL", "createChannel");
                        
                        
                        })
                    }
                }) 
                sub.on('message', (channel, message) => {
                                
                    let msg2 = JSON.parse(message);
                    if (msg2.room_id === room_id && msg2.type === "apple" && msg2.sock_msg === "createChannel"  && msg2.treeid === '1'){
                        
                        let ord2 = "["+msg2.newid+"]"

                        update_order(room_id, msg2.treeid, ord2);
                        
                        // treenum = 2
                        // 2

                        console.log("1번 트리 increase.")
                        // r_cli.HINCRBY("Tnum", room_id, 1);
                        r_cli.hmset("Tnum",room_id,2)
                        
                        console.log("channel create", code, room_id, data.channel)
                        // treenum = 3
                        callback(code, room_id,data.channel);
                        channel_names[code] = data.channel;
                        
                        
                    }
                })    
                    
                              
            })         
        });
        
    });

    socket.on('joinChannel', function(data, callback) {
        var RID; // Room_id
        var RNAME;
        r_cli.hmget("RCode", String(data.channel_code), (err, obj) => {
            RID = obj; // ROOM_ID 가 저장되어있음
            console.log("RID", RID)
            r_cli.hmget("RName", RID[0], (err,obj) => {
                RNAME = obj;
                console.log("channel join",data.channel_code, RID[0],RNAME[0])
                callback(data.channel_code, RID[0],RNAME[0]);
            });        
        })
    });
})

http.listen(4002, function(){
    console.log('listening on *:4002');
});

function delNode(tree, node_id) { // 지우는 노드 id들 return
    let deletenodes = [node_id];
    for(let i=0; i<tree.length; i++) {
      if(deletenodes.includes(tree[i].parent)) 
        deletenodes.push(tree[i].node_id);
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
        sequence.push(cur.node_id);
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
