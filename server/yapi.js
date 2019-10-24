//server/yapi.js -- Youtube API handler object.
//Object to handle youtube api calls. For calls requiring OAuth tokens,
//the object will ask a credentialed GAPI object to make the call and handle its own callbacks.

const API = require('./api')
var apiKey

class YAPI extends API {
	constructor(theApiKey){
		super();
		apiKey = theApiKey;
	}

	/*
	*	Method to handle the intial video search 
	*	@return - json object containing top 10 video info.
	*/
	fetchVideos(callback){
		let reqPath = "https://www.googleapis.com/youtube/v3/search";
		let reqParams = {
			"part":"snippet",
			"eventType":"live",
			"order":"viewCount",
			"maxResults":"10",
			"type":"video",
			"topicId":"/m/0bzvm2",
			"videoEmbeddable":"true",
			"key":apiKey
		}
		
		this.get(reqPath, reqParams, function(response){
			callback(response.data.items);
		})
	}

	/*
	*	Method to get the video requested from VideoPage.js
	*	@return - json object containing video data.
	*/
	getVideo(videoId, callback){
		let reqPath = "https://www.googleapis.com/youtube/v3/videos";
		let reqParams = {
			"part":encodeURIComponent("snippet,status,player,liveStreamingDetails"),
			"id":videoId,
			"key":apiKey,
			"maxWidth":800,
			"maxHeight":600
		}
		this.get(reqPath, reqParams, function(response){
			callback(response.data.items[0])
		});
	}

	/*
	*	Method to get channel info requested from ChannelDetails.js
	*	@return - json object containing channel data.
	*/
	getChannel(channelId, callback){
		let reqPath = "https://www.googleapis.com/youtube/v3/channels";
		let reqParams = {
			"part":encodeURIComponent("snippet,statistics"),
			"id":channelId,
			"key":apiKey
		}
		this.get(reqPath, reqParams, function(response){
			callback(response.data.items[0])
		});
	}

	/*
		Method to get initial chat messages info requested from Chat.js
		@param gapi - a credentialed GAPI object required to perform the api call.	
		@param chatDB - chat database module
		@param liveChatId - chat api call parameter
		@param nextPageToken - option call parameter used after the initial call for subsequent calls to the chat
								api for further messages.
		@param callback - callback function from the router to send json data to client
		@return - json object containing chat messages data.
	*/
	getChats(gapi, liveChatId, callback, nextPageToken){
		let reqPath = "https://www.googleapis.com/youtube/v3/liveChat/messages";
		let reqParams = {
			"part":encodeURIComponent("id,snippet,authorDetails"),
			"liveChatId":liveChatId,
			"profileImageSize":"24"
		};
		if(nextPageToken) reqParams["pageToken"] = nextPageToken;
		gapi.getWithAuth(reqPath, reqParams, function(response){
			if(response.status != 200) {
				callback(response.response.data);
			}
			else callback(response.data);
		});
	}

	sendChat(gapi, reqBody, callback){
		let reqPath = "https://www.googleapis.com/youtube/v3/liveChat/messages";
		let reqParams = {
			"part":encodeURIComponent("snippet,authorDetails"),
		};
		gapi.postBodyWithAuth(reqPath, reqParams, reqBody, callback);
	}
}

module.exports = YAPI;