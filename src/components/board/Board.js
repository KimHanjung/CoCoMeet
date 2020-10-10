import React, { Component } from 'react';
import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import EditableText from './EditableText';
import { DropTarget } from 'react-dnd';


function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    hovered: monitor.isOver(),
    //item: monitor.getItem(),
  }
}
const spec = {
  drop(props, monitor){
      const item = monitor.getItem()
      console.log(monitor.getDropResult());
      props.onDrop(item.treeId)
      return item;
  }
}

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
  componentWillReceiveProps(nextProps) {
    this.setState({ treeData: nextProps.tree.treeData });
  }

  /*showinfo(){
    alert(this.state.treeData);
  }
  edit(){
    alert(' click');
  }*/
  render() {
    const { connectDropTarget, hovered, item } = this.props;
    const backgroundColor = hovered ? 'lightgreen' : 'white';
    return connectDropTarget(
      <div className="Board" style={{ background: backgroundColor }}>
      <div style={{ height: 600 }}>
        Board Box
        <button onClick={this.add} >Add</button> 
        
        <SortableTree
          treeData={this.props.tree.treeData}
          onChange={treeData => this.setState({ treeData })}
        />
      </div>
      </div>
    );
  }
}

//export default Board;
export default DropTarget('tree', spec, collect)(Board);