const express = require('express');
const { title } = require('process');
const { stringify } = require('querystring');
const { ToastBody } = require('react-bootstrap');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.use('/', express.static(__dirname + '/build'));
// // console.log(__dirname)

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
    // // console.log("ERROR"+err);
    process.exit(1);
});


// sample
// r_cli.hmset("R0_order", 0, "0,2", 1, "1");
// r_cli.hmset("R0-0", "room_id", 0, "tree_id", 0, "node_id", 0, "title", "0-0", "parent", "NULL", "color", "blue", "deco", "normal", "weight", "normal");

// default
r_cli.set("Rnum", 0) // room 媛쒖닔    
r_cli.hmset("Tnum", 0, 0);
r_cli.hmset("Nnum", 0, 0)
// r_cli.hmset("TID", 0, 0); // room蹂꾨줈 tree id  꾩쟻. room_id : tree_num
r_cli.hmset("NID", 0, 0); // room蹂꾨줈 node id  꾩쟻. room_id : node_num
r_cli.hmset("RCode","zxcvbnm", 999);
r_cli.hmset("RName",999,'cocococococo');


// tree  뺣낫   Key   R0-0  대윴 앹쑝濡 ,  대떦 value   hash  뺥깭濡    ν븳  
function get_order(room_id, tree_id, sock_msg) {
    var r_info = "R" + String(room_id)+"_order";
    if (r_cli.EXISTS(r_info) == 0) {
        // // console.log("room does not exist")
        return null;
    }
    else {
        var order;       
        r_cli.hmget(r_info, tree_id, (err,obj) => {
            order = obj[0].split(",");
            order[0] = order[0].substring(1, order[0].length)
            let leng = order.length
            order[leng-1] = order[leng-1].substring(0,order[leng-1].length-1)
            let dic = {}
            dic['room_id'] = room_id;
            dic['tree_id'] = tree_id;
            dic['order'] = order;
            dic['type']="gord";
            dic['sock_msg'] = sock_msg;
            dic = JSON.stringify(dic);

            pub.publish("christ", dic);
        });
    }
}

