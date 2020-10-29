import React, { Component } from 'react';
import './ChatView.css';

import io from 'socket.io-client';

// local host의 chat_server와 연결하려고 할 때
 //const socket = io('http://localhost:4002/');
// aws의 chat_server와 연결하려고 할 떄
const socket = io('http://3.34.138.234:4000/');

class ChatView extends Component {
    constructor(props) {
        super(props);
        this.state = {msg:'', uname: this.props.uname, channel:this.props.channel, chatList:[]};
        this.send = this.send.bind(this);
        this.keysend = this.keysend.bind(this);
        this.inputMSG = this.inputMSG.bind(this);
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
    render() {
        let list = this.state.chatList.map((item, index) =>{
            let date= new Date(item.chat.date);
            return(
                <div key={index} className="choose-align">
                    {item.chat.uname==this.state.uname?
                    <div className="chattingView-header-me">
                        <div>{item.chat.uname}</div>
                    </div>
                    :
                    <div className="chattingView-header">
                        <div>{item.chat.uname}</div>
                    </div>
                   }
                   
                    {item.chat.uname==this.state.uname?
                    <div className="chattingView-msg-body-me">
                        <button type="button" className="chattingView-msg-from-me" value={item.chat.msg} onClick={(e)=>this.props.OnupdateMsgToBlock(e.target.value)}>{item.chat.msg}</button>
                        <div className="msgtime">{date.getHours()}시 {date.getMinutes()}분</div>
                    </div>
                    :
                    <div className="chattingView-msg-body-other">
                        <button type="button" className="chattingView-msg" value={item.chat.msg} onClick={(e)=>this.props.OnupdateMsgToBlock(e.target.value)}>{item.chat.msg}</button>
                        <div className="msgtime">{date.getHours()}시 {date.getMinutes()}분</div>
                    </div>
                   }
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

export default React.memo(ChatView);