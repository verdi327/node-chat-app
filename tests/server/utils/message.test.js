require("./../../../server/config/config.js");
const expect = require("expect");
const {
	generateMessage, 
	generateGiphyResults
} = require("./../../../server/utils/message")

describe("generateMessage", () => {
	it("generate correct message object", () => {
		let [from, text] = ["Admin", "Hi there"]
		let newMessage = generateMessage(from, text)
		expect(newMessage).toInclude({from, text})
		expect(newMessage.createdAt).toExist()
		expect(newMessage.type).toBe("text")
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
