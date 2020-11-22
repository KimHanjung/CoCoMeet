import React, { Component } from 'react';
import ColorTools from './tools/ColorTools';
import TextTools from './tools/TextTools';
import Tools from './tools/Tools';
import Board from './board/BoardData';
import BoardExternal from './board/BoardExternal';
import BoardInternal from './board/BoardInternal';
import EditableText from './board/EditableText';
import ChatView from './chat/ChatView_sun';
import Channel from './chat/Channel';
import Name from './chat/Name';
import HeaderBar from './header/header-bar-sun';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { getFlatDataFromTree, getTreeFromFlatData } from 'react-sortable-tree';
import 'react-sortable-tree/style.css';

const test_tree = {treenum: 2, tree: 
  {Left: [{id: '1', title: 'N1', parent: 'NULL', color: 'cyan', weight: 'bold', deco: 'underline'},
            {id: '2', title: 'N2', parent: 'NULL', color: 'cyan', weight: 'bold', deco: 'underline'},
            {id: '3', title: 'N3', parent: '2', color: 'cyan', weight: 'bold', deco: 'underline'},
            {id: '4', title: 'N4', parent: '2', color: 'cyan', weight: 'bold', deco: 'underline'},
            {id: '5', title: 'N4', parent: '4', color: 'cyan', weight: 'bold', deco: 'underline'},
            {id: '6', title: 'N4', parent: '4', color: 'cyan', weight: 'bold', deco: 'underline'},
            {id: '7', title: 'N4', parent: '2', color: 'cyan', weight: 'bold', deco: 'underline'},
            {id: '8', title: 'N5', parent: 'NULL', color: 'cyan', weight: 'bold', deco: 'underline'},
    ]
  ,
  Right: 
    [{id: '1', title: 'tree2 N1', parent: 'NULL', color: 'cyan', weight: 'bold', deco: 'underline'},
            {id: '2', title: 'tree2 N2', parent: 'NULL', color: 'cyan', weight: 'bold', deco: 'underline'},
            {id: '3', title: 'tree2 N3', parent: '2', color: 'cyan', weight: 'bold', deco: 'underline'},
            {id: '5', title: 'tree2 N4', parent: '4', color: 'cyan', weight: 'bold', deco: 'underline'},
            {id: '6', title: 'tree2 N4', parent: '4', color: 'cyan', weight: 'bold', deco: 'underline'},
            {id: '7', title: 'tree2 N4', parent: '2', color: 'cyan', weight: 'bold', deco: 'underline'},
    ]
  }
};



