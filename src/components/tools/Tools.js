import React, { Component } from 'react';
import Tree from "./Tree";

class Tools extends Component {
  constructor(props) {
    super(props);
    this.state ={
      //trees: props.trees
      leftree: props.tree1,
      righttree: props.tree2
    }
  }

  render() {
    return (
      <div>
        Tool Box
        <div className="item-container">
          {this.props.trees.map((tree) => (
            <Tree tree={tree} handleDrop={(id) => this.props.handler1(id)} />
          ))}
        </div>
      </div>
    );
  }
}


export default Tools;