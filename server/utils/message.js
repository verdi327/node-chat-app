const moment = require("moment");
const axios = require("axios");
const giphyApiKey = "QIM0kMysbSG87IDT59wwkDUasIyGGqou";

const generateMessage = (from, text) => {
	return {
		from,
		text,
		createdAt: moment().valueOf()
	}
}

const generateLocationMessage = (from, lat, lng) => {
	return {
		from,
		url: `https://google.com/maps?q=${lat},${lng}`,
		createdAt: moment().valueOf()
	}
}

const generateGiphyMessage = (from, text) => {
	// https://api.giphy.com/v1/gifs/search?api_key=QIM0kMysbSG87IDT59wwkDUasIyGGqou&q=tired dog&limit=8&offset=0&rating=PG-13&lang=en
	let giphyUrl = `https://api.giphy.com/v1/gifs/random?api_key=${giphyApiKey}&tag=${text}&rating=PG`

	return axios.get(giphyUrl).then(response => {
		return {
			from,
			url: response.data.data.images.fixed_width.url,
			createdAt: moment().valueOf()
		}
	})
}

module.exports = {
	generateMessage,
	generateLocationMessage,
	generateGiphyMessage
}