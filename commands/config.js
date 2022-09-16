const { Command } = require("commander");
const { descriptions } = require("../util/descriptions");
const { config } = require("../util/config");
const { error, vTable } = require("../util/render");

const configCommand = new Command("config").description(descriptions.config);

configCommand
	.command("user")
	.description(descriptions.user)
	.action(() => {
		const userInfo = {
			userId: config.get("userId"),
			email: config.get("email"),
			username: config.get("username"),
		};

		if (!userInfo.userId) return error(descriptions.noToken);

		vTable(userInfo);
	});

module.exports = {
	config: configCommand,
};
