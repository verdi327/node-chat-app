const http = require("http");
const path = require("path");
const publicPath = path.join(__dirname, "../public");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000
const socketIO = require("socket.io");
const server = http.createServer(app);
const io = socketIO(server);
const {generateMessage, generateLocationMessage} = require("./utils/message");

app.use(express.static(publicPath))

io.on("connection", (socket) => {
	console.log("new user connected")

	socket.emit("newMessage", generateMessage("Admin", "Welcome to the chat app"))
	socket.broadcast.emit("newMessage", generateMessage("Admin", "New user joined the chat")) 

	socket.on("disconnect", () => {
		console.log("client connection lost")
	})

	socket.on("createMessage", (message, callback) => {
		console.log("new message received: ", message)
		io.emit("newMessage", generateMessage(message.from, message.text))
		callback("200 from server")
	})

	socket.on("createLocationMessage", (coords) => {
		io.emit("newLocationMessage", generateLocationMessage("Admin", coords.lat, coords.lng))
	})

})

server.listen(port, () => {
	console.log(`Server listening on port ${port}`)
})

