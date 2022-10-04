const fs = require("fs");
const path = require("path");
const { getRuntimes } = require("./api");
const { descriptions } = require("./descriptions");

const questionLoginEmail = [
	{
		type: "input",
		name: "email",
		message: "Enter your email or username:",
		validate(value) {
			if (!value) {
				return "Please enter your email or username";
			}
			return true;
		},
	},
];

const questionLoginCode = [
	{
		type: "input",
		name: "code",
		message: "Enter your authorization code:",
		validate(value) {
			if (!value) {
				return "Please enter your authorization code";
			}
			return true;
		},
	},
];

const questionLoginPassword = [
	{
		type: "password",
		name: "password",
		message: "Enter your password:",
		mask: "*",
		validate(value) {
			if (!value) {
				return "Please enter your password";
			}
			return true;
		},
	},
];

const questionSelectApp = (apps, selectAppMsg) => {
	return [
		{
			type: "rawlist",
			name: "appId",
			message: selectAppMsg,
			pageSize: 20,
			choices: apps.map((entry) => {
				return { name: `${entry.name} (${entry._id})`, value: entry._id };
			}),
		},
	];
};

const questionSelectEnv = (envs) => {
	return [
		{
			type: "rawlist",
			name: "envId",
			message: "Which environment do you want to work on?",
			pageSize: 20,
			choices: envs.map((entry) => {
				return { name: `${entry.name} (${entry._id})`, value: entry._id };
			}),
		},
	];
};

const questionDeployEnv = (envs) => {
	return [
		{
			type: "rawlist",
			name: "envId",
			message: "To which environment do you want to deploy your function?",
			pageSize: 20,
			choices: envs.map((entry) => {
				return { name: `${entry.name} (${entry._id})`, value: entry._id };
			}),
		},
	];
};

const questionUndeployEnv = (envs) => {
	return [
		{
			type: "rawlist",
			name: "envId",
			message: "From which environment do you want to undeploy your function?",
			pageSize: 20,
			choices: envs.map((entry) => {
				return { name: `${entry.name} (${entry._id})`, value: entry._id };
			}),
		},
	];
};

const questionSelectBuild = (builds) => {
	return [
		{
			type: "rawlist",
			name: "buildId",
			message: "Which build do you want to apply?",
			pageSize: 20,
			choices: builds.map((entry) => {
				return {
					name: `Version ${entry.version} (${entry._id}) (${entry.createdAt})`,
					value: entry._id,
				};
			}),
		},
	];
};

const questionsCreateFunction = [
	{
		type: "input",
		name: "name",
		message: "What is the name of your function?",
		validate(value) {
			if (!value) return "Please enter your function name";
			else if (value.search(/^[a-zA-Z0-9-_ ]+$/) === -1)
				return "Function name can include only numbers, letters, spaces, minus (-) and underscore (_) characters. Please enter a valid function name.";

			let funcName = value.trim();
			let functionDir = path.join(process.cwd(), funcName);
			if (fs.existsSync(functionDir)) return descriptions.folderExist(funcName);

			return true;
		},
	},
	{
		type: "rawlist",
		name: "runtime",
		message: "What is the runtime of your function?",
		pageSize: 20,
		choices: async () => {
			let response = await getRuntimes();
			let choices = response.data.map((entry) => {
				return {
					name: entry.version,
					value: {
						id: entry.version,
						entrypoint: entry.entrypoint,
						runtime: entry.runtime,
					},
				};
			});
			return choices;
		},
	},
];

module.exports = {
	questionLoginEmail,
	questionLoginCode,
	questionLoginPassword,
	questionSelectApp,
	questionSelectEnv,
	questionDeployEnv,
	questionUndeployEnv,
	questionsCreateFunction,
	questionSelectBuild,
};
