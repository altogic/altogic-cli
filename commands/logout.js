const { Command } = require("commander");
const { descriptions } = require("../util/descriptions");
const { config } = require("../util/config");
const { success } = require("../util/render");
const { logoutUser, isLoggedIn } = require("../util/api");

const logout = new Command("logout")
	.description(descriptions.logout)
	.action(async () => {
		if (isLoggedIn()) {
			console.log("***here");
			let result = await logoutUser();
			console.log("***result", result);
		}

		config.clear();
		success();
	});

module.exports = {
	logout,
};
