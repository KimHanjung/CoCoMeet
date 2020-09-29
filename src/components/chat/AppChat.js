import React, { Component } from 'react';
import ChatView from './ChatView';

class AppChat extends Component { 

  render() {
      return (
        <div>
            <ChatView uname = {this.props.uname} channel={this.props.channel} connected={this.props.connected}/>
        </div>
      );
  }
}

export default AppChat