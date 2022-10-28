const { Command } = require("commander");
const { descriptions } = require("../util/descriptions");
const inquirer = require("inquirer");
const {
	getApps,
	getEnvs,
	getFunctions,
	getFunctionBuilds,
	getFunctionDeployments,
	isLoggedIn,
	isError,
} = require("../util/api");
const { error, log, hTable, progress, stop } = require("../util/render");
const { config, ConfigManager } = require("../util/config");
const { questionSelectApp } = require("../util/questions");

const get = new Command("get").description(descriptions.get);

const getAppsAction = async () => {
	if (!isLoggedIn()) return error(descriptions.needLogin);

	const spinner = progress(descriptions.fetchingApps);
	const response = await getApps();
	stop(spinner);
	if (isError(response))
		return error(response.data.message || response.data.details);

	//Sort apps by name
	let apps = response.data;
	if (apps.length === 0) return log(descriptions.noApps);

	apps = apps
		.sort((a, b) => {
			let alower = a.name.toLowerCase();
			let blower = b.name.toLowerCase();
			if (alower < blower) return -1;
			if (alower > blower) return 1;
			return 0;
		})
		.map((entry) => {
			return {
				id: entry._id,
				name: entry.name,
				role: entry.owner._id === config.get("userId") ? "owner" : "member",
				createdAt: entry.createdAt,
			};
		});

	hTable(["appId", "name", "role", "createdAt"], apps);
};

const getEnvsAction = async (options) => {
	if (!isLoggedIn()) return error(descriptions.needLogin);

	let appId = options?.app ?? config.get("appId");
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

	const response = await getEnvs(appId);
	if (isError(response))
		return error(response.data.message || response.data.details);

	//Sort envs by name
	let envs = response.data;
	if (envs.length === 0) return log(descriptions.noEnvs);

	envs = envs
		.sort((a, b) => {
			let alower = a.name.toLowerCase();
			let blower = b.name.toLowerCase();
			if (alower < blower) return -1;
			if (alower > blower) return 1;
			return 0;
		})
		.map((entry) => {
			return {
				id: entry._id,
				name: entry.name,
				type: entry.type,
				location: entry.location,
				status: entry.status,
				createdAt: entry.createdAt,
			};
		});

	hTable(["envId", "name", "type", "location", "status", "createdAt"], envs);
};

const getFunctionsAction = async (options) => {
	if (!isLoggedIn()) return error(descriptions.needLogin);

	let appId = options?.app ?? config.get("appId");
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

	const response = await getFunctions(appId);
	if (isError(response))
		return error(response.data.message || response.data.details);

	//Sort functions by name
	let functions = response.data;
	if (functions.length === 0) return log(descriptions.noFunctions);

	functions = functions
		.sort((a, b) => {
			let alower = a.name.toLowerCase();
			let blower = b.name.toLowerCase();
			if (alower < blower) return -1;
			if (alower > blower) return 1;
			return 0;
		})
		.map((entry) => {
			return {
				id: entry._id,
				name: entry.name,
				builds: entry.builds.length,
				createdAt: entry.createdAt,
			};
		});

	hTable(["functionId", "name", "builds", "createdAt"], functions);
};

const getBuildsAction = async (options) => {
	if (!isLoggedIn()) return error(descriptions.needLogin);

	let funcConfig = new ConfigManager(process.cwd());

	let appId = options?.app || funcConfig.get("appId") || config.get("appId");
	if (!appId) {
		return error(descriptions.missingAppId);
	}

	let functionId = options?.functionId || funcConfig.get("functionId");
	if (!functionId) {
		return error(descriptions.missingFunctionId);
	}

	const response = await getFunctionBuilds(appId, functionId);
	if (isError(response))
		return error(response.data.message || response.data.details);

	//Sort functions by name
	let builds = response.data;
	if (builds.length === 0) return log(descriptions.noBuilds);

	builds = builds
		.sort((a, b) => {
			let aDate = new Date(a.createdAt);
			let bDate = new Date(b.createdAt);
			return bDate - aDate;
		})
		.map((entry) => {
			return {
				id: entry._id,
				version: entry.version,
				runtime: entry.runtime,
				status: entry.status,
				builtAt: entry.createdAt,
			};
		});

	hTable(["buildId", "version", "runtime", "status", "builtAt"], builds);
};

const getDeploymentsAction = async (options) => {
	if (!isLoggedIn()) return error(descriptions.needLogin);

	let funcConfig = new ConfigManager(process.cwd());

	let appId = options?.app || funcConfig.get("appId") || config.get("appId");
	if (!appId) {
		return error(descriptions.missingAppId);
	}

	let functionId = options?.functionId || funcConfig.get("functionId");
	if (!functionId) {
		return error(descriptions.missingFunctionId);
	}

	const response = await getFunctionDeployments(appId, functionId);
	if (isError(response))
		return error(response.data.message || response.data.details);

	//Sort functions by name
	let deployments = response.data;
	if (deployments.length === 0) return log(descriptions.noDeployments);

	deployments = deployments
		.sort((a, b) => {
			let aDate = new Date(a.createdAt);
			let bDate = new Date(b.createdAt);
			return bDate - aDate;
		})
		.map((entry) => {
			return {
				deploymentId: entry._id,
				envName: entry.envName,
				buildVersion: entry.version,
				runtime: entry.runtime,
				status: entry.status,
				deployedAt: entry.createdAt,
			};
		});

	hTable(
		[
			"deploymentId",
			"env name",
			"build version",
			"runtime",
			"status",
			"deployedAt",
		],
		deployments
	);
};

get.command("apps").description(descriptions.apps).action(getAppsAction);
get
	.command("envs")
	.description(descriptions.envs)
	.option("-a, --app [appId]", "application id")
	.action(getEnvsAction);
get
	.command("functions")
	.description(descriptions.functions)
	.option("-a, --app [appId]", "application id")
	.action(getFunctionsAction);

get
	.command("builds")
	.description(descriptions.builds)
	.option("-a, --app [appId]", "application id")
	.option("-f, --func [functionId]", "function id")
	.action(getBuildsAction);

get
	.command("deployments")
	.description(descriptions.deployments)
	.option("-a, --app [appId]", "application id")
	.option("-f, --func [functionId]", "function id")
	.action(getDeploymentsAction);

module.exports = {
	get,
};
