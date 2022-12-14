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
const { error, success, log, progress, stop } = require("../util/render");
const { config } = require("../util/config");

const login = new Command("login")
	.description(descriptions.login)
	.action(async () => {
		const { email } = await inquirer.prompt(questionLoginEmail);
		let response = await initializeLogin(email);

		if (isError(response))
			return error(response.data.message || response.data.details);

		let spinner = null;
		if (response.data.oAuthLogin) {
			log(descriptions.codeSent);
			const { code } = await inquirer.prompt(questionLoginCode);
			spinner = progress("Signing in...");
			response = await loginUserCode(email, code);
		} else {
			const { password } = await inquirer.prompt(questionLoginPassword);
			spinner = progress("Signing in...");
			response = await loginUserPwd(email, password);
		}

		if (isError(response)) {
			stop(spinner);
			return error(response.data.message || response.data.details);
		}

		//Check to see if the current user is different than the logged in one
		let userId = config.get("userId");
		if (userId && userId !== response.data._id) config.clear();

		config.set("userId", response.data._id);
		config.set("email", response.data.profile.email);
		config.set("username", response.data.profile.userName);
		config.set("token", response.data.token);

		stop(spinner);
		success();
	});

module.exports = {
	login,
};
