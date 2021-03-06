const mongoose = require('mongoose');
const User = require('./users');
const ThreadSchema = new mongoose.Schema({
	title: String,
	description: String,
	tags: mongoose.Schema.Types.Mixed,
	email: String,
	date: {
		type: Date,
		default: Date.now()
	}
});

const Thread = mongoose.model('Thread', ThreadSchema);
module.exports = Thread;