import React, { Component } from 'react';
import SortableTree, { addNodeUnderParent, removeNodeAtPath, changeNodeAtPath } from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
//import Text from './Text';
//import EditableText from './EditableText';
const firstNames = [
  'Abraham',  'Adam',
  'Agnar',  'Albert',
  'Albin',  'Albrecht',
  'Alexander',  'Alfred',
  'Alvar',  'Ander',
  'Andrea',  'Arthur',
  'Axel',  'Bengt',
  'Bernhard',  'Carl',
  'Daniel',  'Einar',
  'Elmer',  'Eric',
  'Erik',  'Gerhard',
  'Gunnar',  'Gustaf',
  'Harald',  'Herbert',
  'Herman',  'Johan',
  'John',  'Karl',
  'Leif',  'Leonard',
  'Martin',  'Matt',
  'Mikael',  'Nikla',
  'Norman',  'Oliver',
  'Olof',  'Olvir',
  'Otto',  'Patrik',
  'Peter',  'Petter',
  'Robert',  'Rupert',
  'Sigurd',  'Simon',
];

const defaultName = 'default';
class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [
        //{ title: <EditableText initialValue='Peter Olofsson'/> }, 
        //{ title: <EditableText initialValue='Karl Johansson'/> }
        { id: 1, title: 'Peter Olofsson' }, 
        { id: 2, title: 'Karl Johansson' }
      ],
      addAsFirstChild: false,
    };
    //this.add = this.add.bind(this)
    //this.showinfo = this.showinfo.bind(this);
    //this.edit = this.edit.bind(this)
  }
  //add(){
  //  var tmp = this.state.treeData;
  //  this.setState({treeData: this.state.treeData.concat([{ title: <EditableText initialValue='new text box'/>, children: []}])});
  //}
  /*showinfo(){
    alert(this.state.treeData);
  }
  edit(){
    alert(' click');
  }*/
  render() {
    const TEAM_COLORS = ['Red', 'Black', 'Green', 'Blue'];
    const getNodeKey = ({ treeIndex}) => treeIndex;
    const getdefaultName = () => defaultName;
    const getRandomName = () => firstNames[Math.floor(Math.random() * firstNames.length)];
    return (
      <div style={{ height: 500 }}>
        <button
          onClick={() =>
            this.setState(state => ({
              treeData: state.treeData.concat({
                title: `${getRandomName()} ${getRandomName()}sson`,

              }),
            }))
          }
        >
          Add
        </button>
        <br />
        <label htmlFor="addAsFirstChild">
          Add new nodes at start
          <input
            name="addAsFirstChild"
            type="checkbox"
            checked={this.state.addAsFirstChild}
            onChange={() =>
              this.setState(state => ({
                addAsFirstChild: !state.addAsFirstChild,
              }))
            }
          />
        </label>
        <SortableTree
          treeData={this.state.treeData}
          onChange={treeData => this.setState({ treeData })}
          getNodeKey={getNodeKey}
          generateNodeProps={({ node, path }) => {
            const rootLevelIndex =
              this.state.treeData.reduce((acc, n, index) => {
                if (acc !== null) {
                  return acc;
                }
                if (path[0] === n.id) {
                  return index;
                }
                return null;
              }, null) || 0;
            const playerColor = TEAM_COLORS[rootLevelIndex];

            return {
              style: {
                boxShadow: `0 0 0 4px ${playerColor.toLowerCase()}`,
                
              },
              
              onClick: () => {
                this.setState(state => ({
                  treeData: changeNodeAtPath({
                    treeData: state.treeData,
                    path,
                    getNodeKey,
                    newNode: { ...node, expanded: !node.expanded },
                  }),
                }));
              },
            };
            
          }}
        />
      </div>
    );
  }
}

export default Board;