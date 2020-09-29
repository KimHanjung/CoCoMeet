import React, { Component } from 'react';
import Tools from './tools/Tools';
import Board from './board/Board';
import MenuBar from "./menu/menu-bar-sun";
import AppChat from "./chat/AppChat";
import HeaderBar from "./header/header-bar-sun";
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {channel:'cocomeet', uname:'Yonsei', connected:'False'};
    this.updateName = this.updateName.bind(this);
    this.updateChannel = this.updateChannel.bind(this);
    this.updateConnected = this.updateConnected.bind(this);
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
  render() {
    return (
      <div>
        <HeaderBar />
        <MenuBar />
        <SplitterLayout primaryIndex={1} secondaryInitialSize={200}>
          <Tools uname={this.state.uname} channel={this.state.channel} connected={this.state.connected} onUpdate_channel={this.updateChannel} onUpdate_connect={this.updateConnected} onUpdate_name={this.updateName}/>
          <SplitterLayout secondaryInitialSize={350}>
            <SplitterLayout percentage='true'><Board /><Board /></SplitterLayout>
            <AppChat uname = {this.state.uname} channel={this.state.channel} connected={this.state.connected}/>
          </SplitterLayout>
        </SplitterLayout>
      </div>
    );
  }
}

export default Main;