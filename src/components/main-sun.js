import React, { Component } from 'react';
import Tools from './tools/Tools';
import Board from './board/Board';
import Chat from './chat/Chat';
import ChatView from './chat/ChatView';
import MenuBar from "./menu/menu-bar-sun";
import HeaderBar from "./header/header-bar-sun";
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {channel:'snutiise'};
    this.updateChannel = this.updateChannel.bind(this);
  }
  updateChannel(channel){
    this.setState({channel: channel});
  }
  render() {
    return (
      <div>
        <HeaderBar />
        <MenuBar />
        <SplitterLayout primaryIndex={1} secondaryInitialSize={200}>
          <Tools />
          <SplitterLayout secondaryInitialSize={350}>
            <Board />
            <div>
              <Chat channel={this.state.channel} onUpdate={this.updateChannel}/>
              <ChatView channel={this.state.channel} />
            </div>
          </SplitterLayout>
          
        </SplitterLayout>
      </div>
    );
  }
}

export default Main;