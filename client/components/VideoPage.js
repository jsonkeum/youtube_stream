//client/components/VideoPage.js
import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import axios from 'axios';
import ChannelDetails from './ChannelDetails';
import Chat from './Chat';
import '../styles/VideoPage.css';
const Col = require('react-bootstrap/lib/Col');
const Row = require('react-bootstrap/lib/Row');

//Responsible for rendering video page, grabbing JSON data from server to 
//display video and channel info as well as interacting with the Chat component
class VideoPage extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			video:null,
			channel:null
		}
		this.drawer = this.drawer.bind(this);
	}
	//Handler for description drawer toggle using jQuery
	drawer(e){
		var desc = $("#streamDescription");
		desc.animate({
			"height":"toggle"
		}, function(){
			desc.toggleClass("closed");
			$("#open-desc").toggleClass("upside-down");
		});
	}
	//Once component mounts, it makes a api call to the server to get
	//the initial video data and re-renders.
	componentDidMount() {
		let newStates = {};
		if(authed){
	      axios.get(`${window.location.protocol}//${window.location.hostname}/getvideo/${this.props.match.params.videoId}`)
	      .then(res => {
	        newStates.video = res.data;
	        return axios.get(`${window.location.protocol}//${window.location.hostname}/getchannel/${res.data.snippet.channelId}`);
	      }).then(res => {
	      	newStates.channel = res.data;
	      	this.setState(newStates);
	      });
    	}
	}
	render(){
		if(this.state.video){
			let video = this.state.video;
			let videoPlayer;
			if(video.status.embeddable){
				let embed = video.player.embedHtml.replace(`//www.youtube.com/embed/${this.props.match.params.videoId}`, `//www.youtube.com/embed/${this.props.match.params.videoId}?rel=0&autoplay=1&playsinline=1`);
				videoPlayer = ReactHtmlParser(embed);
			} else {
				videoPlayer = <h3>Video is not playable!</h3>;
			}
			return (
				<div className="container-fluid" id="video-page">
					<Row>
						<Col xs={12} sm={12} md={8}>
							<div id="videoTitle"><h3 className="text-center video-page-title">{video.snippet.localized.title}</h3></div>
							<div className="pane-wrapper">
								<div id="videoPane">{videoPlayer}</div>
							</div>
							<div id="videoInfo">
								<ChannelDetails channel={this.state.channel} />
								<div id="streamDescription" className="closed">
									<pre>
										{video.snippet.localized.description}
									</pre>
								</div>
								<h5 className="text-center" onClick={this.drawer} id="open-desc">Video Description <svg width="14px" height="14px" viewBox="0 0 255 255">
																								<g>
																									<g id="arrow-drop-down">
																										<polygon points="0,63.75 127.5,191.25 255,63.75   " fill="#FFFFFF"/>
																									</g>
																								</g>
																							</svg>
								</h5>
							</div>
						</Col>
						<Col xs={12} sm={12} md={4}>
							<Chat chatID={this.state.video.liveStreamingDetails.activeLiveChatId} />
						</Col>
					</Row>
				</div>
			);
		} else {
			return (<div></div>);
		}
	}
}

export default VideoPage;