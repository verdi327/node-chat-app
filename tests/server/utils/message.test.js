const expect = require("expect");
const {generateMessage} = require("./../../../server/utils/message")

describe("generateMessage", () => {
	it("generate correct message object", () => {
		let [from, text] = ["Admin", "Hi there"]
		let newMessage = generateMessage(from, text)
		expect(newMessage).toInclude({from, text})
		expect(newMessage.createdAt).toExist()
	})
})