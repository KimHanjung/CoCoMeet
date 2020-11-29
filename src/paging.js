import React, { Component } from 'react';
import Main from './components/main-sun_2020_10_13';
import './main.css';
import Start from './start.js'
import Enter from './enter.js'
import Create from './create_room.js'
import { Route } from 'react-router-dom';

class Paging extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <Route path="/" component={Start} exact/>
                <Route path="/enter" component={Enter} />
                <Route path="/create_room" component={Create} />
                <Route path="/main" component={Main} />
            </div>
        );
    }
}

export default Paging;    