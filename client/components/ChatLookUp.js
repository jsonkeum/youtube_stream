//client/components/ChatLookUp.js
import React from 'react';
import axios from 'axios';
import '../styles/ChatLookUp.css';
const Col = require('react-bootstrap/lib/Col');
const Row = require('react-bootstrap/lib/Row');
const Modal = require('react-bootstrap/lib/Modal');
const Button = require('react-bootstrap/lib/Button');
const FormControl = require('react-bootstrap/lib/FormControl');
const FormGroup = require('react-bootstrap/lib/FormGroup');

//Responsible for extracing input value and sending message search requests to the server
class ChatLookUp extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			showModal:false,
			message:"Search Chat Log by Username",
			chats:[],
			username:"",
			user:{
				pic:"",
				name:"",
				url:"",
			}
		}
		this.close = this.close.bind(this);
    	this.open = this.open.bind(this);
    	this.searchName = this.searchName.bind(this);
		this.pressSearch = this.pressSearch.bind(this);
	}
	//Closes look up modal and resets all state data.
	close() {
	    this.setState({ 
	    	showModal:false,
			message:"Search Chat Log by Username",
			chats:[],
			username:"",
			user:{
				pic:"",
				name:"",
				url:"",
			} 
		});
	};
	open() {
	    this.setState({ showModal: true });
	};
	//Handles key up Enter event for sending search requests.
	pressSearch(e){
	    if (e.keyCode === 13) {
	    	this.searchName(e.target.value);
	    } else {
	    	this.setState({username: e.target.value})
	    }
	}

	/*
		Methodto send and receive search request/results from the chat database. If a parameter is not provided 
		from Chat.js (username), it will grab the value of the input field and make a call to the server, then set
		the resulting data as new states.
	*/
	searchName(userName) {
		let parent = this;
		let search;
		if(typeof userName === 'string') search = userName;
		else search = document.getElementById("userName").value;
		if(authed && search.length > 0){
			axios.get(`http://localhost:8080/getuserchats/${this.props.chatId}/${encodeURIComponent(search)}`)
			.then(function(res){
				if(res.data.found){
					parent.setState({
						showModal: true,
						message:res.data.message,
						chats:res.data.chats,
						username:search,
						user:{
							pic:res.data.userDetails.profileImageUrl,
							name:res.data.userDetails.displayName,
							url:res.data.userDetails.channelUrl
						}

					})
				} else {
					parent.setState({ 
						showModal: true,
						message:res.data.message,
						chats:[],
						username:"",
						user:{
							pic:"",
							name:"",
							url:""
						} 
					});
				}
			});
		}
	}
	//Contains a check to prevent unnecessary repeated search calls.
	componentDidUpdate(prevProps, prevState){
		if(this.props.searchName.length > 0 && prevProps.searchName.localeCompare(this.props.searchName) != 0){
			this.searchName(this.props.searchName);
		}
	}
	render(){
		let header = <Modal.Title>{this.state.message}</Modal.Title>;
		if(this.state.user.name.length > 0){
			header = (
				<div id="user-details">
					<Col className="user-details-icon" xs={2} sm={1}>
						<img src={this.state.user.pic} />
					</Col>
					<Col xs={10} sm={11} className="user-details-box">
						<a className="site-link" href={this.state.user.url}><h3 className="text-center" style={{marginTop:7}}>{this.state.user.name}</h3></a>
					</Col>
				</div>
			);
		}
		return (
	      <div>
	        <Button className="search-button site-button" onClick={this.open}>
	          Search chat history
	        </Button>
	        <Modal className="searchModal" show={this.state.showModal} onHide={this.close}>
	          <Modal.Header closeButton>
	          	{header}	          
	          </Modal.Header>
	          <Modal.Body>
	          	<div>
	              <FormGroup controlId="userName" className="username-search">
	                <FormControl type="text" onKeyUp={this.pressSearch} className="user-name-input" placeholder="Enter username..." />
	                <Button onClick={this.searchName} className="site-button">Search</Button>
	              </FormGroup>
	            </div>
	            <div className="search-messages">
              		{this.state.chats.map(chat => {
				        return (
				            <div className="message" key={chat.chatId}><img src={this.state.user.pic} className="chat-pic"/><div className="chat-msg">{new Date(chat.publishedAt).toLocaleTimeString()} : {chat.displayMessage}</div></div>
				        )
				    })}
	            </div>
	          </Modal.Body>
	          <Modal.Footer>
	            <Button style={{height:35,width:100}} onClick={this.close} className="site-button">Close</Button>
	          </Modal.Footer>
	        </Modal>
	      </div>
		);
	}
}

export default ChatLookUp;