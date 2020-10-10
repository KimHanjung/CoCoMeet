import React, { Component } from 'react';
import './Name.css'

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
          <input type="text" className="uname" placeholder="# User" onBlur={this.updateName} onKeyDown={this.keyUpdateName}/>
      );
    }
  }
  
  export default AppChannel;