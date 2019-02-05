let socket = io();

socket.on("connect", () => {
	console.log("connected to server")
});

socket.on("disconnect", () => {
	console.log("disconnected from server");
});

socket.on("newMessage", (message) => {
	console.log("new message posted: ", message)
	let li = jQuery("<li></li>")
	li.text(`${message.from}: ${message.text}`)
	jQuery("#messages").append(li)
})

jQuery("#message-form").on("submit", function(e) {
	e.preventDefault()
	socket.emit("createMessage", {
		from: "User",
		text: jQuery("[name=message]").val()
	}, function(res){
		console.log(res)
	})
})

