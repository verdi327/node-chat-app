const expect = require("expect");
const {Users} = require("./../../../server/utils/users");

describe("Users", () => {
	let users;

	beforeEach(() => {
		users = new Users();
		users.list = [{
			id: "1",
			name: "Kumar",
			room: "Room A"
		},{
			id: "2",
			name: "Shaun",
			room: "Room A"
		},{
			id: "2",
			name: "Todd",
			room: "Room B"
		}]
	})

	describe("addUser", () => {
		it("should add a new user to users array", () => {
			let user = {id: 123, name: "John", room: "Room A"}
			users.addUser(user.id, user.name, user.room)
			expect(users.list[users.list.length-1]).toEqual(user)
		})
	})

	describe("removeUser", () => {
		it("should remove a user from the collection", () => {
			let removed = users.removeUser("1")
			expect(users.list.length).toBe(2)
			expect(removed).toEqual({id: "1", name: "Kumar", room: "Room A"})
		})

		it("should return undefined if no user found", () => {
			let removed = users.removeUser("100")
			expect(users.list.length).toBe(3)
			expect(removed).toNotExist()
		})
	})

	describe("getUser", () => {
		it("should find a user by id and return user object", () => {
			let user = users.getUser("1")
			expect(user).toEqual({id: "1", name: "Kumar", room: "Room A"})
		})

		it("should return undefined if no user found", () => {
			let user = users.getUser("100")
			expect(user).toNotExist();
		})
	})

	describe("getUserList", () => {
		it("should return an array of user names that belong to a room", () => {
			let userList = users.getUserList("Room A");
			expect(userList).toEqual(["Kumar", "Shaun"])
		})

		it("should return an empty array if no results found", () => {
			let userList = users.getUserList("Room ZZZ");
			expect(userList).toEqual([])
		})
	})

	describe("availableRooms", () => {
		it("should return a unique list of all rooms", () => {
			let rooms = users.availableRooms();
			expect(rooms).toEqual(["Room A", "Room B"])
		})
	})
})