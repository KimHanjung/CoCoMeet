import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { SortableTreeWithoutDndContext as SortableTree } from 'react-sortable-tree';
//import { addNodeUnderParent, removeNodeAtPath, changeNodeAtPath } from 'react-sortable-tree';
//import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import CustomTheme from 'react-sortable-tree-theme-solverboard';

const defaultName = 'Default';

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
            padding: 50,
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

//main class
class BoardExternal extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          treeData: [
            { title: 'Sunny', expanded: true, children: [{ title: 'rainy' }] },
            { title: 'Many' },
            { title: 'Yummy'}],
        };
    }
    
    render() {
        const getNodeKey = ({ treeIndex}) => treeIndex;
        const getdefaultName = () => defaultName;
        return (
            <DndProvider backend={HTML5Backend}>
                <div>
                    <button
                        onClick={() =>
                            this.setState(state => ({
                                treeData: state.treeData.concat({
                                    title: `${getdefaultName()} Sun`,
                                }),
                            }))
                        }
                    >
                    Add
                    </button>
                    <TrashNodeComponent>
                    <div style={{ height: 600 }}>
                        <SortableTree
                        treeData={this.state.treeData}
                        onChange={treeData => this.setState({ treeData })}
                        theme={CustomTheme}
                        dndType={trashNodeType}
                        />
                    </div>
                    <UExternalComponent node={{ title: 'Suns Apple' }} />← 드래그
                    </TrashNodeComponent>
                
                </div>
            </DndProvider>
        );
    }
}

export default BoardExternal;