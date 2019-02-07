const socket = io();

socket.on("connect", () => {
	socket.on("availableRooms", (rooms) => {	
		if (rooms.length) {
			jQuery("#chat-display").show();
			let select = jQuery("<select name='availableRooms'></select>");
			select.append("<option selected value> -- select an option -- </option>")
			rooms.forEach(room => {
				select.append(jQuery("<option></option>").text(room).attr("value", room));
			})

			jQuery("#chat-select").html(select);	
		}
	})	
})
