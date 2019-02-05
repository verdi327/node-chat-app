const http = require("http");
const path = require("path");
const publicPath = path.join(__dirname, "../public");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000
const socketIO = require("socket.io");
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath))

io.on("connection", (socket) => {
	console.log("new user connected")

	socket.on("disconnect", () => {
		console.log("client connection lost")
	})

	socket.on("createMessage", (message) => {
		console.log("new message received: ", message)

		message.createdAt = new Date().toString()

		socket.emit("newMessage", message)
	})

})

server.listen(port, () => {
	console.log(`Server listening on port ${port}`)
})

