import React, { Component } from 'react';

  class AppChannel extends Component {
    updateChannel(event){
      if(event.target.value!==this.props.channel) this.props.onUpdate(event.target.value);
    }
    keyUpdateChannel(event){
      if(event.keyCode===13) {
          if(event.target.value!==this.props.channel) this.props.onUpdate(event.target.value);
      }
    }
    render() {
      return (
          <header className="Channel-header">
            <h1 className="Channel-title">Welcome to Talkwith</h1>
            <input type="text" className="channel" placeholder="channel name" onBlur={this.updateChannel.bind(this)} onKeyDown={this.keyUpdateChannel.bind(this)}/>
          </header>
      );
    }
  }
  
  export default AppChannel;