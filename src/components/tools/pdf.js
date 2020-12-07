import React from 'react';
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import d2 from "./D2Coding.ttf";
import d2_bold from "./D2CodingBold.ttf";
import Icon from "./download.svg"

function App(props) {

const convert = (data) => {
    console.log(data)
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
      console.log([data[i].node_id, dic[data[i].node_id]]);
      let margin = 70 + (dic[data[i].node_id] * 30);
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
        marginLeft: margin,
        // marginTop: 5,
        marginTop: margintop,
        //padding: 7,
  
        fontSize: 11,
        textDecoration: data[i].deco,
        fontWeight: data[i].weight,
  
        // border: 3,
        // borderRadius: 7,
        // borderColor: data[i].color,
        backgroundColor: 'white',
        width: 600,
        // height: 65,
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
      <Text style={{color:'black', font: 30, fontFamily:'D2'}}>Board {props.data[0].tree_id}</Text>
      </View>
      {convert(props.data)}
      </Page>
    </Document>
  );

  return (
    <div className="App">
      <PDFDownloadLink document={<MyDoc/>} fileName="Board.pdf">
      {({ blob, url, loading, error }) => (loading ? '...': <img
              src={Icon}
              width='20'
              height='14'
            />)}
      </PDFDownloadLink>
    </div>
  );
}

export default App;