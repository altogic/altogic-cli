const { Command } = require("commander");
const { descriptions } = require("../util/descriptions");
const {
	getFunctionBuildLogs,
	getFunctionDeploymentLogs,
	isLoggedIn,
	isError,
} = require("../util/api");
const { error, log, progress, stop } = require("../util/render");
const { config, ConfigManager } = require("../util/config");

const logs = new Command("logs").description(descriptions.logs);

const getBuildLogsAction = async (buildId, options) => {
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

	if (!buildId) {
		return error(descriptions.missingBuildId);
	}

	const spinner = progress(descriptions.gettingLogFile);
	const response = await getFunctionBuildLogs(appId, functionId, buildId);
	stop(spinner);
	if (isError(response))
		return error(response.data.message || response.data.details);

	log(response.data);
};

const getDeploymentLogsAction = async (deploymentId, options) => {
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

	if (!deploymentId) {
		return error(descriptions.missingDeploymentId);
	}

	const spinner = progress(descriptions.gettingLogFile);
	const response = await getFunctionDeploymentLogs(
		appId,
		functionId,
		deploymentId
	);
	stop(spinner);
	if (isError(response))
		return error(response.data.message || response.data.details);

	log(response.data);
};

logs
	.command("build")
	.description(descriptions.buildLogs)
	.argument("<buildId>", "build identifier")
	.option("-a, --app [appId]", "application id")
	.option("-f, --func [functionId]", "function id")
	.action(getBuildLogsAction);

logs
	.command("deployment")
	.description(descriptions.deploymentLogs)
	.argument("<deploymentId>", "deployment identifier")
	.option("-a, --app [appId]", "application id")
	.option("-f, --func [functionId]", "function id")
	.action(getDeploymentLogsAction);

module.exports = {
	logs,
};
