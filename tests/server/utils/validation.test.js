const expect = require("expect");
const {isRealString, invalidName} = require("./../../../server/utils/validation")

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

describe("invalidName", () => {
	let users;
	beforeEach(() => users = [{name: "John"},{name: "Fred"}])
	
	it("should return true if name is already in use", () => {
		let result = invalidName(users, "John")
		expect(result).toBe(true)
	})

	it("should be case insensitive", () => {
		let result = invalidName(users, "jOhn")
		expect(result).toBe(true)
	})
})