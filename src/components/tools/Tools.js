import React, { Component } from 'react';
import Tree from "./Tree";

class Tools extends Component {
  constructor(props) {
    super(props);
    this.state ={
      //trees: props.trees
      //leftree: props.tree1,
      //righttree: props.tree2
    }
  }

  render() {
    let treearray = []
    for(let i=0;i<this.props.treenum;i++){
      i = String(i)
      if (i===this.props.tree1) {
        treearray.push(<div key = {i} class="w-full text-red"><Tree treeId={i}/></div>);
      }
      else if (i===this.props.tree2){
        treearray.push(<div key = {i} class="w-full text-blue-500"><Tree treeId={i}/></div>);
      }
      else {
        treearray.push(<div key = {i} class="w-full"><Tree treeId={i}/></div>);
      }
    }
    return (
      <div>
        <div>
          {treearray}
        </div>
      </div>
    );
  }
}


export default Tools;