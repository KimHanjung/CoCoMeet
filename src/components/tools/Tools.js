import React, { Component } from 'react';

class Tools extends Component {
  constructor(props) {
    super(props);
    this.state ={
      treenum: props.howManyTrees,
      lefttree: props.tree1+1,
      righttree: props.tree2+1
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ treenum: nextProps.howManyTrees });
  }
  render() {
    var num = this.state.treenum;
    var left = this.state.lefttree;
    var right = this.state.righttree;
    let treearray = []
    for(let i=1;i<=num;i++){
      if (i==left) {
        treearray.push(<li style={{color: "red"}}>Tree {i}</li>);
      }
      else if (i==right){
        treearray.push(<li style={{color: "blue"}}>Tree {i}</li>);
      }
      else {
        treearray.push(<li>Tree {i}</li>);
      }
    }
    return (
      <div>
        Tool Box
        <ul>
          {treearray}
        </ul>
      </div>
    );
  }
}


export default Tools;