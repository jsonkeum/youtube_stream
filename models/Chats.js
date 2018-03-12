//models/Chats.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let chatSchema = new Schema({
		chatId:String,
		liveChatId: String,
		authorChannelId: String,
		displayMessage: String,
		publishedAt: Date
});

module.exports = mongoose.model('Chats', chatSchema);