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
            height: '100vh',
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
        //this.add = this.add.bind(this)
        
    }
    //add(){
        //console.log('adding new node to tree ' + this.props.treeId);
        //this.setState({treeData: this.state.treeData.concat([{ title: <EditableText initialValue='Sun'/>, children: []}])});
        //const newtree = treeData.concat([{ title: <EditableText initialValue='new text box'/>, children: []}])
    //    let newtreeData = this.state.treeData
    //    this.props.addNode(this.props.treeId, newtreeData)
    //}
    componentWillReceiveProps(nextProps) {
        this.setState({ treeData: nextProps.tree.treeData });
    }
    render() {
        const { connectDropTarget, hovered } = this.props;
        const getNodeKey = ({ treeIndex}) => treeIndex;
        return connectDropTarget(
                <div class="h-full w-full float-left">
                    <div class='pl-8 pt-3'>
                        <button class="bg-transparent hover:bg-blue-500 text-blue-500 font-semibold hover:text-white py-2 px-2 border border-blue-500 hover:border-transparent rounded"
                            onClick={this.props.updateNode}>
                            Add Block
                        </button>
                    </div>
                  
                    <TrashNodeComponent>
                    <div class="h-6/9 w-8/9">
                        
                        <SortableTree
                            treeData={this.state.treeData}
                            onChange={treeData => this.setState({ treeData }),this.props.updateNode}
                            
                            scaffoldBlockPxWidth={20}
                            generateNodeProps={({node, path}) => {
                                return {
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
                        
                    </div>
                    <UExternalComponent node={{ title: 'Suns Apple' }} />← 드래그
                    </TrashNodeComponent>
                    
                </div>

        );
    }
}

export default DropTarget(toolsNodeType, toolsNodeSpec, toolsNodeCollect)(React.memo(BoardIxternal));