class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channel:'cocomeet', uname:'Yonsei', connected:'False', msg_to_block:'Select Message!',
      treenum: 2,
      lefttree: {treeID: 0, treeData: {title: "dummy"}},
      righttree: {treeID: 1, treeData: {title: "dummy"}},
      //tree1: 0,
      //tree2: 1,
    };
    this.onDropLeft = this.onDropLeft.bind(this);
    this.onDropRight = this.onDropRight.bind(this);
    this.updateNodeLeft = this.updateNodeLeft.bind(this);
    this.updateNodeRight = this.updateNodeRight.bind(this);
    this.updateTreeLeft = this.updateTreeLeft.bind(this);
    this.updateTreeRight = this.updateTreeRight.bind(this);
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.updateName = this.updateName.bind(this);
    this.updateChannel = this.updateChannel.bind(this);
    this.updateConnected = this.updateConnected.bind(this);
    this.updateMsgToBlock = this.updateMsgToBlock.bind(this);
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.toFlatDataFrom = this.toFlatDataFrom.bind(this);
    this.toTreeDataFrom = this.toTreeDataFrom.bind(this);
  }
  toTreeDataFrom=(flat)=>{
    return getTreeFromFlatData({
      flatData: flat.map(node => ({ ...node, 
        title: <EditableText node_id={node.id} initialValue={node.title}/>, color: node.color, weight: node.weight, deco: node.deco })),
      getKey: node => node.id,
      getParentKey: node => node.parent, 
      rootKey: 'NULL', 
    });
  }
  toFlatDataFrom=(tree)=>{
    return getFlatDataFromTree({
      treeData: tree,
      getNodeKey: ({ node }) => node.id, 
      ignoreCollapsed: false, 
    }).map(({ node, path }) => ({
      id: node.id,
      title: /*Editable text의 initial_val */ node.title,
      color: node.color,
      deco: node.deco,
      weight: node.weight,
      // The last entry in the path is this node's key
      // The second to last entry (accessed here) is the parent node's key
      parent: path.length > 1 ? path[path.length - 2] : 'NULL',
    }));

  }
  componentDidMount(){
    // 방 들어왔을 때 실행되는 코드
    // channel uname ... 설정하는 코드

    // tree data 받기
    /*
    socket.on('channelJoin', function(data) {
      // {treenum:treenum, tree: {Left:treeLetf, Right:treeRight}, order: {Left:orderLeft, Right:orderRight}});
      let leftflat = data.tree.Left;
      let rightflat = data.tree.Right;
      const left_tree = getTreeFromFlatData({
        flatData: data.tree.Left.map(node => ({ ...node, 
          title: node.title, color: node.color, weight: node.weight, deco: node.deco })),
        getKey: node => node.id,
        getParentKey: node => node.parent, 
        rootKey: 'NULL', 
      });
      const right_tree = getTreeFromFlatData({
        flatData: data.tree.Right.map(node => ({ ...node, 
          title: node.title, color: node.color, weight: node.weight, deco: node.deco })),
        getKey: node => node.id,
        getParentKey: node => node.parent, 
        rootKey: 'NULL, 
      });
      
      this.setState({treenum: data.treenum, lefttree: left_tree, righttree: right_tree});
    })*/
    console.log("did moumt start");
    var data = test_tree;
    const left_tree = this.toTreeDataFrom(data.tree.Left);
    //console.log("function changed result", left_tree);
    const right_tree = this.toTreeDataFrom(data.tree.Right);
    
    this.setState({treenum: data.treenum, lefttree: {treeID: 0, treeData: left_tree}, righttree: {treeID: 1, treeData: right_tree}});

    socket.on('addTree', function(data){
      this.setState({treenum: data.treenum})
    })
    
  }

  addTree =()=>{
    socket.emit('addTree')
  }
  updateTreeLeft = (tree_id) => {
    socket.emit('changeTree', tree_id)
    // send tree??
    socket.on('changeTree',function(data){
      this.setState({lefttree: data.tree})
    })
  }
  updateTreeRight = (tree_id) =>{
    socket.emit('changeTree', tree_id)
    // sendTree??
    socket.on('changeTree',function(data){
      this.setState({righttree: data.tree})
    })
  }

  updateNodeLeft = () => {
    // addblock
    // left tree 마지막에 "block with id -1" 추가
    var addnode_lefttree = this.state.lefttree;
    addnode_lefttree.concat(
      [{ id: -1, title: "dummy", color: "cyan", weight: "normal", deco: "none"}]
    )
    
    socket.emit("addNode", this.toFlatDataFrom(addnode_lefttree));
  }
  updateNodeRight = () => {
    //console.log('adding new node to tree ' + id);
    const id = this.state.tree2
    /*const elementsIndex = this.state.trees.findIndex(tree => tree.treeId == id )
    let newtrees = [...this.state.trees]
    newtrees[elementsIndex] = {...newtrees[elementsIndex], 
      treeData: newtrees[elementsIndex].treeData.concat([{ title: <EditableText initialValue='new text box'/>, children: []}])}
    this.setState({
      trees: newtrees
    });*/
  }
  onDropLeft(tree_id){
    if (tree_id !== this.state.lefttree.treeID) {
      this.updateTreeLeft(tree_id);
    }
    
  }
  onDropRight(tree_id){
    if (tree_id !== this.state.righttree.treeID) {
      this.updateTreeRight(tree_id);
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  updateName(uname){
    this.setState({uname: uname});
  }
  updateChannel(channel){
    this.setState({channel: channel});
  }
  updateConnected(value){
    this.setState({connected:value});
  }
  updateMsgToBlock(msg_to_block){
    this.setState({msg_to_block: msg_to_block});
  }
  render() {
    return (
      <div>
        <HeaderBar />
        <div class="h-full">
          <DndProvider backend={HTML5Backend}>
            <div >
                <div class="flex m-4 ">
                    <div class="w-1/9 p-3">
                        <div class="h-quaterscreen">
                            <div class="mb-6 pb-3 shadow-md bg-gray-100 h-1/5">
                              <div class="border-b-2 border-gray-300 bg-gray-200 h-12 p-3 mb-3">
                                <div class="font-sans text-lg font-semibold text-teal-500">Channel</div>
                              </div>
                              <Name uname = {this.state.uname} onUpdate_name2={this.updateName} />
                              <Channel channel={this.state.channel} connected={this.state.connected} onUpdate_channel2={this.updateChannel} onUpdate_connect2={this.updateConnected} /> 
                            </div>
                            <div class="mb-6 pb-3 shadow-md bg-gray-100 h-1/5">
                              <div class="border-b-2 border-gray-300 bg-gray-200 h-12 p-3 mb-3">
                                <div class="font-sans text-lg font-semibold text-teal-500">Block Colors</div>
                              </div>
                              <ColorTools/>
                            </div>
                            <div class="mb-6 pb-3 shadow-md bg-gray-100 h-1/5">
                              <div class="border-b-2 border-gray-300 bg-gray-200 h-12 p-3 mb-3">
                                <div class="font-sans text-lg font-semibold text-teal-500">Font Style</div>
                              </div>
                              <TextTools/>
                            </div>
                            <div class="mb-6 pb-3 shadow-md bg-gray-100 h-1/5">
                              <div class="border-b-2 border-gray-300 bg-gray-200 h-12 p-3 mb-3">
                                <div class="font-sans text-lg font-semibold text-teal-500">Tree Lists</div>
                              </div>
                              <div class="ml-3">
                                <button class="bg-transparent border-transparent text-blue-500 font-extrabold hover:underline py-2" onClick={this.addTree} >Add New Tree</button>
                                <div class="pl-2">
                                  <Tools treenum={this.state.treenum} tree1={this.state.lefttree.treeID} tree2={this.state.righttree.treeID}/>
                                  
                                </div>
                              </div>
                            </div>
                        </div>
                    </div>
                    <div class="w-3/9 p-3">
                        <div class="shadow-md bg-gray-100 h-quaterscreen">
                          <div class="border-b-2 border-gray-300 bg-gray-200 h-12 p-3 mb-3">
                            <div class="font-sans text-lg font-semibold text-teal-500">Left Tree</div>
                          </div>
                          <BoardInternal tree={this.state.lefttree}
                          onDrop={this.onDropLeft} updateNode={this.updateNodeLeft} updateTree={this.updateTreeLeft}/>
                        </div>
                    </div>
                    <div class="w-3/9 p-3">
                        <div class="shadow-md bg-gray-100 h-quaterscreen">
                          <div class="border-b-2 border-gray-300 bg-gray-200 h-12 p-3 mb-3">
                            <div class="font-sans text-lg font-semibold text-teal-500">Right Tree</div>
                          </div>
                          <BoardInternal tree={this.state.righttree}
                          onDrop={this.onDropRight} updateNode={this.updateNodeRight} updateTree={this.updateTreeRight}/>
                        </div>
                    </div>
                    <div class="w-2/9 p-3">
                        <div class="shadow-md bg-gray-100 h-quaterscreen">
                          <div class="border-b-2 border-gray-300 bg-gray-200 h-12 p-3 mb-3">
                            <div class="font-sans text-lg font-semibold text-teal-500">Chat</div>
                          </div>
                          <ChatView uname = {this.state.uname} channel={this.state.channel} connected={this.state.connected} OnupdateMsgToBlock={this.updateMsgToBlock}/> 
                        </div>
                    </div>
                </div>
            </div>
          </DndProvider>
        </div>
      </div>
    );
  }
}

export default Main;