import {Total_ORDERS} from "./DB2_order";
import {Total_TREES, newApple, deleteBlock} from "./DB1_tree";

const resolvers = {
    Query: {
        get_order: (_, {room_id, tree_id}) => getOrderById(room_id, tree_id),
        orders : () => Total_ORDERS,
        get_tree:(_, {room_id, tree_id}) => getTree(room_id, tree_id),
    },
    Mutation: {
        delete_block: (_, {room_id, node_id}) => deleteBlock(room_id, node_id),
        new_apple: (_, {room_id, tree_id, text, parent}) => newApple(room_id, tree_id, text, parent), 
        new_block:(_, {room_id, tree_id}) => newApple(room_id, tree_id, "default_text", null)
    }
};

// DataBase1. Tree
const getTree = (room_id, tree_id) => {
    const blocks = Total_TREES.filter(block => block.room_id === room_id && block.tree_id === tree_id);
    return blocks;
}

// DataBase2. Order
const getOrderById = (room_id, tree_id) => {
    const filteredorders = Total_ORDERS.filter(order => order.room_id === room_id && order.tree_id === tree_id);
    return filteredorders[0];
}

export default resolvers;  