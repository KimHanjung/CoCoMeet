import React, { Component } from 'react';
import SortableTree, { addNodeUnderParent, removeNodeAtPath } from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import Text from './Text';
import EditableText from './EditableText';

const defaultName = 'default';
class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [
        { title: <EditableText initialValue='hello'/>, expanded: true, children: [{ title: <EditableText initialValue='world'/>}]},
        { title: <EditableText initialValue='hello1'/>, expanded: true, children: [{ title: <EditableText initialValue='world1'/>}]}
      ],
    };
    this.add = this.add.bind(this)
    //this.showinfo = this.showinfo.bind(this);
    //this.edit = this.edit.bind(this)
  }
  add(){
    var tmp = this.state.treeData;
    this.setState({treeData: this.state.treeData.concat([{ title: <EditableText initialValue='new text box'/>, children: []}])});
  }
  /*showinfo(){
    alert(this.state.treeData);
  }
  edit(){
    alert(' click');
  }*/
  render() {
    const getNodeKey = ({ treeIndex}) => treeIndex;
    const getdefaultName = () => defaultName;
    return (
      <div style={{ height: 600 }}>
        Board Box
        <button onClick={this.add} >Add</button> 
        
        <SortableTree
          treeData={this.state.treeData}
          onChange={treeData => this.setState({ treeData })}
          generateNodeProps={({ node, path }) => ({
            buttons: [
              <button
                onClick={() =>
                  this.setState(state => ({
                    treeData: removeNodeAtPath({
                      treeData: state.treeData,
                      path,
                      getNodeKey,
                    }),
                  }))
                }
              >
                Remove(아직사용안됨)
              </button>,
            ],
          })}
        />
      </div>
    );
  }
}

export default Board;