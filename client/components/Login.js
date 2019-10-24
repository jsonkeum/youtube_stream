//client/components/Login.js
import React from 'react';
import { Col, Row } from 'react-bootstrap';

import '../styles/Login.css';


//Login page '/auth' makes a call to the server to redirect to Google's consent page.
const Login = () => (
	<div className="container-fluid" style={{height:"100vh"}}>
	  <Row className="login-banner">
	    <Col className="no-padding" xs={12} sm={5}>
	      <div><h1 className="login-title"><span style={{fontSize:'225%'}}>Top 10</span><br/>
	      								   <span>Youtube Game Streams</span><br/>
	      								   <span style={{fontSize:'159%'}}>Live Now</span>
	      								   </h1>
	     </div>
	      <div><a className="login-button" href="/auth"><div className="signin"></div></a></div>
	    </Col>
	    <Col xs={12} sm={7}>
	      <div className="product-image"></div>
	    </Col>
	  </Row>
	  <div className="text-center">
          <span className="credits page-bottom">
            written by 
          	<a href="https://quanchifootball.github.io"> Jason Keum </a>
          </span>
      </div>
	</div>
);

export default Login;