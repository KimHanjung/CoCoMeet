import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
//import PrintTree from './pdf.js'
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import d2 from "./D2Coding.ttf";
import d2_bold from "./D2CodingBold.ttf";
import Icon from "./down1.svg"
import ComIcon from "./down2.svg"
import io from 'socket.io-client';

const socket = io('http://localhost:4002/board_server');
var tree_data = 
  [ 
    { room_id: '0',
      node_id: '3',
      tree_id: '0',
      title: 'newNode',
      parent: 'NULL',
      color: 'blue',
      weight: 'normal',
      deco: 'normal' 
    },
    { 
      room_id: '0',
      node_id: '5',
      tree_id: '0',
      title: 'ㅁㄴ야러ㅏㅁ넝셨습니다.',
      parent: 'NULL',
      color: 'gray',
      weight: 'bold',
      deco: 'normal'
    },
    { 
      room_id: '0',
      node_id: '6',
      tree_id: '0',
      title: '가나다라마바사아자차카타파하 가나다라마바사아자차카타파하 가나다라마바사아자차카타파하 가나다라마바사아자차카타파하 가나다라마바사아자차카타파하 가나다라마바사아자차카타파하 가나다라마바사아자차카타파하',
      parent: '5',
      color: 'gray',
      weight: 'bold',
      deco: 'normal'
    },
    { 
      room_id: '0',
      node_id: '7',
      tree_id: '0',
      title: 'ㅁㄴ야러ㅏㅁ넝셨습니다.',
      parent: '5',
      color: 'gray',
      weight: 'bold',
      deco: 'normal'
    },
    { 
      room_id: '0',
      node_id: '8',
      tree_id: '0',
      title: 'ㅁㄴ야러ㅏㅁ넝셨습니다.',
      parent: '7',
      color: 'gray',
      weight: 'bold',
      deco: 'normal'
    },
    { 
      room_id: '0',
      node_id: '9',
      tree_id: '0',
      title: 'ㅁㄴ야러ㅏㅁ넝셨습니다.',
      parent: '8',
      color: 'gray',
      weight: 'bold',
      deco: 'normal'
    },
    { 
      room_id: '0',
      node_id: '10',
      tree_id: '0',
      title: 'ㅁㄴ야러ㅏㅁ넝셨습니다.',
      parent: '8',
      color: 'gray',
      weight: 'bold',
      deco: 'normal'
    },
    { 
      room_id: '0',
      node_id: '11',
      tree_id: '0',
      title: 'ㅁㄴ야러ㅏㅁ넝셨습니다.',
      parent: '10',
      color: 'gray',
      weight: 'bold',
      deco: 'normal'
    },
    { 
      room_id: '0',
      node_id: '12',
      tree_id: '0',
      title: 'ㅁㄴ야러ㅏㅁ넝셨습니다.',
      parent: 'NULL',
      color: 'gray',
      weight: 'bold',
      deco: 'normal'
    },
    { 
      room_id: '0',
      node_id: '13',
      tree_id: '0',
      title: 'ㅁㄴ야러ㅏㅁ넝셨습니다.',
      parent: '12',
      color: 'gray',
      weight: 'bold',
      deco: 'normal'
    },
    { 
      room_id: '0',
      node_id: '14',
      tree_id: '0',
      title: 'ㅁㄴ야러ㅏㅁ넝셨습니다.',
      parent: 'NULL',
      color: 'gray',
      weight: 'bold',
      deco: 'normal'
    },
    { 
      room_id: '0',
      node_id: '14',
      tree_id: '0',
      title: 'ㅁㄴ야러ㅏㅁ넝셨습니다.',
      parent: 'NULL',
      color: 'gray',
      weight: 'bold',
      deco: 'normal'
    },
    { 
      room_id: '0',
      node_id: '14',
      tree_id: '0',
      title: 'ㅁㄴ야러ㅏㅁ넝셨습니다.',
      parent: 'NULL',
      color: 'gray',
      weight: 'bold',
      deco: 'normal'
    },
    { 
      room_id: '0',
      node_id: '14',
      tree_id: '0',
      title: 'ㅁㄴ야러ㅏㅁ넝셨습니다.',
      parent: 'NULL',
      color: 'gray',
      weight: 'bold',
      deco: 'normal'
    },
  ];
