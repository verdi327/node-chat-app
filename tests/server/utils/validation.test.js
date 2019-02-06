const expect = require("expect");
const {isRealString} = require("./../../../server/utils/validation")

describe("isRealString", () => {
	it("should be true for valid strings", () => {
		let str = "abc"
		expect(isRealString(str)).toBe(true)
	})

	it("should reject strings with only spaces", () => {
		let badStr = "    "
		expect(isRealString(badStr)).toBe(false)
	})

	it("should reject non strings", () => {
		let nonStr = 45
		expect(isRealString(nonStr)).toBe(false)
	})
})