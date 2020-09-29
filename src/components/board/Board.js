import React, { Component } from 'react';
import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import EditableText from './EditableText';

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: props.tree.treeData
    };
    this.add = this.add.bind(this)
    //this.showinfo = this.showinfo.bind(this);
    //this.edit = this.edit.bind(this)
  }
  add(){
    this.setState({treeData: this.state.treeData.concat([{ title: <EditableText initialValue='new text box'/>, children: []}])});
  }
  /*showinfo(){
    alert(this.state.treeData);
  }
  edit(){
    alert(' click');
  }*/
  render() {
    return (
      <div style={{ height: 600 }}>
        Board Box
        <button onClick={this.add} >Add</button> 
        
        <SortableTree
          treeData={this.state.treeData}
          onChange={treeData => this.setState({ treeData })}
        />
      </div>
    );
  }
}

export default Board;