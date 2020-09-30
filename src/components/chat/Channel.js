import React, { Component } from 'react';
import { Input } from 'react-bootstrap';
import './Channel.css';
import openSocket from 'socket.io-client';
//const socket = openSocket('http://localhost:4002');
const socket = openSocket('http://3.34.138.234:4000');

class AppChannel extends Component {
  constructor(props) {
    super(props);
    this.updateConnected = this.updateConnected.bind(this)
    this.updateChannel = this.updateChannel.bind(this);
    this.keyUpdateChannel = this.keyUpdateChannel.bind(this);
}
  updateConnected(){
    if(this.props.connected==='False') this.props.onUpdate_connect2('True');
  }
  updateChannel(event){
    if(event.target.value!==this.props.channel) this.props.onUpdate_channel2(event.target.value);
  }
  keyUpdateChannel(event){
    if(event.keyCode===13) {
        if(event.target.value!==this.props.channel) this.props.onUpdate_channel2(event.target.value);
    }
  }
  render() {
    return (
      <input type="text" className="channel" placeholder="# Channel" onBlur={this.updateChannel} onKeyDown={this.keyUpdateChannel}/>
 
    );
  }
}
/*<button type="button" className="btn btn-primary" onClick={() => this.updateConnected(this)}>Enter</button>*/
export default AppChannel;