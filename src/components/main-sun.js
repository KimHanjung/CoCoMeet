import React, { Component } from 'react';
import Tools from './tools/Tools';
import Board from './board/Board';
import EditableText from './board/EditableText';
import MenuBar from "./menu/menu-bar-sun";
import AppChat from "./chat/AppChat";
import HeaderBar from "./header/header-bar-sun";
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

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
  changeLeftTree = (id) => {
    console.log('left tree changing to ' + id);
    this.setState({tree1: id})
  }
  changeRightTree = (id) => {
    console.log('right tree changing to ' + id);
    //this.setState({tree2: id})
  }
  addNode = (id) => {
    console.log('adding new node to tree ' + id);
    //this.setState()
  }
  render() {
    return (
      <div>
        <HeaderBar />
        <MenuBar />
        <button onClick={this.addTree} >Add Tree</button>
        <span>Left tree is {this.state.tree1}</span>
        <DndProvider backend={HTML5Backend}>
          <SplitterLayout primaryIndex={1} secondaryInitialSize={200}>
            <Tools trees={this.state.trees} treenum={this.state.treenum} tree1={this.state.tree1} tree2={this.state.tree2} 
              handler1={this.changeLeftTree} handler2={this.changeRightTree}/>
            <SplitterLayout secondaryInitialSize={350}>
              <SplitterLayout percentage='true'>
                <Board tree={this.state.trees[this.state.tree1]}/>
                <Board tree={this.state.trees[this.state.tree2]}/>
              </SplitterLayout>
              <AppChat/>
            </SplitterLayout>
          </SplitterLayout>
        </DndProvider>
      </div>
    );
  }
}

export default Main;