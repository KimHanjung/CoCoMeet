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
        {this.props.trees.map((tree,index) => (
          <Tree key={index} tree={tree}/>
        ))}
      </div>
    );
  }
}


export default Tools;