import React, { Component } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4002/board_server');

class EditableText extends Component{
    constructor(props){
      super(props)
      this.state = {
        text: props.initialValue,
        edit: false,
        flag: false,
      }
      //this.textInput = React.createRef();
    }
  
  changeEditMode = () => {
    this.setState({
      edit: true, 
    })
    //document.getElementById(`${this.props.node_id}`).focus(); 
  } // false인 edit의 상태를 true로 바꿔주는 역할
  handleChange = (event) => {
    this.setState({
      text: event.target.value
    })
    if (this.state.flag===false){
      this.setState({flag:true})
      this.props.modify(this.props.tree_id, true);
    }
  }
  handleKeyDown = (event) => {
    if(event.key === "Enter"){
      this.setState({
        edit: false
      })
      if (this.state.flag===true){
        this.setState({flag:false})
        // socket emit
        console.log("text changed...EMIT!")
        var data ={};
        data["text"]=this.state.text;
        data["tree_id"]=  this.props.tree_id;
        data["node_id"]=this.props.node_id;
        socket.emit("changeText", data);
      }
      this.props.modify(this.props.tree_id, false);
      
    }
  }
  

  handleInputBlur = () => {
    this.setState({ edit: false });
    if (this.state.flag===true){
      this.setState({flag:false})
      // socket emit
      console.log("text changed...EMIT!")
      var data ={};
      data["text"]=this.state.text;
      data["tree_id"]=this.props.tree_id;
      data["node_id"]=this.props.node_id;
      socket.emit("changeText", data);
    }
    this.props.modify(this.props.tree_id, false);
  };
  componentWillReceiveProps(nextProps) {
    this.setState({ text: nextProps.initialValue });
  }
  render(){
    return(
      <div className="row list">
      {this.state.edit ? 
      (<input className="form-control" type="text" 
              value={this.state.text} 
              onChange={(event) => this.handleChange(event)} 
              onKeyDown = {this.handleKeyDown} 
              onBlur = {this.handleInputBlur}
              
              />)
      :
      (<span onDoubleClick={() => this.changeEditMode()}>
          {this.state.text}</span>)}
      </div>
  )}
}

export default EditableText;
