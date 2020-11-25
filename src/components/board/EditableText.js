import React, { Component } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4002/board_server');

class EditableText extends Component{
    constructor(props){
      super(props)
      this.state = {
        text: props.initialValue,
        edit: false
      }
      //this.textInput = React.createRef();
    }
  
  changeEditMode = (event) => {
    this.setState({
      edit: true
    })
    //document.getElementById(`${this.props.node_id}`).focus(); 
  } // false인 edit의 상태를 true로 바꿔주는 역할
  handleChange = (event) => {
    this.setState({
      text: event.target.value
    })
  }
  handleKeyDown = (event) => {
    if(event.key === "Enter"){
      this.setState({
<<<<<<< HEAD
        edit: false
=======
        edit: !this.state.edit
      },
      function(){
        socket.emit('channelJoin', {channel:'cocomeet', uname:'열창', trees:null});
        socket.emit('text', {text:this.state.text});
>>>>>>> origin/sunny
      }) 
      // socket emit
      
  // 만약 입력된 값을 상위 컴포넌트에서 저장/관리한다면, 저장하는 함수를 여기서 실행한다.
    }
  }
<<<<<<< HEAD
  handleBlur = () => {
    console.log("blurrrrrr")
    this.setState({
      edit: false
    }) 
  }
=======
  handleInputFocus = () => {
    this.setState({ edit: true });
  };

  handleInputBlur = () => {
    this.setState({ edit: false });
  };
>>>>>>> origin/sunny
  componentWillReceiveProps(nextProps) {
    this.setState({ text: nextProps.initialValue });
  }
  render(){
    return(
      <div className="row list">
      {this.state.edit ? 
      (<input className="form-control" type="text" 
              placeholder={this.state.text} 
              onChange={(event) => this.handleChange(event)} 
              onKeyDown = {this.handleKeyDown} 
<<<<<<< HEAD
              onBlur = {this.handleBlur}
              />)
      :
      (<span  onClick={() => this.changeEditMode()} >
=======
              onFocus = {this.handleInputFocus}
              onBlur = {this.handleInputBlur}
              
              />)
      :
      (<span onClick={() => this.changeEditMode()}>
>>>>>>> origin/sunny
          {this.state.text}</span>)}
      </div>
  )}
}

export default EditableText;
