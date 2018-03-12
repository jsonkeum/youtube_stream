//server/gapi.js -- Google Authentication handler Object
const API = require('./api')
//private variables to store credential info.	
var accessToken, refreshToken, expiresIn, client_id, client_secret, redirect_uri;
//Constructor takes application credentials as fields.
class GAPI extends API {
	constructor(the_client_id, the_client_secret, the_redirect_uri){
		super();
		client_secret = the_client_secret;
		client_id = the_client_id;
		redirect_uri = the_redirect_uri;
	}
	
	/*
	*	Method returns a URL string to redirect the user for Google authentication and consent
	*/
	googAuthURL() {
		//request URL path for google OAuth2. Note the ? at the end.
		let authReqPath = "https://accounts.google.com/o/oauth2/v2/auth";

		//OAuth2 authentication URL query parameters.
		let authReq = {
			"scope":"https://www.googleapis.com/auth/youtube.force-ssl",
			"access_type":"offline",
			"include_granted_scopes":"true",
			"state":"state_parameter_passthrough_value",
			"redirect_uri":redirect_uri,
			"prompt":"consent",
			"response_type":"code",
			"client_id":client_id
		}
		return this.createURL(authReqPath, authReq);
	}

	/*
	*	Method obtains auth code from the request after redirect
	*	and requests token from Google API. If successful, method stores credential info
	* 	@param req - the request query received from Google's redirect that contains the access code and other data.
	*	@param callback - the callback function from the router. It will be wrapped in another function which will first store the
	*	credentials before calling the original callback function. 	
	*/
	requestToken(req, callback){
		//endpoint path for token requests
		let tokenPath = "https://www.googleapis.com/oauth2/v4/token"
		
		//token request params and values
		let tokenParams = {
			"code":req.query.code,
			"client_id":client_id,
			"client_secret":client_secret,
			"redirect_uri":redirect_uri,
			"grant_type":"authorization_code"
		}
		this.post(tokenPath, tokenParams, function(response){
			try {
				setTokens(response.data);
				callback();
			} catch (e){
				console.log(e);
			}
		});
	}

	/*
	*	Method to perform HTTP GET requests with the OAuth token
	* 	@param reqPath - the request endpoint path
	* 	@param reqParams - query parameters
	*	@param callback - the callback function from the router. It will be wrapped in another function which will first store the
	*	credentials before calling the original callback function. 	
	*/
	getWithAuth(reqPath, reqParams, callback){
		let parent = this;
		if(this.hasCredentials()){
			let params = reqParams;
			params["access_token"] = accessToken;
			this.get(reqPath, params, function(response){
				callback(response);
			});
		} else {
			try {
				this.refreshCredentials(function(){
					let params = reqParams;
					params["access_token"] = accessToken;
					parent.get(reqPath, params, function(response){
						callback(response);
					});
				});
			} catch (e){
				console.log(e);
			}
		}

	}
	/*
	*	Method to perform HTTP GET requests with the OAuth token
	* 	@param reqPath - the request endpoint path
	*	@param reqParams - URI parameters
	* 	@param reqBody - request body object
	*	@param callback - the callback function from the router. It will be wrapped in another function which will first store the
	*	credentials before calling the original callback function. 	
	*/
	postBodyWithAuth(reqPath, reqParams, reqBody, callback){
		let parent = this;
		if(this.hasCredentials()){
			let params = reqParams;
			params["access_token"] = accessToken;
			this.postBody(reqPath, reqParams, reqBody, function(response){
				callback(response);
			});
		} else {
			try {
				this.refreshCredentials(function(){
					let params = reqParams;
					params["access_token"] = accessToken;
					parent.postBody(reqPath, reqParams, reqBody, function(response){
						callback(response);
					});
				});
			} catch (e){
				console.log(e);
			}
		}

	}

	/*
	*	Method to delete all credentials
	*
	*/
	deleteCredentials(){
		accessToken = null;
		refreshToken = null;
		expiresIn = null;
	}

	// Method to check whether the object has stored credentials required to
	// call other google/youtube APIs.
	hasCredentials(){
		if(!accessToken || !refreshToken || !expiresIn) return false;
		if((new Date()).getTime() > (new Date(expiresIn)).getTime()) return false;
		return true;
	}

	//Method to use refresh token to request new auth token from the GOAuth api.
	/*
		@param callback callback parameter that allows the parent function to attempt
		the original request again.
	*/
	refreshCredentials(callback){
		console.log("Refreshing credentials");
		//endpoint path for token requests
		let tokenPath = "https://www.googleapis.com/oauth2/v4/token"
		
		//token request params and values
		let tokenParams = {
			"client_id":client_id,
			"client_secret":client_secret,
			"refresh_token":refreshToken,
			"grant_type":"refresh_token"
		}
		this.post(tokenPath, tokenParams, function(response){
			try {
				setTokens(response.data);
				callback();
			} catch (e){
				console.log(e);
			}		
		});
	}

}
//Private method to store google auth credentials.
// @param data = response object from google containing token information.
function setTokens(data){	
	if(data.hasOwnProperty('refresh_token')) refreshToken = data.refresh_token;
	if(data.hasOwnProperty('access_token')) accessToken = data.access_token;
	else throw new Error('access_token not received');
	if(data.hasOwnProperty('expires_in')) expiresIn = (new Date()).getTime() + (parseInt(data.expires_in) * 1000 - 5000);
	else throw new Error('expires_in not received');
}

module.exports = GAPI;