const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const { Command } = require("commander");
const { descriptions } = require("../util/descriptions");
const {
	getEnvs,
	undeployFunction,
	isLoggedIn,
	isError,
} = require("../util/api");
const {
	error,
	success,
	progress,
	stop,
	stopSuccess,
} = require("../util/render");
const { ConfigManager, constants, config } = require("../util/config");
const { questionUndeployEnv } = require("../util/questions");

const undeployFunctionAction = async (options) => {
	if (!isLoggedIn()) return error(descriptions.needLogin);

	let configFile = path.join(process.cwd(), constants.configFile);
	if (!fs.existsSync(configFile)) return error(descriptions.missingConfigFile);

	let funcConfig = new ConfigManager(process.cwd());
	let appId = funcConfig.get("appId").trim();
	let functionId = funcConfig.get("functionId").trim();
	let envId = options?.env ?? config.get("envId");

	//Check to see if we have the current-app info in configuration file
	if (!appId) return error(descriptions.missingAppIdInConfig);
	if (!functionId) return error(descriptions.missingFunctionIdInConfig);

	//If environment is missing then ask for it
	if (!envId) {
		const response = await getEnvs(appId);
		if (isError(response))
			return error(response.data.message || response.data.details);

		if (response.data.length === 0) return log(descriptions.noEnvs);
		else if (response.data.length === 1) envId = response.data[0]._id;
		else {
			const answer = await inquirer.prompt(
				questionUndeployEnv(
					response.data.sort((a, b) => {
						let alower = a.name.toLowerCase();
						let blower = b.name.toLowerCase();
						if (alower < blower) return -1;
						if (alower > blower) return 1;
						return 0;
					})
				)
			);
			envId = answer.envId;
		}
	}

	//Upload file
	const spinner = progress(descriptions.undeployingFunction);
	const response = await undeployFunction({
		appId,
		envId,
		functionId,
	});

	if (isError(response)) {
		stop(spinner);
		return error(
			response.data.fields || response.data.message || response.data.details
		);
	}

	stopSuccess(spinner);
	success();
};

const undeploy = new Command("undeploy")
	.description(descriptions.undeploy)
	.option("-e, --env [envId]", "environment id")
	.action(undeployFunctionAction);

module.exports = {
	undeploy,
};
