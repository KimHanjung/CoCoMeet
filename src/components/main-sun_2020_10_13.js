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
import io from 'socket.io-client';

const socket = io('http://localhost:4002/board_server');

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channel:'cocomeet', uname:'Yonsei', connected:'False', msg_to_block:'Select Message!',
      treenum: 2,
      trees: [
        {
          treeId: 0,
          treeData: this.newTree(0),
          block_color: "cyan",
          text_deco: "underline",
          font_weight: "bold",
        },
        {
          treeId: 1,
          treeData: this.newTree(1),
          block_color: "orange",
          text_deco: "overline",
          font_weight: "normal",
        },

      ],
      tree1: 0,
      tree2: 1,
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

  }
  componentDidMount(){
    let cursor=this;
    socket.emit('channelJoin', {channel:this.state.channel, uname:this.state.uname, trees:this.state.trees});
    socket.on('receive', function (data) {
      console.log(data.trees);
      //cursor.setState({trees: data.trees});
      console.log('================');
      console.log(cursor.state.trees);
    });
    socket.on('addTree', function(data){
      cursor.setState({trees: cursor.state.trees.concat(data.tree)});
      console.log(data.tree);
    });
}
  newTree = (id) => {
    var init_val = 'hello tree ID ' + id;
    var child_val = 'chd tree ID' + id;
    return ([
      { 
        title: <EditableText initialValue={init_val}/>, expanded: true, children: [{ title: <EditableText initialValue={child_val}/>}]
      },
    ])
  }
  newTreeData = (id) => {
    return ([
      {
        treeId: id,
        treeData: this.newTree(id)
      }
    ]);
  }
  addTree =()=>{
    var tree_num = this.state.treenum +1;
    this.setState({treenum: tree_num});
    //this.setState({trees: this.state.trees.concat(this.newTreeData(tree_num-1))});
    socket.emit('addTree', {channel:this.state.channel, tree:this.newTreeData(tree_num-1)});
  }
  updateTreeLeft = (newTreeData) => {
    const id = this.state.tree1
    let newT = {treeId: id, treeData: newTreeData}
    //console.log(newT)
    this.setState({
      trees: this.state.trees.map(t => t.treeId === id ? {...t, ...newT} : t)
    });
    //this.setState({trees: newtree})
  }
  updateTreeRight = (newTreeData) =>{
    const id = this.state.tree2
    let newT = {treeId: id, treeData: newTreeData}
    //console.log(newT)
    this.setState({
      trees: this.state.trees.map(t => t.treeId === id ? {...t, ...newT} : t)
    });
    //this.setState({trees: newtree})
  }

  updateNodeLeft = () => {
    //console.log('adding new node to tree ' + id);
    const id = this.state.tree1
    const elementsIndex = this.state.trees.findIndex(tree => tree.treeId == id )
    let newtrees = [...this.state.trees]
    newtrees[elementsIndex] = {...newtrees[elementsIndex], 
      treeData: newtrees[elementsIndex].treeData.concat([{ title: <EditableText initialValue='new text box'/>, children: []}])}
    this.setState({
      trees: newtrees
    });
  }
  updateNodeRight = () => {
    //console.log('adding new node to tree ' + id);
    const id = this.state.tree2
    const elementsIndex = this.state.trees.findIndex(tree => tree.treeId == id )
    let newtrees = [...this.state.trees]
    newtrees[elementsIndex] = {...newtrees[elementsIndex], 
      treeData: newtrees[elementsIndex].treeData.concat([{ title: <EditableText initialValue='new text box'/>, children: []}])}
    this.setState({
      trees: newtrees
    });
  }
  onDropLeft(tree_id){
    this.setState({tree1: tree_id})
  }
  onDropRight(tree_id){
    this.setState({tree2: tree_id})
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
                                  <Tools trees={this.state.trees} treenum={this.state.treenum} tree1={this.state.tree1} tree2={this.state.tree2}/>
                                  
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
                          <BoardInternal tree={this.state.trees[this.state.tree1]} treeId={this.state.tree1} 
                          onDrop={this.onDropLeft} updateNode={this.updateNodeLeft} updateTree={this.updateTreeLeft}/>
                        </div>
                    </div>
                    <div class="w-3/9 p-3">
                        <div class="shadow-md bg-gray-100 h-quaterscreen">
                          <div class="border-b-2 border-gray-300 bg-gray-200 h-12 p-3 mb-3">
                            <div class="font-sans text-lg font-semibold text-teal-500">Right Tree</div>
                          </div>
                          <BoardInternal tree={this.state.trees[this.state.tree2]} treeId={this.state.tree2} 
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