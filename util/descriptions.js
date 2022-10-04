const chalk = require("chalk");
const { description } = require("../package.json");
const { constants } = require("./config");

const name =
	"\n░█████╗░██╗░░░░░████████╗░█████╗░░██████╗░██╗░█████╗░ \n██╔══██╗██║░░░░░╚══██╔══╝██╔══██╗██╔════╝░██║██╔══██╗ \n███████║██║░░░░░░░░██║░░░██║░░██║██║░░██╗░██║██║░░╚═╝ \n██╔══██║██║░░░░░░░░██║░░░██║░░██║██║░░╚██╗██║██║░░██╗ \n██║░░██║███████╗░░░██║░░░╚█████╔╝╚██████╔╝██║╚█████╔╝ \n╚═╝░░╚═╝╚══════╝░░░╚═╝░░░░╚════╝░░╚═════╝░╚═╝░╚════╝░ \n\n";

const descriptions = {
	noApps: "You do not have any apps.",
	noApp: "No current-app found in configuration file.",
	noEnvs: "You do not have any environments.",
	noEnv: "No current-environment found in configuration file.",
	noFunctions: "You do not have any functions.",
	noToken: "No logged in user info found. You first need to login.",
	noBuilds: "You do not have any builds for the function.",
	noDeployments: "You do not have any deployments for the function.",
	codeSent: "\n An authorization code is sent to your email address.",
	needLogin: "You first need to login.",
	folderExist: (folderName) =>
		`Folder "${folderName}" already exists in the current directory. Please choose another name for the function.`,
	unknownOption: (message) =>
		`${message} \n\nTry updating your git to the latest version.`,
	gitNotInstalled: (message) =>
		`${message} \n\nIt appears that git is not installed, try installing git first.`,
	functionInstruction:
		"You first need to create an app before creating a function.",
	missingAppId: `You either need to specify the app id using ${chalk.bold(
		"-a"
	)} or ${chalk.bold(
		"--app"
	)} option or configure the app to work on using ${chalk.bold(
		"altogic config set-app"
	)} command`,
	missingFunctionId: `You either need to specify the function id using ${chalk.bold(
		"-f"
	)} or ${chalk.bold(
		"--func"
	)} option or run this command in a function folder with an altogic.json configuration file.`,
	missingConfigFile: `Missing configuration file ${chalk.bold(
		constants.configFile
	)}. You need to run the command within the directory of the function where the configuration file exists.`,
	missingAppIdInConfig: `Missing appId in configuration file ${chalk.bold(
		constants.configFile
	)}.`,
	missingFunctionIdInConfig: `Missing functionId in configuration file ${chalk.bold(
		constants.configFile
	)}.`,
	missingRuntimeInConfig: `Missing runtime info in configuration file ${chalk.bold(
		constants.configFile
	)}.`,
	missingEntrypointInConfig: `Missing entrypoint info in configuration file ${chalk.bold(
		constants.configFile
	)}.`,
	missingFunctionNameInConfig: `Missing function name in configuration file ${chalk.bold(
		constants.configFile
	)}.`,
	missingEnvId: `Missing environment id. You either need to specify the environment id using ${chalk.bold(
		"-e"
	)} or ${chalk.bold(
		"--env"
	)} option or configure the environment to work on using ${chalk.bold(
		"altogic config set-env"
	)} command`,
	buildInfo1: `Depending on the dependencies, the build process can take couple of minutes to complete.`,
	buildInfo2: `Use ${chalk.bold(
		"altogic get builds"
	)} command to check the status of your builds.`,
	deployInfo1: `Depending on the dependencies, the build and deploy process can take couple of minutes to complete.`,
	deployInfo2: `Use ${chalk.bold(
		"altogic get builds"
	)} command to check the status of your builds.`,
	deployInfo3: `Use ${chalk.bold(
		"altogic get deployments"
	)} command to check the status of your deployments.`,
	applyInfo1: `Deploying the build to the environment can take couple of minutes to complete.`,
	applyInfo2: `Use ${chalk.bold(
		"altogic get deployments"
	)} command to check the status of your deployments.`,
	notDirectory: (path) => `The path "${path}" is not a directory.`,
	ignoringFiles: "Ignoring files in .gitignore",
	config: `get logged in user info and manage app and environment configuration`,
	configUpdated: "Configuration file updated",
	create: `create a new app, environment or function`,
	apply: `deploy an existing build of the function to an environment`,
	build: `create the build image of the function`,
	deploy: `create and deploy the build image of the function`,
	undeploy: `undeploy the function from the environment`,
	createFunction: "create a new function",
	apps: "get list of apps of the logged in user",
	envs: "get the environments of an app",
	functions: "get the functions of an app",
	get: `get app, env and function info from Altogic backend`,
	login: `authenticate your Altogic account`,
	logout: `logout of your Altogic account`,
	setApp: "sets the current-app in the configuration file",
	setEnv: "sets the current-environment in the configuration file",
	getApp: "get current-app from the configuration file",
	getEnv: "get current-environment from the configuration file",
	getUser: "get current user information",
	main: chalk.cyan(`${name}${description}`),
	selectAppMsg: "Which app do you want to work on?",
	selectAppFuncMsg: "To which application do you want to add the new function?",
	clearApp: "clears the current-app setting from the configuration file",
	clearEnv:
		"clears the current-environment setting from the configuration file",
	initializing: "Initializing function",
	checkingConfigFile: "Checking configuration file",
	creatingTarFile: "Creating tar file",
	uploadingCode: "Uploading file",
	applyingBuild: "Applying build",
	undeployingFunction: "Undeploying function",
	missingEntryFile: (entrypoint) =>
		`The entrypoint file (${entrypoint}) specified in ${chalk.bold(
			constants.configFile
		)} configuration file cannot be found.`,
	invalidRuntime: (runtime, runtimes) =>
		`The runtime (${chalk.bold(
			runtime
		)}) is invalid. Supported runtimes are the following: ${runtimes}`,
};

module.exports = { descriptions };
