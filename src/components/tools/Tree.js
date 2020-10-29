import React, { Component } from 'react';
import { DragSource } from 'react-dnd';

const spec = {
  beginDrag(props) {
    const item = { ...props };
    console.log('beginDrag', item)
    return props.tree;
  },
  /*endDrag(props, monitor, component) {
    console.log('dropped ' + component);
    if (!monitor.didDrop()) {
      return;
    }
    
    return props.handleDrop(props.tree.treeId);
    
  },*/
  
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  }
}

class Tree extends Component {
  render() {
    const { isDragging, connectDragSource } = this.props;
    const opacity = isDragging ? 0 : 1;

    return connectDragSource(
      <div class="flex">
        <div class="w-1/2" style={{ opacity }}>
          <span>Tree {this.props.tree.treeId}</span>
        </div>
        <div class="w-1/2">
          <input type="checkbox" />
        </div>
      </div>
    );
  }
}

export default DragSource('tree', spec, collect)(Tree);