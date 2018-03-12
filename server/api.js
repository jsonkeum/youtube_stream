//server/api.js
//Class for handling basic api call methods

const axios = require('axios');

class API {
	constructor(){}
	/*
	* Method to create URI strings.	
	* @param path = endpoint path for the requset
	* @param params = JS object containing param name and values
	* @return a string representing the HTTP/REST request URI
	*/
	createURL(path, params){
		let queryArr = [];
		for(let param in params){
			if(params.hasOwnProperty(param)) queryArr.push(param+"="+params[param]);
		}
		let authURL = path + "?" +  queryArr.join("&");
		return authURL;
	}

	/*
	* Method to make api post calls with Axios.	
	* @param path = endpoint path for the requset
	* @param params = JS object containing param name and values
	* @param callback = function to callback after method receives the response
	* @return a string representing the HTTP/REST request URI
	*/
	post(path, params, callback){
		let uri = this.createURL(path, params);
		axios.post(uri).then(response => {
			try {
				callback(response);
			} catch(e) {
				console.log(e);
			}
		}).catch(error => {
			callback(error);
		});
	}

	/*
	* Method to make api post calls with Axios.	
	* @param path = endpoint path for the requset
	* @param params = JS object containing param name and values
	* @param callback = function to callback after method receives the response
	* @return a string representing the HTTP/REST request URI
	*/
	postBody(path, params, body, callback){
		let uri = this.createURL(path, params);
		axios.post(uri, body).then(response => {
			try {
				callback(response);
			} catch(e) {
				console.log(e);
			}
		}).catch(error => {
			callback(error);
		});
	}

	/*
	* Method to make api get calls with Axios.	
	* @param path = endpoint path for the requset
	* @param params = JS object containing param name and values
	* @param callback = function to callback after method receives the response
	* @return a string representing the HTTP/REST request URI
	*/
	get(path,params,callback){
		let uri = this.createURL(path, params);
		axios.get(uri).then(response => {
			try {
				callback(response);
			} catch(e) {
				console.log(e);
			}
		}).catch(error => {
			callback(error);
		});
	}
}

module.exports = API;