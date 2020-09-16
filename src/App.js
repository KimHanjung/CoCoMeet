import React from 'react';
import Header from './components/header/Header'
import Tools from './components/tools/Tools'
import Board from './components/board/Board'
import Chat from './components/chat/Chat'
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';
import './style/App.css';

function App() {
  const name = 'CoCoMeet';

  return (
    <>
      <Header name={name}/>
      <SplitterLayout primaryIndex={1} secondaryInitialSize={200}>
        <Tools />
        <SplitterLayout secondaryInitialSize={350}>
            <Board />
            <Chat />
        </SplitterLayout>
        </SplitterLayout>
    </>
  );
}

export default App;