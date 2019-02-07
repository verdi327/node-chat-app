const moment = require("moment");
const axios = require("axios");

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
	let giphyUrl = `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&q=${text}&limit=12&offset=0&rating=PG-13&lang=en`
	let data = []

	return axios.get(giphyUrl).then(response => {
		response.data.data.forEach(result => {
			let gif = {}
			gif.url = result.images.fixed_width.url
			gif.previewUrl = result.images.fixed_width_small.url
			data.push(gif)
		})
		return {
			from,
			data,
			createdAt: moment().valueOf()
		}
	})
}

module.exports = {
	generateMessage,
	generateLocationMessage,
	generateGiphyMessage
}