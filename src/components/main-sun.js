import React, { Component } from 'react';
import Tools from './tools/Tools';
import Board from './board/Board';
import EditableText from './board/EditableText';
import MenuBar from "./menu/menu-bar-sun";
import AppChat from "./chat/AppChat";
import HeaderBar from "./header/header-bar-sun";
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';

class Main extends Component {
  constructor(props){
    super(props)
    this.state = {
      treenum: 2,
      trees: [
        {
          treeId: 0,
          treeData: this.newTree(0)
        },
        {
          treeId: 1,
          treeData: this.newTree(1)
        },
      ],
      tree1: 0,
      tree2: 1
    };
  }
  newTree = (id) => {
    var init_val = 'hello tree ID '+id;
    return ([
      { title: <EditableText initialValue={init_val}/>, expanded: true, children: [{ title: <EditableText initialValue='world'/>}]}
    ])
  }
  newTreeData = (id) => {
    return ([
      {
        treeId: id,
        treeData: this.newTree(id)
      }
    ]);
  }
  addTree =()=>{
    var tree_num = this.state.treenum +1;
    this.setState({treenum: tree_num});
    this.setState({trees: this.state.trees.concat(this.newTreeData(tree_num-1))});
    console.log(this.state);
  }
  render() {
    return (
      <div>
        <HeaderBar />
        <MenuBar />
        <button onClick={this.addTree} >Add Tree</button> 
        <SplitterLayout primaryIndex={1} secondaryInitialSize={200}>
          <Tools howManyTrees={this.state.treenum} tree1={this.state.tree1} tree2={this.state.tree2}/>
          <SplitterLayout secondaryInitialSize={350}>
            <SplitterLayout percentage='true'>
              <Board tree={this.state.trees[this.state.tree1]}/>
              <Board tree={this.state.trees[this.state.tree2]}/>
            </SplitterLayout>
            <AppChat/>
          </SplitterLayout>
        </SplitterLayout>
      </div>
    );
  }
}

export default Main;