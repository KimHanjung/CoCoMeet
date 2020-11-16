import React, { Component } from 'react';
import { Link, Route, BrowserRouter as Router } from "react-router-dom";
import './enter.css'

class Enter extends Component {
    constructor(props) {
        super(props);
        this.state = {msg:'', uname: this.props.uname, channel:this.props.channel, chatList:[]};
    }
    render() {
        return (
            <body>
            <div className="page-container">
            <div className="login-form-container shadow">
                <div className="login-form-right-side">
                    <div className="top-logo-wrap">
                        
                    </div>
                    <h1>Welcome to COCOMEET!</h1>
                    <p>Convenient Co-work!<br/>COCOMEET is the best web meeting flatform. Discuss through chatting and organize the content easily. 'We are smarter than me.'</p>
                </div>
                <div className="login-form-left-side">
                    <div className="login-input-container">
                        <div className="login-input-wrap input-id">
                            <i className="far fa-envelope"></i>
                            <input placeholder="Nickname" type="text"/>
                        </div>
                        <div className="login-input-wrap input-password">
                            <i className="fas fa-key"></i>
                            <input placeholder="Channel Code"  type="password"/>
                        </div>
                    </div>
                    <div className="login-btn-wrap">
                        <Link to="/main">
                            <button className="login-btn">ENTER</button>
                        </Link>
                        <Link to="/">Back</Link>
                    </div>
                </div>
            </div>
        </div>
        </body>
        );
    }
}

export default Enter;