//client/components/Chat.js
import React from 'react';
import axios from 'axios';
import ChatLookUp from './ChatLookUp';
import ChatInput from './ChatInput';

import '../styles/Chat.css';

var timer;

//This component is responsible for grabbing initial and continuous chat data
//by repeatedly scheduling a timed request as prescribed by youtube's API.
//Also supports the ability to render chat db search results by clicking on a username
//in the chat pane.
class Chat extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			message:"",
			nextPageToken:null,
			requestInterval:null,
			chats:null,
			error:false,
			search:"",
			hype:0.00,
		}
		this.setUpdate = this.setUpdate.bind(this);
		this.nextChats = this.nextChats.bind(this);
		this.getChats = this.getChats.bind(this);
		this.clearAndResetUpdate = this.clearAndResetUpdate.bind(this);
		this.showMessages = this.showMessages.bind(this);
	}
	//Schedule chat message next page request.
	setUpdate(timeInterval){
		clearTimeout(timer);
		timer = setTimeout(function(){
			this.nextChats();
		}.bind(this), timeInterval);
	}
	//Clear the scheduled chat update and make a request for chats immediately.
	//Used as handler method after sending chats.
	clearAndResetUpdate(){
		clearTimeout(timer);
		this.getChats();	
	}
	/*
		Function takes target value which is a username and passes it as a prop to
		the ChatLookUp component to run the database search and open the modal.
	*/
	showMessages(e){
		this.setState({search:e.target.innerHTML});
	}
	/*	Method to make the initial chat get request from the server.
		If there is a 403 error method will try to recover from it by
		setting a 4 second request interval and trying the page request again.
		Grabs the polling interval time and page token from response.
	*/
	getChats(){
		if(authed){
			axios.get(`${window.location.protocol}//${window.location.host}/getchats/${this.props.chatID}`)
			.then(res => {
				if(res.data.hasOwnProperty('error')){
					if(res.data.error.code == 403) {
						clearTimeout(timer);
						this.setState({
							error:false,
							requestInterval:4000
			    		});
				    } else {
						this.setState({ error:true });
				    }
				} else {
					this.setState({
			    		nextPageToken:res.data.nextPageToken,
						requestInterval:res.data.pollingIntervalMillis,
			    		chats:res.data.items
			    	});
				}
		    });
		}
	}
	/*	Make request for next page of chats from the server.
		If there is a 403 error method will try to recover from it by
		setting a 4 second request interval and trying the page request again.
		Grabs the polling interval time and page token from response.
	*/
	nextChats(){
		axios.get(`${window.location.protocol}//${window.location.host}/nextchats/${this.props.chatID}/${this.state.nextPageToken}`)
		.then(res => {
			if(res.data.hasOwnProperty('error')){
				if(res.data.error.code == 403) {
					clearTimeout(timer);
					this.setState({
						error:false,
						requestInterval:4000
			    	});
			    } else {
					this.setState({ error:true });
			    }
			} else {
				let newChats = this.state.chats.concat(res.data.items);
				let CPS = (res.data.pageInfo.totalResults / (this.state.requestInterval/1000)).toFixed(2);
				this.setState({
		    		nextPageToken:res.data.nextPageToken,
					requestInterval:res.data.pollingIntervalMillis,
		    		chats:newChats,
		    		hype:CPS
			    });
			}
		});
	}
	//Make initial chat request
	componentDidMount() {
		this.getChats();
	}
	/*
		if there is no error and no db search generated from chat panel,
		schedule a chat message update request using the polling interval and token.
		Google requires the api to wait out the polling interval before making an additional
		request or else it will give a 403 error.
	*/
	componentDidUpdate(){
		if(!this.state.error && this.state.search.length == 0){
			this.setUpdate(this.state.requestInterval);
			let objDiv = document.getElementById("chat-messages");
			if(objDiv) objDiv.scrollTop = objDiv.scrollHeight;
		} else {
			this.state.search = "";
		}
		
	}

	render(){
		if(this.state.error){
			return (
				<div id="chat-pane">
					<div>
						<h3 className="text-center">Chat is not available for this stream.</h3>
					</div>
				</div>
			);
		}
		if(this.state.chats){
			let chats = this.state.chats;
			return (
				<div id="chat-pane">
					<div><span><svg className="hype" viewBox="0 0 576 512"><path d="M288 32C129 32 0 125.1 0 240c0 49.3 23.7 94.5 63.3 130.2-8.7 23.3-22.1 32.7-37.1 43.1C15.1 421-6 433 1.6 456.5c5.1 15.4 20.9 24.7 38.1 23.3 57.7-4.6 111.2-19.2 157-42.5 28.7 6.9 59.4 10.7 91.2 10.7 159.1 0 288-93 288-208C576 125.1 447.1 32 288 32zm0 368c-32.5 0-65.4-4.4-97.3-14-32.3 19-78.7 46-134.7 54 32-24 56.8-61.6 61.2-88.4C79.1 325.6 48 286.7 48 240c0-70.9 86.3-160 240-160s240 89.1 240 160c0 71-86.3 160-240 160zm-64-160c0 26.5-21.5 48-48 48s-48-21.5-48-48 21.5-48 48-48 48 21.5 48 48zm112 0c0 26.5-21.5 48-48 48s-48-21.5-48-48 21.5-48 48-48 48 21.5 48 48zm112 0c0 26.5-21.5 48-48 48s-48-21.5-48-48 21.5-48 48-48 48 21.5 48 48z"/></svg></span> <span className="hype-number">{this.state.hype}</span> msgs per second</div>
					<div id="chat-messages">
						{chats.map(chat => {
					        return (
					            <div className="message" key={chat.id}><img src={chat.authorDetails.profileImageUrl} className="chat-pic"/><div className="chat-msg"><strong><span className="search-user-click site-link" onClick={this.showMessages}>{chat.authorDetails.displayName}</span></strong> : {chat.snippet.displayMessage}</div></div>
					        )
					    })}
					</div>
					<div className="chat-ui">
						<ChatInput handleMsg={this.clearAndResetUpdate} chatID={this.props.chatID}/>
						<ChatLookUp chatId={this.props.chatID} searchName={this.state.search}/>
					</div>
				</div>
			);
		} else {
			return (<div></div>);
		}
	}
}

export default Chat;