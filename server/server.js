require("./config/config.js");
const http = require("http");
const path = require("path");
const publicPath = path.join(__dirname, "../public");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000
const socketIO = require("socket.io");
const server = http.createServer(app);
const io = socketIO(server);
const {generateMessage, generateGiphyResults} = require("./utils/message");
const {isRealString, invalidName} = require("./utils/validation");
const {Users} = require("./utils/users");
const users = new Users();
const {mongoose} = require("./database");
const {ChatMessage} = require("./models/chat_message");

app.use(express.static(publicPath))

io.on("connection", (socket) => {
	socket.emit("availableRooms", users.availableRooms());

	socket.on("disconnect", () => {
		let user = users.removeUser(socket.id);
		if (user) {
			io.to(user.room).emit("updateUserList", users.getUserList(user.room));
			io.to(user.room).emit("newMessage", generateMessage("Admin", `${user.name} has left the room 😞`))
		}
	})

	socket.on("createMessage", (message, callback) => {
		let user = users.getUser(socket.id);
		if (user && isRealString(message.text)){
			let newMsg = new ChatMessage({
				text: message.text,
				from: user.name,
				room: user.room,
				type: "text"
			})
			newMsg.save().then(savedMessage => {
				io.to(user.room).emit("newMessage", savedMessage)
			}).catch(e => console.log(e))
		}
		
		callback()
	})

	socket.on("createLocationMessage", (coords) => {
		let user = users.getUser(socket.id)
		if (user){
			let newMsg = new ChatMessage({
				from: user.name,
				room: user.room,
				url: `https://google.com/maps?q=${coords.lat},${coords.lng}`,
				type: "link"
			})
			newMsg.save().then(savedMessage => {
				io.to(user.room).emit("newMessage", savedMessage)
			}).catch(e => console.log(e))
		}
	})

	socket.on("searchGiphy", (data) => {
		generateGiphyResults(data.text).then(response => {
			socket.emit("giphyResults", response)
		}).catch(e => console.log(e))
	})

	socket.on("selectedGif", (data) => {
		let user = users.getUser(socket.id)
		if (user){
			let newMsg = new ChatMessage({
				from: user.name,
				room: user.room,
				url: data.url,
				type: "image"
			})

			newMsg.save().then(savedMessage => {
				io.to(user.room).emit("newMessage", savedMessage)
			})
		}
	})

	socket.on("join", (params, callback) => {
		if (!isRealString(params.name)) {
			return callback("Display name is required")
		}

		if (invalidName(users.list, params.name)) {
			return callback("Display name is already taken")
		}

		if (params.availableRooms && isRealString(params.availableRooms)){
			// if user selected a room to join, set the room to it
			params.room = params.availableRooms
		}

		let [name, room] = [params.name, params.room]
		room = room.toLowerCase();
		
		socket.join(room);
		users.removeUser(socket.id);
		users.addUser(socket.id, name, room);

		// populate chat room with last 10 messages
		ChatMessage.find({room: room}).sort({createdAt: -1}).limit(30).then(messages => {
			if (messages.length) {
				messages.reverse().forEach(message => {
					socket.emit("newMessage", message)
				})	
			}
		}).catch(e => console.log(e))

		io.to(room).emit("updateUserList", users.getUserList(room));
		socket.emit("newMessage", generateMessage("Admin", `Welcome to the chat room 🤟`))
		socket.broadcast.to(room).emit("newMessage", generateMessage("Admin", `${name} has joined the chat 🤓`)) 
		callback()
	})

})

server.listen(port, () => {
	console.log(`Server listening on port ${port}`)
})

