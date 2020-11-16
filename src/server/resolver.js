import {Total_ORDERS} from "./DB2_order";

const resolvers = {
    Query: {
        get_order: (_, {room_id, tree_id}) => getById(room_id, tree_id),
        orders : () => Total_ORDERS
    }
};

const getById = (room_id, tree_id) => {
    const filteredorders = Total_ORDERS.filter(order => order.room_id === room_id && order.tree_id === tree_id);
    return filteredorders[0];
}

export default resolvers;  