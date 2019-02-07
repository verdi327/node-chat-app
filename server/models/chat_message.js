const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ChatMessageSchema = new Schema({
	text: {type: String, minlength: 1, trim: true},
	from: {type: String, required: true, minlength: 1, trim: true},
	url: {type: String, minlength: 5, trim: true},
	room: {type: String, required: true, trim: true},
	type: {type: String, required: true}
}, { timestamps: { createdAt: 'createdAt' }})

const ChatMessage = mongoose.model("ChatMessage", ChatMessageSchema)


module.exports = {
	ChatMessage
}