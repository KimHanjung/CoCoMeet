import React, { Component } from 'react';
import { Link, Route, BrowserRouter as Router } from "react-router-dom";
import './enter.css'
import io from 'socket.io-client';

const socket = io('http://localhost:4002/');
class Create extends Component {
    constructor(props) {
        super(props);
        this.state = {uname: 'default', channel_name:'default'};
        this.send = this.send.bind(this);
    }
    send(){
        socket.emit('createChannel', {channel_name:this.state.channel_name, uname:this.state.uname});
        alert(this.state.uname+' '+this.state.channel_name);
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
                            <input placeholder="Nickname" type="text" onChange={(e)=>this.setState({uname: e.target.value})}/>
                        </div>
                        <div className="login-input-wrap input-id">
                            <i className="far fa-envelope"></i>
                            <input placeholder="Channel Name" type="text" onChange={(e)=>this.setState({channel_name: e.target.value})}/>
                        </div>
                    </div>
                    <div className="login-btn-wrap">
                        <Link to="/main">
                            <button className="login-btn" onClick={this.send}>START</button>
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

export default Create;