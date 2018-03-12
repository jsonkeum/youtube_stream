//server/routes/routes.js
const express = require('express');
const router = express.Router();
const chatDB = require('../chatDB');
const GAPI = require('../gapi');
const YAPI = require('../yapi');
//Secret info is accessed through process.env.
require('dotenv').config();

//Instantiate the google api object using secrets.
var gapi = new GAPI(process.env.GCLIENTID, process.env.GSECRET, process.env.TESTREDIRECT)
var yapi = new YAPI(process.env.GAPIKEY);

/*
	WEB PAGE REQUESTS
*/
//Main page render. All rendering is done by passing a variable to confirm that the user
//has authenticated.
router.get('/', (req, res) => res.render('index', {authed:gapi.hasCredentials()}));

//Redirects user to Google Consent process.
router.get('/auth', (req, res) => res.redirect(gapi.googAuthURL()));

//Lobby page render
router.get('/lobby', function(req, res){
	res.render('index', {authed:gapi.hasCredentials()});
});
//Video page render.
router.get('/video/*', function(req, res){
	if(!gapi.hasCredentials()) res.redirect('/');
	else res.render('index', {authed:gapi.hasCredentials()});
});

//Receives redirect from google after authentication with request query with access code
//Calls post request to grab OAuth access token data
router.get('/redirect', function(req, res){
	gapi.requestToken(req, function(){
		res.redirect('/lobby');
	});
}); 
//Handle logout button request (Header.js)
router.get('/logout', function(req, res){
	gapi.deleteCredentials();
	res.redirect('/');
})


/*
	JSON API
*/
//Handle the api request to fetch the indiviudal video data
//including embed content and video details. (VideoPage.js)
router.get('/getvideo/:videoId', function(req, res){
	if(gapi.hasCredentials()){
		yapi.getVideo(req.params.videoId, function(response){
			res.json(response);
		});
	} else {
		res.status(403);
	}
});
//Handle request to get streamer channel data (ChannelDetails.js)
router.get('/getchannel/:channelId', function(req, res){
	if(gapi.hasCredentials()){
		yapi.getChannel(req.params.channelId, function(response){
			res.json(response);
		});
	} else {
		res.status(403);
	}
});

//Handle request to fetch initial 10 videos (Lobby.js)
router.get('/fetchvideos', function(req, res){
	if(gapi.hasCredentials()){
		yapi.fetchVideos(function(payload){
			res.json(payload);
		});
	} else {
		res.status(403);
	}
})

//Handle request to fetch initial chat messages for the session (Chat.js)
//SOMETHING IS MAKING THIS METHOD ACT TWICE. DOESN'T SEEM LIKE A FRONT-END PROBLEM, IS IT THE ROUTER?
router.get('/getchats/:liveChatId', function(req, res){
	if(gapi.hasCredentials()){
		yapi.getChats(gapi, req.params.liveChatId, function(payload){
			if(!payload.error && payload.items.length > 0){
				chatDB.insertChats(payload.items);
			}
			res.json(payload);
		})
	} else {
		res.status(403);
	}
})
//Handle request to fetch subsequent chat messages for the session using the nextPageToken param (Chat.js)
router.get('/nextchats/:liveChatId/:nextPageToken', function(req, res){
	if(gapi.hasCredentials()){
		yapi.getChats(gapi, req.params.liveChatId, function(payload){
			if(!payload.error && payload.items.length > 0){
				chatDB.insertChats(payload.items);
			}
			res.json(payload);
		}, req.params.nextPageToken);
	} else {
		res.status(403);
	}
})

//Handle chat message post request to youtube api.
router.post('/sendmessage', function(req,res){
	yapi.sendChat(gapi, req.body, function(response){
		res.json(response.data);
	})
});

//Handle request to grab individual user chat log for the
//particular session. (TBD)
router.get('/getuserchats/:liveChatId/:displayName', function(req, res){
	chatDB.getUserChats(req.params.liveChatId, req.params.displayName, function(payload){
		res.json(payload);
	});
});

module.exports = router;