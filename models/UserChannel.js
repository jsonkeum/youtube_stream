//models/UserChannel.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userChannelSchema = new Schema({
	channelId: String,
	displayName: String,
	profileImageUrl: String,
	channelUrl: String
});

module.exports = mongoose.model('UserChannel', userChannelSchema);