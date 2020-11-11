import React, { Component } from 'react';
import './ChatView.css';

import io from 'socket.io-client';

const socket = io('http://localhost:4002/');
//const socket = io('http://3.34.138.234:4000/');
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
        if(this.state.msg!=""){
            console.log("client-send_sun: "+this.state.msg+", "+this.state.channel+", "+this.state.uname);
            socket.emit('send',{msg:this.state.msg, channel:this.state.channel, uname:this.state.uname});
            this.setState({msg:''});
            document.querySelector(".inputMsg").value="";
        }else if(this.state.msg==""){
            return;
        }
        
    }
    keysend(event){
        if(this.state.msg!=""){
            if(event.keyCode===13) {
                console.log("client-keysend_sun: "+this.state.msg+", "+this.state.channel+", "+this.state.uname);
                socket.emit('send',{msg:this.state.msg, channel:this.state.channel, uname:this.state.uname});
                this.setState({msg:''});
                document.querySelector(".inputMsg").value="";
            }
        }else if(this.state.msg==""){
            return;
        }
    }
    inputMSG(event) {
        //console.log("client-inputMSG_sun");
        this.setState({ msg: event.target.value });
        console.log("event: "+this.state.msg);
    }
    render() {
        let list = this.state.chatList.map((item, index) =>{
            let date= new Date(item.chat.date);
            return(
                <div key={index}>
                    {item.chat.uname==this.state.uname?
                    <div class="flex flex-row-reverse">
                        <div>{item.chat.uname}</div>
                    </div>
                    :
                    <div class="flex flex-row">
                        <div>{item.chat.uname}</div>
                    </div>
                   }
                   
                    {item.chat.uname==this.state.uname?
                    <div class="flex items-end flex-row-reverse">
                        <button type="button" class="max-w-4/5 bg-blue-500 mb-3 ml-1 p-2 text-left text-white text-base font-bold border-none rounded-lg break-words" value={item.chat.msg} onClick={(e)=>this.props.OnupdateMsgToBlock(e.target.value)}>{item.chat.msg}</button>
                        <div class="mb-2">{date.getHours()}시 {date.getMinutes()}분</div>
                    </div>
                    :
                    <div className="flex items-end flex-row">
                        <button type="button" class="max-w-4/5 bg-blue-500 mb-3 ml-1 p-1 text-left text-white text-base font-bold border-none rounded break-words" value={item.chat.msg} onClick={(e)=>this.props.OnupdateMsgToBlock(e.target.value)}>{item.chat.msg}</button>
                        <div class="mb-2">{date.getHours()}시 {date.getMinutes()}분</div>
                    </div>
                   }
                </div>
            )

        });
        return (
            <div class="h-fullcalc">
                <div class="h-8/9 mx-2">
                    <div className="chattingView-chat">{list}</div>
                </div>
                <div class="flex h-1/9 w-full bg-gray-200">
                    <input type="text" class="pl-4 my-4 ml-4 mr-1 w-7/9 border border-blue-500 rounded-md inputMsg" placeholder="Input message..."  onChange={this.inputMSG} onKeyDown={this.keysend}/>
                    <button  type="button" class="my-4 mr-4 ml-1 w-2/9 bg-transparent hover:bg-blue-500 text-blue-500 font-semibold hover:text-white py-2 px-2 border border-blue-500 hover:border-transparent rounded" onClick={this.send}>보내기</button>
                </div>
            </div>
        );
    }
}

export default React.memo(ChatView);