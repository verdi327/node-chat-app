require("./../../../server/config/config.js");
const expect = require("expect");
const {
	generateMessage, 
	generateLocationMessage,
	generateGiphyResults,
	generateGiphyMessage
} = require("./../../../server/utils/message")

describe("generateMessage", () => {
	it("generate correct message object", () => {
		let [from, text] = ["Admin", "Hi there"]
		let newMessage = generateMessage(from, text)
		expect(newMessage).toInclude({from, text})
		expect(newMessage.createdAt).toExist()
	})
})

describe("generateLocationMessage", () => {
	it("generates a correct location message", () => {
		let [from, lat, lng] = ["Admin", 123, 456]
		let newMessage = generateLocationMessage(from, lat, lng)
		expect(newMessage.createdAt).toExist()
		expect(newMessage.url).toBe(`https://google.com/maps?q=${lat},${lng}`)
	})
})

describe("generateGiphyResults", () => {
	it("should return an object with 12 results from Giphy Api", (done) => {
		generateGiphyResults("tired cat").then(response => {
			expect(response.data.length).toBe(12)
			expect(response.data[0].url).toExist()
			expect(response.data[0].previewUrl).toExist()
			done()
		}).catch(e => done(e))
	})
})

describe("generateGiphyMessage", () => {
	it("generates a correct response object", () => {
		let [from, url] = ["Dave", "https://giphyapi.com/cats"]
		let newMessage = generateGiphyMessage(from, url)
		expect(newMessage.createdAt).toExist()
		expect(newMessage.url).toBe(url)
		expect(newMessage.from).toBe(from)
	})
})