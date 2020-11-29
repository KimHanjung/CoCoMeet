import React, { Component } from 'react';
import ColorTools from './tools/ColorTools';
//mport Board from './board/Board';
import BoardExternal from './board/BoardExternal';
import BoardInternal from './board/BoardInternal';
import EditableText from './board/EditableText';
import MenuBar from "./menu/menu-bar-sun";
import ChatView from './chat/ChatView';
import Channel from './chat/Channel';
import Name from './chat/Name';
import HeaderBar from './header/header-bar-sun';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channel:'cocomeet', uname:'Yonsei', connected:'False',
      treenum: 2,
      trees: [
        {
          treeId: 0,
          treeData: this.newTree(0)
        },
        {
          treeId: 1,
          treeData: this.newTree(1)
        },
      ],
      tree1: 0,
      tree2: 1,
    };
    this.updateName = this.updateName.bind(this);
    this.updateChannel = this.updateChannel.bind(this);
    this.updateConnected = this.updateConnected.bind(this);
    this.updateMsgToBlock = this.updateMsgToBlock.bind(this);
  }
  newTree = (id) => {
    var init_val = 'hello tree ID '+id;
    var chd_val = 'child tree ID'+id;
    return ([
      { title: <EditableText initialValue={init_val}/>, expanded: true, children: [{ title: <EditableText initialValue={chd_val}/>}]}
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
        <MenuBar />
        <SplitterLayout primaryIndex={1} secondaryInitialSize={200}>
          <div>
            <h2><Name uname = {this.state.uname} onUpdate_name2={this.updateName} /></h2>
            <h3><Channel channel={this.state.channel} connected={this.state.connected} onUpdate_channel2={this.updateChannel} onUpdate_connect2={this.updateConnected} /> </h3>
            <ColorTools/>
          </div>
          <SplitterLayout secondaryInitialSize={350}>
            <SplitterLayout percentage='true'>
              <BoardInternal tree={this.state.trees[this.state.tree1]}/>
              <BoardInternal tree={this.state.trees[this.state.tree2]}/>
            </SplitterLayout>
            <ChatView uname = {this.state.uname} channel={this.state.channel} connected={this.state.connected}/>
          </SplitterLayout>
        </SplitterLayout>
      </div>
    );
  }
}

export default Main;