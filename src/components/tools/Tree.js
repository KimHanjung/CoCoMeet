import React, { Component } from 'react';
import { DragSource } from 'react-dnd';

const itemSource = {
  beginDrag(props) {
    console.log('dragging ' + props.tree.treeId);
    return props.tree;
  },
  endDrag(props, monitor, component) {
    console.log('dropped ' + component);
    if (!monitor.didDrop()) {
      return;
    }
    
    return props.handleDrop(props.tree.treeId);
    
  },
  
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
    const { isDragging, connectDragSource, tree } = this.props;
    const opacity = isDragging ? 0 : 1;

    return connectDragSource(
      <div className="tree" style={{ opacity }}>
        <span>Tree {tree.treeId}</span>
      </div>
    );
  }
}

export default DragSource('tree', itemSource, collect)(Tree);
