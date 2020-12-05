import React from "react";
import ReactDOM from "react-dom";
import {
  BlobProvider,
  Document,
  Page,
  StyleSheet,
  Text,
  View
} from "@react-pdf/renderer";
import PSPDFKit from "./PSPDFKit";

import "./styles.css";

const Test = () => {

const data = 
    [ { room_id: '0',
    node_id: '3',
    tree_id: '0',
    title: 'newNode',
    parent: 'NULL',
    color: 'blue',
    weight: 'normal',
    deco: 'normal' },
  { room_id: '0',
    node_id: '5',
    tree_id: '0',
    title: 'd님이 asdf 채널에 입장하셨습니다.',
    parent: 'NULL',
    color: 'blue',
    weight: 'normal',
    deco: 'normal' } ];

    const depth = 2;
// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4"
  },
  section: {
    margin: 30*depth,
    padding: 10,
    flexGrow: 1,
  }
});

// Create Document Component
const MyDocument = (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Hello World!</Text>
      </View>
      <View style={styles.section}>
        <Text>We're inside a PDF!</Text>
      </View>
    </Page>
  </Document>
);

ReactDOM.render(
  <BlobProvider document={MyDocument}>
    {({ blob, url, loading, error }) => {
      if (blob) {
        return <PSPDFKit blob={blob} />;
      }

      if (error) {
        return error;
      }

      return <div>The PDF is rendering...</div>;
    }}
  </BlobProvider>,
  document.getElementById("root")
);
}