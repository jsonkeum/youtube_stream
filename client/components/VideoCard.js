//client/components/VideoCard.js
import React from 'react';
import '../styles/VideoCard.css';
var Col = require('react-bootstrap/lib/Col');

//Creates a card link to each video with info and highlights.
class VideoCard extends React.Component {
	constructor(props){
    	super(props);
	}

	render (){
		const video = this.props.video;
		const videoID = video.id.videoId;
		const videoURL = `/video/${videoID}`;
		const videoImage = {
			backgroundImage:`url(${video.snippet.thumbnails.high.url})`,
			maxHeight:video.snippet.thumbnails.high.height
		}
		return (
			<Col xs={12} sm={6} md={4} className="large--5 cards">
				<a className="video-link" href={videoURL}>
					<div className="videocard">
						<div className="videothumb" style={videoImage}></div>
						<div className="video-title">{video.snippet.title}</div>
						<div className="video-watching"></div>
						<div className="video-channel">by {video.snippet.channelTitle}</div>
						<span className="videodesc">{video.snippet.description}</span>
					</div>
				</a>
			</Col>
		);
	}
}

export default VideoCard;