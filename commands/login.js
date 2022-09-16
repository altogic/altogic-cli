const { Command } = require("commander");
const inquirer = require("inquirer");
const { descriptions } = require("../util/descriptions");
const {
	questionLoginEmail,
	questionLoginCode,
	questionLoginPassword,
} = require("../util/questions");
const {
	initializeLogin,
	loginUserPwd,
	loginUserCode,
	isError,
} = require("../util/api");
const { error, success, log } = require("../util/render");
const { config } = require("../util/config");

const login = new Command("login")
	.description(descriptions.login)
	.action(async () => {
		const { email } = await inquirer.prompt(questionLoginEmail);
		let response = await initializeLogin(email);

		if (isError(response))
			return error(response.data.message || response.data.details);

		if (response.data.oAuthLogin) {
			log(descriptions.codeSent);
			const { code } = await inquirer.prompt(questionLoginCode);
			response = await loginUserCode(email, code);
		} else {
			const { password } = await inquirer.prompt(questionLoginPassword);
			response = await loginUserPwd(email, password);
		}

		if (isError(response))
			return error(response.data.message || response.data.details);

		//Check to see if the current user is different than the logged in one
		let userId = config.get("userId");
		if (userId && userId !== response.data._id) config.clear();

		config.set("userId", response.data._id);
		config.set("email", response.data.profile.email);
		config.set("username", response.data.profile.userName);
		config.set("token", response.data.token);

		success();
	});

module.exports = {
	login,
};
