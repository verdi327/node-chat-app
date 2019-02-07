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
const {generateMessage, generateLocationMessage, generateGiphyMessage} = require("./utils/message");
const {isRealString, invalidName} = require("./utils/validation");
const {Users} = require("./utils/users");
const users = new Users();

app.use(express.static(publicPath))

io.on("connection", (socket) => {
	socket.emit("availableRooms", users.availableRooms());

	socket.on("disconnect", () => {
		let user = users.removeUser(socket.id);
		if (user) {
			io.to(user.room).emit("updateUserList", users.getUserList(user.room));
			io.to(user.room).emit("newMessage", generateMessage("Admin", `${user.name} has left the room`))
		}
	})

	socket.on("createMessage", (message, callback) => {
		let user = users.getUser(socket.id);
		if (user && isRealString(message.text)){
			io.to(user.room).emit("newMessage", generateMessage(user.name, message.text))
		}
		
		callback()
	})

	socket.on("createLocationMessage", (coords) => {
		let user = users.getUser(socket.id)
		if (user){
			io.to(user.room).emit("newLocationMessage", generateLocationMessage(user.name, coords.lat, coords.lng))
		}
	})

	socket.on("createGiphyMessage", (data) => {
		let user = users.getUser(socket.id)
		if (user) {
			generateGiphyMessage(user.name, data.text).then(response => {
				io.to(user.room).emit("newGiphyMessage", response)
			}).catch(e => console.log(e))
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
		io.to(room).emit("updateUserList", users.getUserList(room));

		socket.emit("newMessage", generateMessage("Admin", `Welcome to ${room} chat`))
		socket.broadcast.to(room).emit("newMessage", generateMessage("Admin", `${name} has joined the chat`)) 
		callback()
	})

})

server.listen(port, () => {
	console.log(`Server listening on port ${port}`)
})

