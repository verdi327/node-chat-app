const isRealString = (string) => {
	return typeof string === "string" && string.trim().length > 0
};

const invalidName = (users, name) => {
	let userList = users.map(user => user.name.toLowerCase())
	return userList.includes(name.toLowerCase())
}

module.exports = {
	isRealString,
	invalidName
}