let socket = io();

socket.on("connect", () => {
	console.log("connected to server")
});

socket.on("disconnect", () => {
	console.log("disconnected from server");
});

socket.on("newMessage", (message) => {
	let formattedTime = moment(message.createdAt).format("h:mm a")
	let template = jQuery("#message-template").html()
	let html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		createdAt: formattedTime
	})
	jQuery("#messages").append(html)
})

let messageTextBox = jQuery("[name=message]");
jQuery("#message-form").on("submit", function(e) {
	e.preventDefault()
	socket.emit("createMessage", {
		from: "User",
		text: messageTextBox.val()
	}, function(res){
		messageTextBox.val("")
	})
})

let locationBtn = jQuery("#send-location")
locationBtn.on("click", function(e) {
	if (!navigator.geolocation){
		return alert("Geolocation is not supported by your browser.")
	}

	locationBtn.attr("disabled", "disabled").text("Sending location...");

	navigator.geolocation.getCurrentPosition(function(position){
		locationBtn.removeAttr("disabled").text("Send location");
		socket.emit("createLocationMessage", {
			lat: position.coords.latitude,
			lng: position.coords.longitude
		})
	}, function(e){
		locationBtn.removeAttr("disabled").text("Send location");
		alert("Unable to fetch location.");
	})
})

socket.on("newLocationMessage", (message) => {
	let formattedTime = moment(message.createdAt).format("h:mm a")
	let template = jQuery("#location-message-template").html()
	let html = Mustache.render(template, {
		from: message.from,
		url: message.url,
		createdAt: formattedTime
	})
	jQuery("#messages").append(html)
})





