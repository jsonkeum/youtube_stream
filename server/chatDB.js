//server/db.js
const bodyParser = require('body-parser');
const UserChannel = require('../models/UserChannel');
const Chats = require('../models/Chats');
const mongoose = require('mongoose');

/*
	Method to get chats for a particular user for a particular stream chat.
	First searches for user in the database and if found, searches the chats
	collection for all chats by that user on that stream.
	@param theLiveChatId id of the chat to search for.
	@param theDisplayName username to search for in db.
	@param callback callback param allowing router to send results as json data.
*/
function getUserChats(theLiveChatId, theDisplayName, callback){
	UserChannel.find({"displayName":theDisplayName}, function(err, users){
		if (err) throw err;
		if(users.length == 0){
			callback({
				found:false,
				message:"Sorry, no user found by that name. Ensure that the spelling is correct and please try again."
			});
		} else if(users.length == 1){
			let user = users[0];
			Chats.find({"liveChatId":theLiveChatId, "authorChannelId":user.channelId}, function(err, theChats){
				if (err) throw err;
				callback({
					found:true,
					message:user.displayName,
					userDetails:user,
					chats:theChats
				});
			})
		} else {
			throw err;
		}
	})
}

/**
*	Method to insert a new chat to the database. If the user does not exist, method will call
*	the method to create a new user with the chat.
*	@param data - the chat data representation in the form of youtube#liveChatMessage
*	(https://developers.google.com/youtube/v3/live/docs/liveChatMessages)  
**/
function insertChats(dataArr){
	for(let chat of dataArr){
		let newUserChannel = {
			channelId: chat.authorDetails.channelId,
			displayName: chat.authorDetails.displayName,
			profileImageUrl: chat.authorDetails.profileImageUrl,
			channelUrl: chat.authorDetails.channelUrl
		}
		UserChannel.findOneAndUpdate({'channelId': chat.authorDetails.channelId}, newUserChannel, {upsert:true}, function(err, doc){
			if (err) throw err;
				let newChat = {
				chatId:chat.id,
				liveChatId: chat.snippet.liveChatId,
				authorChannelId: chat.snippet.authorChannelId,
				displayMessage: chat.snippet.displayMessage,
				publishedAt: chat.snippet.publishedAt
			}
			Chats.findOneAndUpdate({'chatId': chat.id}, newChat, {upsert:true}, function(err, doc){
				if (err) throw err;
			});
		});
		
	}
}

module.exports = {
	getUserChats:getUserChats,
	insertChats:insertChats
}