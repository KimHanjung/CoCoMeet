import React, { Component } from 'react';
import { Link, Route, BrowserRouter as Router } from "react-router-dom";
import './enter.css'
import io from 'socket.io-client';

//const socket = io('http://localhost:4002/channel_server');
const socket = io('http://3.34.138.234:4000/board_server');

class Enter extends Component {
    constructor(props) {
        super(props);
        this.state = {uname: '', channel_code:'', channel_name:undefined};
        this.send = this.send.bind(this);
        this.keysend = this.keysend.bind(this);
    }
    send(){
        if(this.state.uname !== "" && this.state.channel_code !== ""){
        socket.emit('joinChannel', {channel_code:this.state.channel_code}, (name, room_id, channel_name) => {
            this.setState({channel_name: name}, () => {
                this.props.history.push('/main', 
                    {channel: channel_name, channel_code:this.state.channel_code, uname:this.state.uname, room_id:room_id});
            });
        });
        }else{
            alert("모든 필드를 채워주세요");
        }
        
    }
    keysend(event){
        //event.key==="Enter"
        if(event.key==="Enter") {
            if(this.state.uname !== "" && this.state.channel_code !== ""){
            // console.log("enter enter send")
            socket.emit('joinChannel', {channel_code:this.state.channel_code}, (name, room_id, channel_name) => {
                this.setState({channel_name: name}, () => {
                    this.props.history.push('/main', 
                        {channel: channel_name, channel_code:this.state.channel_code, uname:this.state.uname, room_id:room_id});
                });
            });
            }
            else {
                alert("모든 필드를 채워주세요")
            }
        }
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
                        <div className="login-input-wrap input-password">
                            <i className="fas fa-key"></i>
                            <input placeholder="Channel Code" type="text" onChange={(e)=>this.setState({channel_code: e.target.value})} onKeyPress={this.keysend}/>
                        </div>
                    </div>
                    <div className="login-btn-wrap">
                        <button className="login-btn" onClick={this.send}>ENTER</button>
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