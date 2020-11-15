import React, { Component } from 'react';
import { Link, Route, BrowserRouter as Router } from "react-router-dom";

class Enter extends Component {
    constructor(props) {
        super(props);
        this.state = {msg:'', uname: this.props.uname, channel:this.props.channel, chatList:[]};
    }
    render() {
        return (
            <div>
                <Link to="/">
                    <button>뒤로가기</button>
                </Link>
                <Link to="/main">
                    <button>Enter</button>
                </Link>

            </div>
        );
    }
}

export default Enter;