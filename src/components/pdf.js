import React from 'react';
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import d2 from "./D2Coding.ttf";
import d2_bold from "./D2CodingBold.ttf";


const tree_data = 
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

const convert = (data) => {
  let i = 0;
  let dic = {};
  let result = [];
  while (i < data.length) {

    if(data[i].parent==='NULL'){
      dic[data[i].node_id] = 0;
    }
    else{
      dic[data[i].node_id] = dic[data[i].parent] + 1;
    }
    console.log([data[i].node_id, dic[data[i].node_id]]);
    let margin = 10 + (dic[data[i].node_id] * 30);

    //let title = iconv.decode(data[i].title, 'ascii').toString();
    let title = data[i].title;

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
      //textAlign: 'center',
      marginLeft: margin,
      marginTop: 5,
      padding: 7,

      fontSize: 11,
      textDecoration: data[i].deco,
      fontWeight: data[i].weight,

      border: 3,
      borderRadius: 7,
      borderColor: data[i].color,
      backgroundColor: 'white',
      width: 400,
      height: 65,
      display: 'block',
      justifyContent: 'center',
      
    }}>
      <Text style={{fontFamily:'D2', maxWidth: 385, textOverflow: 'ellipsis', whiteSpace: 'normal'}}>{title}</Text>
    </View>);
    i = i + 1;
  }
  return(result);
}

const MyDoc = () => (
  <Document>
    <Page size="A4" style={{flexDirection: 'column', backgroundColor: '#E4E4E4'}}>
    {convert(tree_data)}
    </Page>
  </Document>
);

function App() {
  return (
    <div className="App">
      <PDFDownloadLink document={<MyDoc/>} fileName="tree.pdf">
      {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download now!')}
    </PDFDownloadLink>
    </div>
  );
}

export default App;