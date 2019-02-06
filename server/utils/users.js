const _ = require("lodash");

class Users {
	constructor() {
		this.list = []
	}

	addUser(id, name, room){
		let user = {id, name, room}
		this.list.push(user)
		return user;
	}

	removeUser(id){
		let removed = _.remove(this.list, (user) => {
			return user.id === id
		})
		if (removed) {
			return removed[0]	
		} else {
			return undefined
		}
	}

	getUser(id){
		return this.list.filter(user => user.id === id)[0]
	}

	getUserList(room){
		let users = this.list.filter(user => user.room === room)
		if (!users.length) {
			return []
		}
		return users.map(user => user.name)
	}
}

module.exports = {
	Users
}