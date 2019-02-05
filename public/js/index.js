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

let locationBtn = jQuery("#send-location")
locationBtn.on("click", function(e) {
	if (!navigator.geolocation){
		return alert("Geolocation is not supported by your browser.")
	}
	navigator.geolocation.getCurrentPosition(function(position){
		socket.emit("createLocationMessage", {
			lat: position.coords.latitude,
			lng: position.coords.longitude
		})
	}, function(e){
		alert("Unable to fetch location.")
	})
})

socket.on("newLocationMessage", (message) => {
	let li = jQuery("<li></li>")
	let a = jQuery("<a target='_blank'>My current location</a>")
	li.text(`${message.from}: `)
	a.attr("href", message.url)
	li.append(a)
	
	jQuery("#messages").append(li)
})





