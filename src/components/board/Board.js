import React, { Component } from 'react';
import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [
        { title: '소공', children: [{ title: '이창열' }] },
        { title: 'bang', children: [{ title: '방승연' }] },
        { title: 'doing', children: [{ title: '김한중' }] },
      ]
    };
  }
  render() {
    return (
      <div style={{ height: 400 }}>
        Board Box
        <SortableTree
          treeData={this.state.treeData}
          onChange={treeData => this.setState({ treeData })}
        />
      </div>
    );
  }
}

export default Board;