const spec = {
  beginDrag(props) {
    const item = { ...props };
    console.log('beginDrag', item.treeId, typeof(item.treeId))
    return props;
  },
  /*endDrag(props, monitor, component) {
    console.log('dropped ' + component);
    if (!monitor.didDrop()) {
      return;
    }
    
    return props.handleDrop(props.tree.treeId);
    
  },*/
  
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  }
}

class Tree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      select: true,
    }
    this.emitdata = this.emitdata.bind(this);
  }
  emitdata = () =>{
    console.log("inside emit data")
    socket.emit('download',{channel: this.props.channel, room_id: this.props.room_id, tree_id: this.props.treeId})
    
    tree_data = [ 
    { room_id: '0',
      node_id: '3',
      tree_id: '0',
      title: 'newNode',
      parent: 'NULL',
      color: 'blue',
      weight: 'normal',
      deco: 'normal' 
    }
    ];
    // while(this.props.pdfdata.length === 0){
    //   console.log("props로 아직 안넘어옴")
    // }
    this.setState({select:false})
  }
  
  render() {
    const { isDragging, connectDragSource } = this.props;
    const opacity = isDragging ? 0 : 1;
    // const data = tree_data;
    // console.log("채널 확인", this.props.channel)
    // console.log("룸 확인", this.props.room_id)
    // console.log("트리아이디 확인", this.props.treeId)
    const convert =(data)=>{
      //console.log("aslkfjsalkdj")
      // data=tree_data
      console.log("pdf data", data)
      let i = 0;
      let dic = {};
      let result = [];
      while (i < data.length) {
        let margintop = 0
        if(data[i].parent==='NULL'){
          dic[data[i].node_id] = 0;
          margintop = 20
        }
        else{
          dic[data[i].node_id] = dic[data[i].parent] + 1;
        }
        let margin = 70 + (dic[data[i].node_id] * 30);
        let title = data[i].title;
        let level = dic[data[i].node_id];
        let font = 0;
        if (level === 0) {title = '# '+title; font = 6;}
        else if (level === 1) {title = '● '+title; font = 4;}
        else if (level === 2) {title = '○ '+title; font = 2;}
        else {title = '- '+title}
    
        Font.register(
          {
          family: "D2",
          format: "truetype",
          fonts: [
            { src: d2 },
            { src: d2_bold, fontWeight: 'bold' },
            ]
          }
        );
        result.push(
        <View style={{
          marginLeft: margin,
          marginTop: 3+margintop,
    
          fontSize: 11 + font,
          textDecoration: data[i].deco,
          fontWeight: data[i].weight,
  
          backgroundColor: 'white',
          width: 600,
          height: 20,
          display: 'block',
          justifyContent: 'center',
          
        }}>
          <Text style={{color:data[i].color, fontFamily:'D2'}}>{title}</Text>
        </View>);
        i = i + 1;
      }
      return(result);
    }

    const MyDoc = () => (

      <Document>
        <Page size="A4" style={{flexDirection: 'column', backgroundColor: 'white'}}>
        <View style={{
          marginTop: 50,
          marginBottom: 20,
          textAlign: 'center',
          fontWeight: 'bold',
          height: 50,
          display: 'block',
          justifyContent: 'center',
          
        }}>
        <Text style={{color:'black', font: 30, fontFamily:'D2'}}>회의록 {this.props.treeId}</Text>
        </View>
        {convert(this.props.pdfdata.tree) /*data = socket emit으로 받은 정보*/} 
        </Page>
      </Document>

    );

    return connectDragSource(
      <div class="flex">
        <div class="w-1/2 ml-2" style={{ opacity }}>
          <span>회의록 {this.props.treeId}</span>
        </div>
        <div class="w-1/2 ml-2 pl-2">
        <div className="App">
          {this.state.select || this.props.pdfdata.treeid === undefined ? <img onClick={this.emitdata} src={Icon} width='16' height='12'/>:
            <PDFDownloadLink document={<MyDoc/>} fileName={"회의록 "+String(this.props.treeId)+"번.pdf"}>
              {({ blob, url, loading, error }) => <img onClick={()=>{this.setState({select:true});this.props.reset_pdfdata();console.log(loading, error, url)}} src={ComIcon} width='16' height='12'/>}
            </PDFDownloadLink>
          }
        </div>
          {/*<PrintTree treeId={this.props.treeId} room_id={this.props.room_id} channel={this.props.channel}/>*/}
        </div>
      </div>
    );
  }
}

export default DragSource('tree', spec, collect)(Tree);
