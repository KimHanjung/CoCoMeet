import React, { Component } from 'react';
//import { Input } from 'react-bootstrap';
//import './Channel.css';

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
      <div class="p-2">
        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder={'Ch. '+this.props.channel} readOnly/>
      </div>
    );
  }
}
/*<button type="button" className="btn btn-primary" onClick={() => this.updateConnected(this)}>Enter</button>*/
export default AppChannel;
