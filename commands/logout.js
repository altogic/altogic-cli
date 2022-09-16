const { Command } = require("commander");
const { descriptions } = require("../util/descriptions");
const { config } = require("../util/config");
const { success } = require("../util/render");

const logout = new Command("logout")
	.description(descriptions.logout)
	.action(() => {
		config.clear();
		success();
	});

module.exports = {
	logout,
};
