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
    //console.log("here is fine", this.props.pdfdata)
    for(let i=0;i<this.props.treenum;i++){
      i = String(i)
      if (i===this.props.tree1) {
        if (i===this.props.pdfdata.treeid){
          treearray.push(<div key = {i} class="w-full text-red"><Tree treeId={i} room_id={this.props.room_id} channel={this.props.channel} pdfdata={this.props.pdfdata} reset_pdfdata={this.props.reset_pdfdata}/></div>);
        }
        else {
          treearray.push(<div key = {i} class="w-full text-red"><Tree treeId={i} room_id={this.props.room_id} channel={this.props.channel} pdfdata={[]} reset_pdfdata={this.props.reset_pdfdata}/></div>);
        }
      }
      else if (i===this.props.tree2){
        if (i===this.props.pdfdata.treeid){
          treearray.push(<div key = {i} class="w-full text-blue-500"><Tree treeId={i} room_id={this.props.room_id} channel={this.props.channel} pdfdata={this.props.pdfdata} reset_pdfdata={this.props.reset_pdfdata}/></div>);
        }
        else treearray.push(<div key = {i} class="w-full text-blue-500"><Tree treeId={i} room_id={this.props.room_id} channel={this.props.channel} pdfdata={[]} reset_pdfdata={this.props.reset_pdfdata}/></div>);
      }
      else {
        if (i===this.props.pdfdata.treeid){
          treearray.push(<div key = {i} class="w-full"><Tree treeId={i} room_id={this.props.room_id} channel={this.props.channel} pdfdata={this.props.pdfdata} reset_pdfdata={this.props.reset_pdfdata}/></div>);
        }
        else treearray.push(<div key = {i} class="w-full"><Tree treeId={i} room_id={this.props.room_id} channel={this.props.channel} pdfdata={[]} reset_pdfdata={this.props.reset_pdfdata}/></div>);
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