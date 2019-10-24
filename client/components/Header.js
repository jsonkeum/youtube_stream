//client/components/Header.js
import React from 'react';
import '../styles/Header.css';
import {
	Col,
	Row
} from 'react-bootstrap';

//Lobby.js link and logout link.
export default class Header extends React.Component {
  render() {
    return (
    	<div id="header">
			<div className="container-fluid">
			  <Row>
			    <Col xs={9} sm={12}>
			      <a href="/lobby" className="header-title"><h2>Top 10 Youtube Game Streams Live Now</h2></a>
			    </Col>
			    <Col sm={3} className="col-sm-offset-9">
			      <a href="/logout" className="logout site-button button">Logout</a>
			    </Col>
			  </Row>
			</div>
    	</div>
    );
  }
}