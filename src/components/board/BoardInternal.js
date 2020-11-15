import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditableText from './EditableText';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { SortableTreeWithoutDndContext as SortableTree } from 'react-sortable-tree';
//import { addNodeUnderParent, removeNodeAtPath, changeNodeAtPath } from 'react-sortable-tree';
//import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import CustomTheme from 'react-sortable-tree-theme-solverboard';

const externalNodeType = 'yourNodeType';
const externalNodeSpec = {
    beginDrag: componentProps => ({node: { ...componentProps.node}}),
};
const externalNodeCollect = (connect) => ({
    connectDragSource: connect.dragSource(),
});
//외부 오브젝트 드래그 드래그인 에드 클래스
class externalNodeBaseComponent extends Component {
    render() {
        const {connectDragSource, node } = this.props;
        return connectDragSource(
            <div
                style={{
                    display: 'inline-block',
                    padding: '3px 5px',
                    background: 'red',
                    color: 'white',
                }}
            >
                {node.title}
            </div>,
            {dropEffect: 'copy'}
        );
    }
}
externalNodeBaseComponent.propTypes = {
    node: PropTypes.shape({ title: PropTypes.string }).isRequired,
    connectDragSource: PropTypes.func.isRequired,
};
const UExternalComponent = DragSource(
    externalNodeType,
    externalNodeSpec,
    externalNodeCollect
)(externalNodeBaseComponent);


const trashNodeType = 'yourNodeType';
const trashNodeSpec = {
    drop: (props, monitor) => ({ ...monitor.getItem(), treeId: 'trash'}),
};
const trashNodeCollect = (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver({ shallow: true }),
})
//내부 오브젝트 드래그 드래그아웃 리무브 클래스
class trashNodeBaseComponent extends Component {
    render() {
      const { connectDropTarget, children, isOver } = this.props;
  
      return connectDropTarget(
        <div
          style={{
            height: '100%',
            padding: 30,
            background: isOver ? '#bebec1' : 'transparent',
          }}
        >
          {children}
        </div>
      );
    }
}
trashNodeBaseComponent.propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    isOver: PropTypes.bool.isRequired,
};
const TrashNodeComponent = DropTarget(
    trashNodeType,
    trashNodeSpec,
    trashNodeCollect
)(trashNodeBaseComponent);

const toolsNodeType = 'tree';
const toolsNodeSpec = {
    drop(props, monitor){
        const item = monitor.getItem()
        console.log(monitor.getDropResult());
        props.onDrop(item.treeId)
        return item;
    }
};
const toolsNodeCollect = (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    hovered: monitor.isOver(),
})

const ColorList = ['red', 'orange', 'yellow', 'green', 'blue', 'cyan', 'lime', 'purple'];
const FontDeco = ['none', 'line-through', 'overline', 'underline', 'initial'];
const FontWgt = ['normal', 'bold'];
//main class
class BoardIxternal extends Component {
    constructor(props) {
        super(props);
        this.state = {
          treeData: props.tree.treeData,
          rev_block_color: props.tree.block_color,
          rev_text_deco: props.tree.text_deco,
          rev_font_weight: props.tree.font_weight,
        };
        this.updateTree = this.updateTree.bind(this)
        //this.add = this.add.bind(this)
    }
    updateTree(newTreeData){
        this.props.updateTree(newTreeData)
        this.setState({ newTreeData })
        //console.log(newTreeData)
        this.setState({treeData: newTreeData})
        
    }
    /*add(){
        //console.log('adding new node to tree ' + this.props.treeId);
        this.setState({treeData: this.state.treeData.concat([{ title: <EditableText initialValue='Sun'/>, children: []}])});
        
    }*/
    componentWillReceiveProps(nextProps) {
        this.setState({ treeData: nextProps.tree.treeData });
    }
    render() {
        const { connectDropTarget, hovered } = this.props;
        const backgroundColor = hovered ? 'lightyellow' : 'white';
        const getNodeKey = ({ treeIndex}) => treeIndex;
        
        return connectDropTarget(
        
            <div class="h-fullcalc w-full float-left" >
                <div class='pl-8 pt-3'>
                    <button class="bg-transparent hover:bg-blue-500 text-blue-500 font-semibold hover:text-white py-2 px-2 border border-blue-500 hover:border-transparent rounded"
                        onClick={this.props.updateNode}>
                        Add Block
                    </button>
                </div>
                
                <div class="h-6/9 w-9/9 m-3 p-3" >
                    
                    <SortableTree
                        treeData={this.state.treeData}
                        onChange={treeData => this.updateTree(treeData)}
                        scaffoldBlockPxWidth={20}
                        
                        generateNodeProps={({node, path}) => {
                            return {
                                
                                buttons:[(<input class="mr-6" type="checkbox" ></input>)],
                                style:{
                                    backgroundColor: `${this.state.rev_block_color}`,
                                    border: `1px solid ${this.state.rev_block_color}`,
                                    borderRadius: `8px`,
                                    textDecoration: `${this.state.rev_text_deco}`,
                                    fontSize: `15px`,
                                    fontWeight: `${this.state.rev_font_weight}`,
                                }
                            };
                        }}
                        theme={CustomTheme}
                        dndType={trashNodeType, externalNodeType}
                    />
                    
                    <div class="h-2/9 w-full p-3">
                        <TrashNodeComponent>
                        <a class="flex items-center justify-center bg-transparent text-xl text-blue-500 font-semibold py-2 px-2 border border-blue-500 rounded">
                        <svg class="fill-current w-4 h-4 mr-2" version="1.1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000">
                        <path d="M188.1,869.7c0,65,52.4,120.3,117,120.3h389.9c64.6,0,117-55.4,117-120.3l78-630.1H110.1L188.1,869.7L188.1,869.7z M622.8,361.8h76.5v506h-76.5V361.8L622.8,361.8z M453.7,361.8h92.5v506h-92.5V361.8L453.7,361.8z M300.7,361.8h76.5v506h-76.5V361.8L300.7,361.8z M870.4,86.5H616.9c0,0-17.5-76.5-39-76.5H422c-21.5,0-39,76.5-39,76.5H129.6c-32.3,0-58.5,28.2-58.5,60.7v61.5h857.8v-61.5C928.9,114.8,902.7,86.5,870.4,86.5L870.4,86.5z"/>
                        </svg>
                            <span>trash</span>   
                            
                        </a>
                        </TrashNodeComponent>
                    </div>
                    <UExternalComponent node={{ title: 'Suns Apple' }} />← 드래그
                </div>
                
                
            </div>  
        );
    }
}

export default DropTarget(toolsNodeType, toolsNodeSpec, toolsNodeCollect)(React.memo(BoardIxternal));