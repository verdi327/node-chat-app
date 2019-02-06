let socket = io();

const scrollToBottom = () => {
	// selectors
	let messages = jQuery("#messages");
	let newMessage = messages.children("li:last-child");
	// heights
	let scrollHeight = messages.prop("scrollHeight");
	let clientHeight = messages.prop("clientHeight");
	let scrollTop = messages.prop("scrollTop");
	let newMessageHeight = newMessage.innerHeight();
	let lastMessageHeight = newMessage.prev().innerHeight();

	if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
		messages.scrollTop(scrollHeight);
	}
}

socket.on("connect", () => {
	let params = jQuery.deparam(window.location.search)
	socket.emit("join", params, (err) => {
		if (err) {
			alert(err);
			window.location.href = "/";
		} else {
			console.log("no error")
		}
	})
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
	scrollToBottom();
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
	scrollToBottom();
})

socket.on("updateUserList", (users) => {
	let ol = jQuery("<ol></ol>");
	users.forEach(user => {
		ol.append(jQuery("<li></li>").text(user));
	})
	
	jQuery("#users").html(ol);

})





