const { Command } = require("commander");
const inquirer = require("inquirer");
const { descriptions } = require("../util/descriptions");
const { config } = require("../util/config");
const {
	success,
	error,
	log,
	vTable,
	progress,
	stop,
} = require("../util/render");
const {
	getApp,
	getApps,
	getEnv,
	getEnvs,
	isLoggedIn,
	isError,
} = require("../util/api");
const { questionSelectApp, questionSelectEnv } = require("../util/questions");

const configCommand = new Command("config")
	.description(descriptions.config)
	.action(() => {
		const userInfo = {
			userId: config.get("userId"),
			email: config.get("email"),
			username: config.get("username"),
		};

		if (!userInfo.userId) return log(descriptions.noToken);

		log("USER");
		vTable(userInfo);

		const appInfo = {
			id: config.get("appId"),
			name: config.get("appName"),
			role: config.get("appRole"),
			createdAt: config.get("appCreatedAt"),
		};

		if (!appInfo.id) return log(descriptions.noApp);

		log("APP");
		vTable(appInfo);

		const envInfo = {
			id: config.get("envId"),
			name: config.get("envName"),
			type: config.get("envType"),
			location: config.get("envLocation"),
			status: config.get("envStatus"),
			createdAt: config.get("envCreatedAt"),
		};

		if (!envInfo.id) return log(descriptions.noEnv);

		log("ENVIRONMENT");
		vTable(envInfo);
	});

configCommand
	.command("get-user")
	.description(descriptions.getUser)
	.action(() => {
		const userInfo = {
			userId: config.get("userId"),
			email: config.get("email"),
			username: config.get("username"),
		};

		if (!userInfo.userId) return log(descriptions.noToken);

		vTable(userInfo);
	});

configCommand
	.command("get-app")
	.description(descriptions.getApp)
	.action(() => {
		const appInfo = {
			id: config.get("appId"),
			name: config.get("appName"),
			role: config.get("appRole"),
			createdAt: config.get("appCreatedAt"),
		};

		if (!appInfo.id) return log(descriptions.noApp);

		vTable(appInfo);
	});

configCommand
	.command("get-env")
	.description(descriptions.getEnv)
	.action(() => {
		const envInfo = {
			id: config.get("envId"),
			name: config.get("envName"),
			type: config.get("envType"),
			location: config.get("envLocation"),
			status: config.get("envStatus"),
			createdAt: config.get("envCreatedAt"),
		};

		if (!envInfo.id) return log(descriptions.noEnv);

		vTable(envInfo);
	});

configCommand
	.command("set-app")
	.description(descriptions.setApp)
	.argument("[appId]", "application id")
	.action(async (appId) => {
		if (!isLoggedIn()) return error(descriptions.needLogin);

		//The appId is optional, if appId is not provided then list the apps of the user and ask the user to select one of them
		if (!appId) {
			const spinner = progress(descriptions.fetchingApps);
			const response = await getApps();
			stop(spinner);
			if (isError(response))
				return error(response.data.message || response.data.details);

			if (response.data.length === 0) return log(descriptions.noApps);

			const answer = await inquirer.prompt(
				questionSelectApp(response.data, descriptions.selectAppMsg)
			);
			appId = answer.appId;
		}

		const response = await getApp(appId);
		if (isError(response))
			return error(response.data.message || response.data.details);

		//If we are updating the app in config then we need to reset the env config also
		if (config.get("appId") !== response.data._id) {
			config.delete("envId");
			config.delete("envName");
			config.delete("envType");
			config.delete("envLocation");
			config.delete("envStatus");
			config.delete("envCreatedAt");
		}

		config.set("appId", response.data._id);
		config.set("appName", response.data.name);
		config.set(
			"appRole",
			response.data.owner._id === config.get("userId") ? "owner" : "member"
		);
		config.set("appCreatedAt", response.data.createdAt);

		success(descriptions.configUpdated);
	});

configCommand
	.command("set-env")
	.description(descriptions.setEnv)
	.argument("[envId]", "environment id")
	.action(async (envId) => {
		if (!isLoggedIn()) return error(descriptions.needLogin);
		if (!config.get("appId")) return error(descriptions.noApp);

		//The envId is optional, if envId is not provided then list the environments of the app and ask the user to select one of them
		if (!envId) {
			const response = await getEnvs(config.get("appId"));
			if (isError(response))
				return error(response.data.message || response.data.details);

			if (response.data.length === 0) return log(descriptions.noEnvs);

			const answer = await inquirer.prompt(questionSelectEnv(response.data));
			envId = answer.envId;
		}

		const response = await getEnv(config.get("appId"), envId);
		if (isError(response))
			return error(response.data.message || response.data.details);

		config.set("envId", response.data._id);
		config.set("envName", response.data.name);
		config.set("envType", response.data.type);
		config.set("envLocation", response.data.location);
		config.set("envStatus", response.data.status);
		config.set("envCreatedAt", response.data.createdAt);

		success(descriptions.configUpdated);
	});

configCommand
	.command("clear-app")
	.description(descriptions.clearApp)
	.action(async (envId) => {
		config.delete("appId");
		config.delete("appName");
		config.delete("appRole");
		config.delete("appCreatedAt");

		//Clearing app also requires clearing the environment settings
		config.delete("envId");
		config.delete("envName");
		config.delete("envType");
		config.delete("envLocation");
		config.delete("envStatus");
		config.delete("envCreatedAt");
	});

configCommand
	.command("clear-env")
	.description(descriptions.clearEnv)
	.action(async (envId) => {
		config.delete("envId");
		config.delete("envName");
		config.delete("envType");
		config.delete("envLocation");
		config.delete("envStatus");
		config.delete("envCreatedAt");
	});

module.exports = {
	config: configCommand,
};
