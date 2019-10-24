//client/components/ChannelDetails.js
import React from 'react';
import { Col, Row } from 'react-bootstrap';

import '../styles/ChannelDetails.css';

//receives channel info as prop from parent component and renders info
class ChannelDetails extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			channel:this.props.channel
		}
	}
	render(){
		if(this.state.channel){
			let channel = this.state.channel;
			return (
				<div id="channel-details">
					<Col className="channel-icon" xs={1}>
						<img src={channel.snippet.thumbnails.default.url} />
					</Col>
					<Col xs={11} className="channel-box">
						<Row>
							<Col xs={12} className="channel-title">
								<h3 className="text-center">{channel.snippet.localized.title}</h3>
							</Col>
							<Col xs={12} className="channel-subs">
								<h5>{channel.statistics.subscriberCount} Subscribers</h5>
							</Col>
						</Row>
					</Col>
				</div>
			);
		} else {
			return (<div></div>);
		}
	}
}

export default ChannelDetails;