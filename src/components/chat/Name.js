import React, { Component } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard'
//import './Name.css'

  class AppChannel extends Component {
    constructor(props) {
      super(props);
      this.updateName = this.updateName.bind(this);
      this.keyUpdateName = this.keyUpdateName.bind(this);
  }
    updateName(event){
      if(event.target.value!==this.props.uname) this.props.onUpdate_name2(event.target.value);
    }
    keyUpdateName(event){
      if(event.keyCode===13) {
          if(event.target.value!==this.props.uname) this.props.onUpdate_name2(event.target.value);
      }
    }
    render() {
  
      return (
          <div class="p-2">
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder={'ID: '+this.props.uname} readOnly/>
            <CopyToClipboard text={this.props.channel_code}>
              <button class="shadow appearance-none border rounded w-full py-2 px-3 mt-3 text-xs text-gray-600 leading-tight focus:outline-none focus:shadow-outline" onClick={() => alert('Channel code copied to clipboard.')}>Copy<br/>channel code</button>
            </CopyToClipboard>
          </div>
          
      );
    }
  }
  //<input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="# User" onBlur={this.updateName} onKeyDown={this.keyUpdateName}/>
  export default AppChannel;