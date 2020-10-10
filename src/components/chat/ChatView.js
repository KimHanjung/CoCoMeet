import React, { Component } from 'react';
//import { Input } from 'react-bootstrap';
import './ChatView.css';
//import img from './chuchuchu.jpg';

import io from 'socket.io-client';

const socket = io('http://localhost:4002/');

class ChatView extends Component {
    constructor(props) {
        super(props);
        this.state = {msg:'', uname: this.props.uname, channel:this.props.channel, chatList:[]};
        this.send = this.send.bind(this);
        this.keysend = this.keysend.bind(this);
        this.inputMSG = this.inputMSG.bind(this);
        this.select_msg_to_block= this.select_msg_to_block.bind(this);
        this.handleClick= this.handleClick.bind(this);
    }
    componentDidMount(){
        let cursor=this;
        socket.emit('channelJoin', {channel:this.props.channel, uname:this.props.uname});
        socket.on('receive', function (data) {
            cursor.setState({chatList:cursor.state.chatList.concat([data])});
            document.querySelector(".chattingView-chat").scrollTo(0,document.querySelector(".chattingView-chat").scrollHeight);
        });
    }
    componentWillReceiveProps(changeProps){
        socket.emit('channelLeave', {channel:this.state.channel, uname:this.state.uname});
        this.setState({channel:changeProps.channel, uname:changeProps.uname},()=>{
            this.setState({chatList:[]});
            socket.emit('channelJoin', {channel:this.props.channel, uname:this.props.uname});
        });
    }
    send(){
        socket.emit('send',{msg:this.state.msg, channel:this.state.channel, uname:this.state.uname});
        this.setState({msg:''});
        document.querySelector(".inputMsg").value="";
    }
    keysend(event){
        if(event.keyCode===13) {
            socket.emit('send',{msg:this.state.msg, channel:this.state.channel, uname:this.state.uname});
            this.setState({msg:''});
            document.querySelector(".inputMsg").value="";
        }
    }
    inputMSG(event) {
        this.setState({ msg: event.target.value });
    }
    select_msg_to_block(msg){
        //alert(msg);
        this.props.onUpdate_msg_to_block(msg);
    }
    handleClick(event){
        event.preventDefault();
        alert(event.target.value);
        this.props.onUpdate_msg_to_block(event.target.value);
    }

    render() {
       // alert('rendering chatview!');
        let list = this.state.chatList.map((item, index) =>{
            let date= new Date(item.chat.date);
            return(
                <div key={index}>
                    {item.chat.uname!=null?
                    <div className="chattingView-header">
                        <div>{item.chat.uname}</div>
                        <div>{date.getFullYear()}년 {date.getMonth()+1}월 {date.getDate()}일 {date.getHours()}:{date.getMinutes()}:{date.getSeconds()}</div>
                    </div>:null}
                    <button type="button" className="chattingView-msg" value={item.chat.msg} onClick={(e) => {e.preventDefault(); this.props.onUpdate_msg_to_block(item.chat.msg)}}>{item.chat.msg}</button>
                </div>
            )
        });
        return (
            <div className="body">
                <div className="chattingView-chatbox">
                <div className="chattingView-chat">{list}</div>
                </div>
                <div className="chattingView-input">
                    <input type="text" className="form-control inputMsg" placeholder="Input message..."  onChange={this.inputMSG} onKeyDown={this.keysend}/>
                    <button type="button" className="btn btn-primary" onClick={this.send}>입력</button>
                </div>
            </div>
        );
    }
}

export default ChatView;