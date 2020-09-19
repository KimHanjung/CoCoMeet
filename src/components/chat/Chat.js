import React, { Component } from 'react';
import { Input } from 'react-bootstrap';
import './Chat.css';
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:4002');

class Channel extends Component {
  constructor(props) {
    super(props);
    this.state = {channel:this.props.channel};
    this.updateChannel = this.updateChannel.bind(this);
    this.keyUpdateChannel = this.keyUpdateChannel.bind(this);
  }
  componentDidMount(){
    document.querySelector(".channel").value=this.props.channel;
  }
  componentWillReceiveProps(changeProps){
    this.setState({channel:changeProps.channel});
  }
  updateChannel(event){
    if(event.target.value!=this.state.channel) this.props.onUpdate(event.target.value);
  }
  keyUpdateChannel(event){
    if(event.keyCode==13) {
      if(event.target.value!=this.state.channel) this.props.onUpdate(event.target.value);
    }
  }
  render() {
    return (
        <header className="Channel-header">
          <h1 className="Channel-title">Welcome to CoCoMeet</h1>
          <input type="text" className="channel" placeholder="channel name" onBlur={this.updateChannel} onKeyDown={this.keyUpdateChannel}/>
        </header>
    );
  }
}

export default Channel;