const expect = require("expect");
const {generateMessage, generateLocationMessage} = require("./../../../server/utils/message")

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