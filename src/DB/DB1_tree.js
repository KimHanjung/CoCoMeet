import {Total_ORDERS} from "./DB2_order";

export let Total_TREES = [
    {
        room_id : 0,
        tree_id : 0,
        node_id : 0,
        title : "block_0",
        parent : null, 
        color : "blue", 
        deco : "normal",
        weight : "normal"
    },
    {
        room_id : 0,
        tree_id : 0,
        node_id : 1,
        title : "block_1",
        parent : 0, 
        color : "blue", 
        deco : "normal",
        weight : "normal"
    },
    {
        room_id : 0,
        tree_id : 0,
        node_id : 2,
        title : "block_2",
        parent : 0, 
        color : "blue", 
        deco : "normal",
        weight : "normal"
    },
    {
        room_id : 0,
        tree_id : 0,
        node_id : 3,
        title : "block_3",
        parent : 2, 
        color : "blue", 
        deco : "normal",
        weight : "normal"
    },
    {
        room_id : 0,
        tree_id : 1,
        node_id : 4,
        title : "block_4",
        parent : null, 
        color : "blue", 
        deco : "normal",
        weight : "normal"
    },
    {
        room_id : 0,
        tree_id : 1,
        node_id : 5,
        title : "block_5",
        parent : 4, 
        color : "blue", 
        deco : "normal",
        weight : "normal"
    },
    {
        room_id : 1,
        tree_id : 0,
        node_id : 0,
        title : "block_0",
        parent : null, 
        color : "blue", 
        deco : "normal",
        weight : "normal"
    }
];

// new Tree는 결국 tree_id가 새 거인 node를 만드는 것과 같음
export const newTree = (room_id) => {
    const roomTrees = Total_ORDERS.filter(order => order.room_id === room_id);
    const newT = newApple(room_id, roomTrees.length, "default_text", null);
    return newT;
}

export const newApple = (room_id, tree_id, text, parent) => {
    const roomNodes = Total_TREES.filter(block => block.room_id === room_id);
    const newNode = {
        room_id : room_id,
        tree_id : tree_id, 
        node_id : roomNodes.length, 
        title : text, 
        parent : parent,
        color : "blue",
        deco : "normal",
        weight : "normal"
    }
    Total_TREES.push(newNode);
    return newNode;
}

export const deleteBlock = (room_id, node_id) => {
    // 지금은 cleaned_ 로 재생성 후 업데이트. Redis에서의 del로 변경 예정
    const cleanedBlocks = Total_TREES.filter(block => block.room_id !== room_id || block.node_id !== node_id);
    if (Total_TREES.length > cleanedBlocks.length) {
        Total_TREES = cleanedBlocks;
        return true;
    }
    else {
        return false;
    }
}

export const editColor = (room_id, node_id, color) => {
    const target = Total_TREES.filter(node => node.room_id === room_id && node.node_id === node_id);
    let newNode = target[0];
    newNode["color"] = color;

    return newNode;
}

export const editDeco = (room_id, node_id, deco) => {
    const target = Total_TREES.filter(node => node.room_id === room_id && node.node_id === node_id);
    let newNode = target[0];
    newNode["deco"] = deco;

    return newNode;
}

export const editWeight = (room_id, node_id, weight) => {
    const target = Total_TREES.filter(node => node.room_id === room_id && node.node_id === node_id);
    let newNode = target[0];
    newNode["weight"] = weight;
    
    return newNode;
}