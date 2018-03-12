//client/components/ChatInput.js
import React from 'react';
import axios from 'axios';
import '../styles/ChatInput.css';

//Responsible for reading input value and sending a message post request to youtube.
class ChatInput extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			message:"",
		}
		this.sendMsg = this.sendMsg.bind(this);
	}
	//Sends a message post request to the server and then calls the callback method that
	//was passed as a prop from Chat.js
	sendMsg(){
		if(this.state.message.length > 0){
				let msg = this.state.message;
				this.setState({message:""}, () => { axios.post(`/sendmessage`, {
						"snippet": {
						    "liveChatId": this.props.chatID,
						    "type": "textMessageEvent",
						    "textMessageDetails": {
						      "messageText": msg
						    }
						}
					})
					.then(res => {							
							if(res.data) {
								this.props.handleMsg();
							}
						}
					)
				}
				);
		}
	}
	//Add event listener to chat field so that chats can be sent when pressing the enter key.
	componentDidMount(){
		let parent = this;
		let chatBtn = document.getElementById('send-chat');
		chatBtn.addEventListener("keyup", function(e) {
		  e.preventDefault();
		  if (e.keyCode === 13) {
		    parent.sendMsg();
		  }
		});
	}
	render(){
		let style={
			paddingRight:0,
			paddingLeft:0
		}
		return (
			<div className="chat-input">
				<div style={{paddingRight:0}}>
					<div className="col-xs-9" style={style}>
						<input id="send-chat" type="text" placeholder="enter message..." value={this.state.message} onChange={ev => this.setState({message: ev.target.value})} />
					</div>
					<div className="col-xs-3" style={style}>
						<button id="send-chat-btn" className="site-button" onClick={this.sendMsg}>Send</button>
					</div>
				</div>
			</div>
		);
	}
}

export default ChatInput;