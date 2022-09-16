const chalk = require("chalk");
const { description } = require("../package.json");

const name =
	"\n░█████╗░██╗░░░░░████████╗░█████╗░░██████╗░██╗░█████╗░ \n██╔══██╗██║░░░░░╚══██╔══╝██╔══██╗██╔════╝░██║██╔══██╗ \n███████║██║░░░░░░░░██║░░░██║░░██║██║░░██╗░██║██║░░╚═╝ \n██╔══██║██║░░░░░░░░██║░░░██║░░██║██║░░╚██╗██║██║░░██╗ \n██║░░██║███████╗░░░██║░░░╚█████╔╝╚██████╔╝██║╚█████╔╝ \n╚═╝░░╚═╝╚══════╝░░░╚═╝░░░░╚════╝░░╚═════╝░╚═╝░╚════╝░ \n\n";

const descriptions = {
	noToken: "No logged in user info found. You first need to login.",
	codeSent: "\n An authorization code is sent to your email address.",
	needLogin: "You first need to login.",
	missingAppId: `You either need to specify the app id using ${chalk.bold(
		"-a"
	)} or ${chalk.bold(
		"--app"
	)} option or configure the app to work on using ${chalk.bold(
		"altogic config app"
	)} command`,
	config: `get user and manage app and env configuration`,
	apps: "get list of apps of the logged in user",
	envs: "get the environments of an app",
	get: `get app, env and function info from Altogic backend`,
	login: `authenticate your Altogic account`,
	logout: `logout of your Altogic account`,
	user: "get current user information",
	main: chalk.cyan(`${name}${description}`),
};

module.exports = { descriptions };
