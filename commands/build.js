const fs = require("fs");
const path = require("path");
const tar = require("tar");
const ignore = require("ignore");
const { Command } = require("commander");
const { descriptions } = require("../util/descriptions");
const {
	buildFunction,
	getRuntimes,
	isLoggedIn,
	isError,
} = require("../util/api");
const {
	error,
	success,
	info,
	progress,
	start,
	stop,
	stopSuccess,
} = require("../util/render");
const { ConfigManager, constants } = require("../util/config");
const { getFiles } = require("../util/core");

const buildFunctionAction = async () => {
	if (!isLoggedIn()) return error(descriptions.needLogin);

	let folderPath = fs.realpathSync(process.cwd());
	if (!fs.lstatSync(folderPath).isDirectory())
		return error(descriptions.notDirectory(process.cwd()));

	let configFile = path.join(process.cwd(), constants.configFile);
	if (!fs.existsSync(configFile)) return error(descriptions.missingConfigFile);

	let funcConfig = new ConfigManager(process.cwd());
	let appId = funcConfig.get("appId").trim();
	let functionId = funcConfig.get("functionId").trim();
	let runtime = funcConfig.get("runtime").trim();
	let entrypoint = funcConfig.get("entrypoint").trim();
	let funcName = funcConfig.get("name").trim();

	const spinner = progress(descriptions.checkingConfigFile);
	//Check to see if we have the current-app info in configuration file
	if (!appId) {
		stop(spinner);
		return error(descriptions.missingAppIdInConfig);
	}
	if (!functionId) {
		stop(spinner);
		return error(descriptions.missingFunctionIdInConfig);
	}
	if (!funcName) {
		stop(spinner);
		return error(descriptions.missingFunctionNameInConfig);
	}
	if (!runtime) {
		stop(spinner);
		return error(descriptions.missingRuntimeInConfig);
	}
	if (!entrypoint) {
		stop(spinner);
		return error(descriptions.missingEntrypointInConfig);
	}

	//Check whether entrypoint file is valid or not
	let entryFile = path.join(process.cwd(), entrypoint);
	if (!fs.existsSync(entryFile))
		return error(descriptions.missingEntryFile(entrypoint));

	let runtimes = await getRuntimes();
	if (!runtimes.data.find((entry) => entry.version === runtime)) {
		stop(spinner);
		return error(
			descriptions.invalidRuntime(
				runtime,
				runtimes.data.map((entry) => entry.version).join(" | ")
			)
		);
	}
	stopSuccess(spinner);

	//Create source code files list
	const ignorer = ignore();
	if (fs.existsSync(path.join(process.cwd(), ".gitignore"))) {
		ignorer.add(
			fs.readFileSync(path.join(process.cwd(), ".gitignore")).toString()
		);
	}

	//Create tar file
	start(spinner, descriptions.creatingTarFile);
	const files = getFiles(process.cwd())
		.map((file) => path.relative(process.cwd(), file))
		.filter((file) => !ignorer.ignores(file));

	tar.create(
		{
			gzip: true,
			sync: true,
			cwd: folderPath,
			file: constants.codeFile,
		},
		files
	);
	stopSuccess(spinner);

	//Upload file
	start(spinner, descriptions.uploadingCode);
	const response = await buildFunction(
		{
			appId,
			functionId,
			runtime,
			entrypoint,
			funcName,
		},
		path.join(process.cwd(), constants.codeFile)
	);

	if (isError(response)) {
		stop(spinner);
		return error(
			response.data.fields || response.data.message || response.data.details
		);
	}

	//Delete the tar file
	fs.rmSync(path.join(process.cwd(), constants.codeFile), { recursive: true });
	stopSuccess(spinner);
	success();

	info(descriptions.buildInfo1);
	info(descriptions.buildInfo2);
};

const build = new Command("build")
	.description(descriptions.build)
	.action(buildFunctionAction);

module.exports = {
	build,
};
