const socket = io();

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
		text: messageTextBox.val()
	}, function(res){
		messageTextBox.val("")
	})
})

let giphyBtn = jQuery("#send-giphy");
giphyBtn.on("click", function(e) {
	giphyBtn.attr("disabled", "disabled").text("Sending gif...");

	if (!messageTextBox.val().trim().length){
		alert("Message text is required to find a gif")
		giphyBtn.removeAttr("disabled").text("Send giphy");
		return
	}
	socket.emit("createGiphyMessage", {
		text: messageTextBox.val()
	}, function(e) {
		giphyBtn.removeAttr("disabled").text("Send giphy");
		alert("Unable to connect to Giphy servers");
	})
})



socket.on("newGiphyMessage", (response) => {
	let div = jQuery("<div></div>").attr("id", "gif-results")
	response.data.forEach(gif => {
		let a = jQuery("<a></a>").attr("class", "gif-result").attr("href", "#")
		let img = jQuery("<img>").attr("src", gif.previewUrl)
		div.append(a.html(img))
	})
	jQuery("#modal-1-content").html(div)
	MicroModal.show("modal-1");

	jQuery(".gif-result").on("click", function(e){
		// get previewUrl from clicked gif
		let previewUrl = jQuery(this).children().first().attr("src");
		// match it to the original results array
		let result = response.data.filter(gif => gif.previewUrl === previewUrl)
		// if found, create a new message and close modal
		if (result.length) {
			let formattedTime = moment(response.createdAt).format("h:mm a")
			let template = jQuery("#giphy-message-template").html()
			let html = Mustache.render(template, {
				from: response.from,
				url: result[0].url,
				createdAt: formattedTime
			})
			MicroModal.close("modal-1");
			jQuery("#messages").append(html)
			giphyBtn.removeAttr("disabled").text("Send giphy");
			messageTextBox.val("");
			scrollToBottom();	
		}
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


