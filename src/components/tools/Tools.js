import React, { Component } from 'react';
import Name from '../chat/Name'
import Channel from '../chat/Channel';

class Tools extends Component { 
  constructor(props) {
    super(props);
    this.state = {channel:'cocomeet', uname:'Yonsei', connected:'False'};
    this.updateName = this.updateName.bind(this);
    this.updateChannel = this.updateChannel.bind(this);
    this.updateConnected = this.updateConnected.bind(this);
  }
  updateName(uname){
    this.setState({uname: uname});
    this.props.onUpdate_name(this.state.uname);
  }
  updateChannel(channel){
    this.setState({channel: channel});
    this.props.onUpdate_channel(this.state.channel);
  }
  updateConnected(value){
    this.setState({connected: value});
    this.props.onUpdate_connect(this.state.connected);
  }
  render() {
      return (
        <div>
            <h2><Channel channel={this.props.channel} connected={this.props.connected} onUpdate_channel2={this.updateChannel} onUpdate_connect2={this.updateConnected} /> </h2>
            <h3><Name uname = {this.props.uname} onUpdate_name2={this.updateName} /></h3>
        </div>
      );
  }
}

export default Tools;