import React, { Component } from 'react';
import Tools from './tools/Tools';
import Board from './board/Board';
import MenuBar from "./menu/menu-bar-sun";
import AppChat from "./chat/AppChat";
import HeaderBar from './header/header-bar-sun';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';

class Main extends Component {
  render() {
    return (
      <div>
        <HeaderBar />
        <MenuBar />
        <SplitterLayout primaryIndex={1} secondaryInitialSize={100}>
          <Tools />
          <SplitterLayout secondaryInitialSize={250}>
            <SplitterLayout vertical secondaryInitialSize={250}>
              <div>
                <Board />
              </div>
              <SplitterLayout secondaryInitialSize={250}>
              <div>
                <Board/>
              </div>
              </SplitterLayout>
            </SplitterLayout>
            <AppChat/>      
          </SplitterLayout>
        </SplitterLayout>
      </div>
    );
  }
}

export default Main;