function update_order(room_id, tree_id, order) {
    var r_info = "R" + String(room_id)+"_order";
    //// console.log("before order DB", "room_num", r_info, "tree_id", tree_id, "order", order)
    if (r_cli.HEXISTS(r_info, tree_id) == 0) {
        // // console.log("In R-",room_id, "tree",tree_id, "does not exist")
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
    var newid;// = [999];
    r_cli.hmget("NID", room_id, (err, obj) => {
        if (err) {
            // // console.log("newApple err",err)
        }   
        // obj   吏湲  留뚮뱾 댁빞    Node id媛  닿꺼 덉쓬.
        //newid = newid.concat(obj);
        newid=obj[0];
        var info = "R"+room_id+"-"+obj;
        
        r_cli.hmset(String(info), "room_id", String(room_id), "tree_id", String(tree_id), "node_id", String(obj), "title", text , "parent", String(parent), "color", "#848993", "deco", "none", "weight", "normal");
        r_cli.HINCRBY("NID", room_id, 1); // 대떦 room_num   node 媛쒖닔 +1
        r_cli.HINCRBY("Nnum", room_id, 1);
        let msg = {"type" : "apple", "room_id" : room_id, "newid" : newid, "treeid" : tree_id, "sock_msg" : sock_msg};
        msg = JSON.stringify(msg);

        pub.publish("merry", msg);

    });
    return true;
    
}
// new block  new apple   text, parent 吏 뺥빐    ъ슜 섎㈃  쒕떎.

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
        // // console.log(target, "does not exist")
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
        // console.log("梨꾪똿諛⑹엯  ");
        let dataAddinfo={uname:data.uname, msg:data.uname+" 님이 "+data.channel+"에 입장하셨습니다..", date:Date.now()};
        chat_server.to(data.channel).emit('receive', {chat:dataAddinfo});
    });
    socket.on('send', function (data) {
        //// console.log("send: "+data.msg);
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
        
        // console.log("蹂대뱶諛⑹엯  ");
        //DB 쒗뀒  몃━ 0, 1  붿껌 -o
        //DB 쒗뀒  몃━ 媛쒖닔  붿껌 -o
        let treeLeft = {};
        let treeRight = {};
        let orderLeft, orderRight;
        let treenum;

        let room_id = data.room_id;
        let r_info = "R"+room_id+"_order";
        if (r_cli.EXISTS(r_info) == 0) {
            // console.log("room does not exist")
        }
        else {
            r_cli.hmget(r_info, 0, 1, (err, obj) => {
                orderLeft = obj[0];

                orderLeft = orderLeft.split(",");
                orderLeft[0] = orderLeft[0].substring(1, orderLeft[0].length);
                let leng = orderLeft.length;
                orderLeft[leng-1] = orderLeft[leng-1].substring(0,orderLeft[leng-1].length-1);
                

                orderRight = obj[1];
                orderRight = orderRight.split(",");
                orderRight[0] = orderRight[0].substring(1, orderRight[0].length);
                let leng2 = orderRight.length;
                orderRight[leng2-1] = orderRight[leng2-1].substring(0,orderRight[leng2-1].length-1);

                r_cli.hmget("Tnum", room_id, (err,obj) => {
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
                                board_server.to(data.channel).emit('sendTree', {sunny: data.channel, treenum:"2", treeid: "0", tree:treeLeft});

                            }
                            if (message.room_id === room_id && channel === "merry" && message.content === message.order[message.order.length-1]){
                                treeRight = rearrange(message.treedata, orderRight);
                                board_server.to(data.channel).emit('sendTree', {sunny: data.channel, treenum:"2", treeid: "1", tree:treeRight});
                                
                            }
                        }
                    })
                });
            })
        }

    });

    socket.on('channelLeave', function(data){
        socket.leave(data.channel);
        // console.log(data.channel);
    });
    socket.on('download', function(data){
        get_order(data.room_id, data.tree_id, "download");
        sub.on("message", (channel, message) => {
            if (channel === "christ") {
                message = JSON.parse(message);
                let tree = {};
                if (message.room_id === data.room_id && message.sock_msg === "download" && message.type === "gord" && message.tree_id === data.tree_id) {
                    let Order = message.order;
                    let rid = message.room_id;
                    for (var i = 0, elem; elem = Order[i]; i++) {
                        var info = "R"+rid+"-"+elem;
                        r_cli.HMGET(info, "node_id","room_id", "tree_id", "title", "parent", "color", "weight", "deco", (err, obj) => {
                            var treeeeee = {"room_id" : obj[1], "node_id" : obj[0], "tree_id" : obj[2], "title" : obj[3], "parent": obj[4], "color" : obj[5], "weight" : obj[6], "deco" : obj[7]};
                            tree[obj[0]] = treeeeee;
                            let dic = {};
                            dic["type"] = "download"
                            dic["tree_id"] = obj[2];
                            dic["room_id"] = obj[1];
                            dic["node_id"] = obj[0];
                            dic["treedata"] = tree;
                            dic["order"] = Order;
                            dic = JSON.stringify(dic);
                            pub.publish("merry", dic);
                            
                        })
                    }
            
                }
            }
        })
        
        sub.on("message", (channel, message) => {
            if (channel === "merry") {
                message = JSON.parse(message);
                if (message.room_id === data.room_id && message.type === "download" && message.tree_id === data.tree_id && message.node_id === message.order[message.order.length - 1]) {
                    let TREE = message.treedata;
                    let ORDER = message.order;

                    let RETREE = rearrange(TREE, ORDER);
                    board_server.to(data.channel).emit('download', {sunny: data.channel, treeid : message.tree_id, tree: RETREE});
                }
            }
        })
        


        

    })
    socket.on('addTree', function(data){ 
        let treenum, treeid;
        let room_id = data.room_id;
        r_cli.hmget("Tnum", room_id, (err, obj) => {
            treeid = obj[0];
            // console.log("treeid", treeid)
            let cc = "Tree: "+treeid+" New Block"
            newApple(room_id, treeid, cc, "NULL", "addTree"); //  덈줈    몃뱶 留뚮벀.  좏샇 蹂대깉  .
            /// new apple   id瑜  諛쏆븘   order瑜  留뚮뱾怨 , db    낅뜲 댄듃  댁빞  
            
            sub.on("message", (channel, message) => { //  닿굅   tree  뺣낫瑜     諛쏆븘 ㅺ퀬 섏꽌  ㅽ뻾 쒕떎. treedata瑜  client  꾩슜 쇰줈  щ같  
                if (channel === 'merry') {
                    message = JSON.parse(message);
                    if (message.room_id === data.room_id && message.type === "apple" && message.treeid === treeid && message.sock_msg === "addTree") {
                        let newid = message.newid;
        
                        order = "["+newid+"]";
                        let r_info = "R"+data.room_id+"_order";
                        r_cli.hmset(r_info, treeid, order); 
                        //  대뼸寃  order  뺥깭瑜  留뚮뱺  ㅼ쓬   update
                    }
                }
            })
            //r_cli.HINCRBY("TID", room_id, 1);
            r_cli.HINCRBY("Tnum", room_id, 1);
            r_cli.hmget("Tnum", room_id, (err, obj) => {
                treenum = obj;
                board_server.to(data.channel).emit('addTree', {treeid: treeid[0], treenum: treenum[0]});
            })
        })

        
    });


    socket.on('addNode', function(data){ // room_id, tree_id  덈줈   node    대씪 먯꽌 id -1 대씪    뺣낫媛  ㅻŉ,  덉뿉  댁슜   놁쓬. db    덈줈    쒗뵆  앹꽦  붿껌
        //DB 쒗뀒  덈줈   block異붽   붿껌
        order = getOrder(data.tree); //  ш린   client濡쒕    order 媛 몄삤怨 
        room_id = data.room_id;
        //room_id=5
        tree_id = data.tree_id;
       newApple(room_id, tree_id, "newNode", "NULL", "addNode"); //  덈줈    몃뱶瑜  留뚮뱺  . ->  ш린   apple  좏샇瑜  蹂대깂.    留뚮뱾硫 !
        let r_info = "R"+room_id+"_order"; //  닿굅   order 媛    ν븯湲   꾪븳 嫄 .  쒖꽌  곴   놁쓬.

        sub.on('message', function(channel, message) {
            message = JSON.parse(message);
            let ORDER = order;
            let tree = {};
            if (message.room_id === data.room_id && channel == "merry" && message.type === "apple" && message.sock_msg === "addNode") { // && message.newid === hmget-1  꾩슂 섎㈃  ｊ린 
                //  덈줈    몃뱶    꾩씠 붾  諛쏆븘 ⑤떎
                let newnode_id = message.newid;
                
                if (newnode_id > 1) { // 珥덇린  몃뱶媛 0,1 대땲源  洹멸쾶  꾨땲 쇰㈃~
                    for(var i=0, elem; elem=order[i]; i++){ //  덈줈   Order    덈뒗  먯냼瑜   섎굹   蹂대㈃   ( -1    ㅼ뼱媛 덉쓬 )
                        if (elem === "-1") {
                            ORDER.splice(i,1,newnode_id);
                            elem = newnode_id;
                        }
                        info_l = "R" + room_id+"-"+elem; //  먯냼  뺣낫 諛쏆븘 ㅺ린  꾪븳 寃 
                        r_cli.HMGET(info_l, "node_id","room_id", "tree_id", "title", "parent", "color", "weight", "deco", (err, obj) => {
                            var treeeeee = {"room_id" : obj[1], "node_id" : obj[0], "tree_id" : obj[2], "title" : obj[3], "parent": obj[4], "color" : obj[5], "weight" : obj[6], "deco" : obj[7]};
                            tree[obj[0]] = treeeeee; //  먯냼瑜  諛쏆븘    tree{}      ν븯怨 
                            let dic = {}; //  닿굅   publish  꾪븳 寃 
                            dic["room_id"] = room_id;
                            dic["type"] = "a_node"; 
                            dic["tdata"] = tree;
                            dic["order"] = ORDER;
                            dic["len"] = Object.keys(tree).length;
                            dic = JSON.stringify(dic);
                            pub.publish("christ", dic); // publish   a_node, 諛⑷툑 諛쏆븘    몃뱶 踰덊샇瑜   댁븘   蹂대궦  .!
                        });
                    }
                }
            }
        })
            


        sub.on("message", (channel, message) => { //  닿굅   tree  뺣낫瑜     諛쏆븘 ㅺ퀬 섏꽌  ㅽ뻾 쒕떎. treedata瑜  client  꾩슜 쇰줈  щ같  
            message = JSON.parse(message);
            
            if (message.room_id === data.room_id && channel === "christ" && message.type === "a_node" && message.len === message.order.length){
                tree = message.tdata;
                order = message.order;
                let tree_keys = Object.keys(tree)
                let before_tree="\n"
                for(var k=0, tree_node; tree_node=tree[tree_keys[k]];k++){
                    before_tree+="be_nodeid: "+tree_node.node_id+" be_treeid: "+tree_node.tree_id+"\n"
                }
                tree = rearrange(tree, order);
                let after_tree="\n"
                for(var k=0, tree_node ; tree_node = tree[k]; k++){
                    after_tree+="nodeid: "+tree_node.node_id+" treeid: "+tree_node.tree_id+"\n"
                }
                

                // order DB update
                let storder = "["+order.map(i=>parseInt(i)).toString()+"]";
               
                r_cli.hmset(r_info, tree_id, storder); 
                // socket emit
                board_server.to(data.channel).emit('sendTree', {sunny: data.channel, treeid: tree_id, tree:tree});            
            }
        })

 

        //   datatree = datatree.map(cur => cur.node_id==='-1' ? {...cur, node_id: String(newnode_id)} : cur);
      
    });


    socket.on('deleteNode', function(data){
        //DB2濡쒕    order_db 諛쏆븘  ,   젣 node id:data.node_id
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
                    
                    dellist = prev_order.reduce((sequence, cur) => { //db   order  client   order 鍮꾧탳      젣    node   異붿텧
                        if(!post_order.includes(cur))
                            sequence.push(cur)
                        return sequence;
                    }, []); // dellist     젣 섏뼱 쇳븯    좊뱾     ㅼ뼱 덉쓬

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

                    // tree data 諛쏆븘       
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
                                board_server.to(data.channel).emit('sendTree',{sunny: data.channel, 'treeid': tid, 'tree' : retree});
                            }
                        }
                    })
                }
            }
        })
    });


    socket.on('sunsApple', function(data){ //  대씪 먯꽌 sunsapple   node_id   -1濡   꾨떖
        //db1濡  sunsApple node    뺣낫    꾨떖 -o , flatdata濡쒕    order 異붿텧, db1濡쒕    sunsapple id  살쓬(apple_id) -o
        rid = data.room_id;
        tid = data.tree_id;
        txt = data.node_title;
        par = data.node_parent;

        let tree = {};
        newApple(rid, tid, txt, par, "sunsapple"); // 癒쇱   덈줈    몃뱶瑜  留뚮뱺  .
        // return 쇰줈  덈줈    꾩씠 붾  蹂대궡二쇨퀬,  몃━  꾩씠 붾룄 蹂대궡以  嫄곗빞.
        // type : apple, newid : newid, treeid : tree_id
        
        let order = getOrder(data.tree);
        
         //  ㅻ뜑瑜  諛쏆븘 .  닿굔 client濡쒕   
        
        sub.on("message", (channel, message) => { //  닿굅   tree  뺣낫瑜     諛쏆븘 ㅺ퀬 섏꽌  ㅽ뻾 쒕떎. treedata瑜  client  꾩슜 쇰줈  щ같  
            if (channel === 'merry') {
                message = JSON.parse(message);
                if (message.room_id === data.room_id && message.type === "apple" && message.treeid === tid && message.sock_msg === "sunsapple") {
                    let apple_id = message.newid;
                    if (order.indexOf("-1") !== -1) {
                        order[order.indexOf("-1")] = apple_id; // order -1濡   섏뼱 덈뒗 嫄  apple_id濡   낅뜲 댄듃. apple_id瑜  誘몃━ 諛쏆븘    ㅼ젙 대뫊    쒕떎.

                    }

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

        sub.on("message", (channel, message) => { //  닿굅   tree  뺣낫瑜     諛쏆븘 ㅺ퀬 섏꽌  ㅽ뻾 쒕떎. treedata瑜  client  꾩슜 쇰줈  щ같  
            message = JSON.parse(message);
            if (message.room_id === data.room_id && channel === "christ" && message.type === "sapple" && message.len === message.order.length){
                tree = message.treedata;
                order = message.order;
                let tree_keys = Object.keys(tree)
                let before_tree="\n"
                for(var k=0, tree_node; tree_node=tree[tree_keys[k]];k++){
                    before_tree+="nodeid: "+tree_node.node_id+" treeid: "+tree_node.tree_id+"\n"
                }
                tree = rearrange(tree, order);
                let after_tree="\n"
                for(var k=0, tree_node ; tree_node = tree[k]; k++){
                    after_tree+="nodeid: "+tree_node.node_id+" treeid: "+tree_node.tree_id+"\n"
                }
            
                // order DB update
                board_server.to(data.channel).emit('sendTree', {sunny: data.channel, treeid: tid, tree:tree});        
            }
        })


    });

    socket.on('changeText', function(data) {
        //DB 쒗뀒 data.text, data.tree_id, data.node_id 蹂대깂 -o
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
                    board_server.to(data.channel).emit('sendNode', {sunny: data.channel, treeid: tid, node:node});
                }
            }
        })
    });



    socket.on('changeAttribute', function(data){
        //  섎꽕   sendTree濡  蹂寃 
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
                        board_server.to(data.channel).emit('sendNode', {sunny: data.channel, treeid: node.tree_id, "node":node});
                    });
                }
            }
        })

        
    });



    socket.on('changeTree', function(data){
        //DB濡쒕     덈줈   tree  붿껌 data.tree_id
        let tid = data.tree_id;
        let rid = data.room_id;
        let tree = {}
        //// console.log("changelog  ㅼ뼱  ", tid, ",", rid)
        //// console.log("changelog2", data)
        get_order(rid, tid);
        
        sub.on('message', (channel, message) => {
            if (channel === "christ") {
                let msg = JSON.parse(message);
                //// console.log("log log", tid, ",", msg.tree_id)
                if (msg.room_id === data.room_id && msg.tree_id === tid && msg.type === "gord") {
                    order = msg.order; 
                    //// console.log("log loglog", order)
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
                    tree = msg.treedata;
                    //// console.log(" 꾩쟾泥댄겕", tree)
                    order = msg.order;
                    tree = rearrange(tree, order);
                    //// console.log("泥댁씤吏  꾩껜  ", tree)
                    //// console.log("泥댁씤吏 泥댄겕",data.tree_id, ",", tree[0].tree_id)
                    board_server.to(socket.id).emit('changeTree', {treeid: (tree[0].tree_id), tree:tree});

                }
            }
        })
    });

    socket.on('migrateNode', function(data){
        //data.origin_tree -> data.target_tree, order
        //  릿  꾩쓽 flatdata  ⑤떎
        let rid = data.room_id;
        let origin_tid = data.origin_tree_id;
        let target_tid = data.target_tree_id;
        let origin_order = getOrder(data.origin_tree);
        let target_order = getOrder(data.target_tree);
        let node_id = data.node_id;

        let parent = data.node_parent; //   꺼媛  怨녹쓽 parent

        let originTree = {};
        let targetTree = {};


        let delList = delNode(data.target_tree, node_id); //delList : tree留  諛붽씀硫   섎뒗  좊뱾
        editAttr(rid, node_id, "parent", String(parent), "migrate_p", delList);
        for (var j = 0, elem; elem = delList[j] ;j++) {
            editAttr(data.room_id, elem, "tree_id", String(target_tid), "migrate_t", delList);
        }

        let r_info = "R" + rid + "_order"

        let str_o_order = "["+origin_order.map(i=>parseInt(i)).toString()+"]";
        let str_t_order = "["+target_order.map(i=>parseInt(i)).toString()+"]";

        r_cli.hmset(r_info, origin_tid, str_o_order);
        r_cli.hmset(r_info, target_tid, str_t_order);

        // 섏젙  꾨즺
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
                                board_server.to(data.channel).emit('sendTree', {sunny: data.channel, treeid: origin_tid, tree:reTree});
                            }
                        }
                        if (channel === "christ" ) {
                            let msg2 = JSON.parse(message);
                            if (msg2.room_id === data.room_id && msg2.type === "target" && msg2.n_id === msg2.order[msg2.order.length-1]) {
                                let tree2 = msg2.treedata;
                                let order2 = msg2.order;
                                let reTree2 = rearrange(tree2, order2);
                                board_server.to(data.channel).emit('sendTree', {sunny: data.channel,treeid: target_tid, tree:reTree2});
                            }
                        }
                    })

                }
            }
        })

        
    });
    
    socket.on('moveNode', function(data){ //媛숈   몃━  덉뿉 쒖쓽  대룞
        //// console.log("movenode  ", data.tree)
        let order = getOrder(data.tree);
        let nid = data.node_id;
        let tid = data.tree_id;
        let rid = data.room_id;
        let parent = data.node_parent;
        let tree = {};
        

        // order  낅뜲 댄듃, parent  낅뜲 댄듃
        let r_info = "R"+rid+"_order";
        let n_info = "R"+rid+"-"+nid;
        let strorder = "["+order.map(i=>parseInt(i)).toString()+"]";
        r_cli.hmset(r_info, tid, strorder);
        r_cli.hmset(n_info, "parent", parent);

        // tree data 諛쏆븘 ㅻ뒗 怨쇱젙
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
                    //// console.log(" 꾩쟾",Object.keys(tree),",",msg.n_id,",",msg.order)
                    order = msg.order;
                    //// console.log("臾대툕 몃뱶  ",Object.keys(tree),",",msg.n_id,",",order)
                    retree = rearrange(tree, order);
                    // // console.log("before sendTree, treeid :",tid, "tree:", retree);
                    //// console.log("movenode emit  ", retree)
                    //// console.log(" 좎떆 좎떆",data.tree_id, retree[0].tree_id)
                    board_server.to(data.channel).emit('sendTree',{sunny: data.channel, 'treeid': retree[0].tree_id, 'tree' : retree});
                }
            }
        })
        // let parent = data.tree.filter(i => i.node_id===node_id)[0].parent;
        //db1   datas   parent    낅럠
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
        //     // console.log("say 123", obj);
        // })
        r_cli.get("Rnum", (err, obj) => { // 쇰떒 諛  媛 닔瑜   뚯븘   
            room_id = obj; //room _id瑜   ㅼ젙 섍퀬
            r_cli.hmset("RCode", code, String(room_id)); //room code - room id  ㅼ젙,
            r_cli.hmset("RName", room_id, data.channel); //room id - room name  ㅼ젙
            r_cli.hmset("Tnum", room_id, 0);
            
            r_cli.hmset("Nnum", room_id, 0);
            r_cli.hmset("NID", room_id, 0);
            
            r_cli.incr("Rnum"); // 諛  媛 닔  섎굹 ++
            var i=0;

            var treeId=[]; // 諛⑹뿉 留뚮뱾  몃━ id瑜   대뒗 蹂  . 泥섏쓬 먮뒗 0    덈뒗 寃  留욎쓬
            // console.log("roomid", room_id);
            

            r_cli.hmget("Tnum", room_id, (err, obj) => { //諛⑹뿉  덈뒗  몃━ 媛쒖닔瑜  諛쏆븘  . 0    덇쿋吏
                if(err){
                    // console.log("hmget ERROR", err)
                }
                treeId = obj[0];

                newApple(room_id, treeId, "Left Initial Block", "NULL", "createChannel"); // 몃━    ㅼ뼱媛  釉붾줉   留뚮뱺  
                
                sub.on('message', (channel, message) => {
                    let msg = JSON.parse(message);
                    if (msg.room_id === room_id && msg.type === "apple" && msg.sock_msg === "createChannel" &&  msg.treeid === '0'){
                        let ord = "["+msg.newid+"]"
                        update_order(room_id, msg.treeid,ord );
                        
                        //// console.log("0踰   몃━ increase")
                        r_cli.HINCRBY("Tnum", room_id, 1);

                        // treenum = 1

                        //    踰덉㎏  몃━瑜  留뚮뱾湲   꾪븳 怨쇱젙
                        r_cli.hmget("Tnum", room_id, (err, obj) => {
                            if(err){
                                // console.log("hmget2 ERROR", err)
                            }
                            treeId = obj[0];
                            //// console.log("real for real?",treeId)
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

                        //// console.log("1踰   몃━ increase.")
                        // r_cli.HINCRBY("Tnum", room_id, 1);
                        r_cli.hmset("Tnum",room_id,2)
                        
                        //// console.log("channel create", code, room_id, data.channel)
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
            RID = obj; // ROOM_ID 媛   λ릺 댁엳  
            // console.log("RID", RID)
            r_cli.hmget("RName", RID[0], (err,obj) => {
                RNAME = obj;
                // console.log("channel join",data.channel_code, RID[0],RNAME[0])
                callback(data.channel_code, RID[0],RNAME[0]);
            });        
        })
    });
})

http.listen(4002, function(){
    // console.log('listening on *:4002');
});

function delNode(tree, node_id) { // 吏 곕뒗  몃뱶 id   return
    let deletenodes = [node_id];
    for(let i=0; i<tree.length; i++) {
      if(deletenodes.includes(tree[i].parent)) 
        deletenodes.push(tree[i].node_id);
    }
    return deletenodes;
  }
  
function rearrange(tree, sequence) { // tree ㅼ쓣 sequence  쒖꽌 濡   щ같移섑븳 諛곗뿴   return
    let result = [];
    for(let i=0; i<sequence.length; i++) 
        result.push(tree[String(sequence[i])]);
    return result;
}

function getOrder(tree) { // tree   order 戮묒븘 닿린
    return tree.reduce((sequence, cur) => {
        sequence.push(cur.node_id);
        return sequence;
    }, []);
}

/* client濡쒕  곗쓽 flatdata  덉떆 (data.tree)
var tree = [{id: '1', title: 'N1', parent: 'NULL'},
            {id: '2', title: 'N2', parent: 'NULL'},
            {id: '3', title: 'N3', parent: '2'},
            {id: '4', title: 'N4', parent: '2'},
            {id: '5', title: 'N4', parent: '4'},
            {id: '6', title: 'N4', parent: '4'},
            {id: '7', title: 'N4', parent: '2'},
            {id: '8', title: 'N5', parent: 'NULL'},
*/

/* db濡쒕  곗쓽 tree  덉떆 (db.tree)
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