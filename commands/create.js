const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");
const { Command } = require("commander");
const inquirer = require("inquirer");
const { descriptions } = require("../util/descriptions");
const { getApps, createFunction, isLoggedIn, isError } = require("../util/api");
const { error, log, success, progress, stop } = require("../util/render");
const { config, ConfigManager } = require("../util/config");
const {
	questionSelectApp,
	questionsCreateFunction,
} = require("../util/questions");
const { copySync } = require("../util/core");

const create = new Command("create").description(descriptions.create);

const createFunctionAction = async () => {
	if (!isLoggedIn()) return error(descriptions.needLogin);

	let appId = config.get("appId");
	//Check to see if we have the current-app info in configuration file
	if (!appId) {
		const response = await getApps();
		if (isError(response))
			return error(response.data.message || response.data.details);

		if (response.data.length === 0)
			return log(descriptions.noApps, descriptions.functionInstruction);

		const answer = await inquirer.prompt(
			questionSelectApp(response.data, descriptions.selectAppFuncMsg)
		);
		appId = answer.appId;
	}

	let answers = await inquirer.prompt(questionsCreateFunction);
	let funcName = answers.name.trim();

	let spinner = progress(descriptions.initializing);
	//First create the function in Altogic backend
	const response = await createFunction(appId, {
		name: funcName,
	});

	if (isError(response)) {
		stop(spinner);
		return error(
			response.data.fields || response.data.message || response.data.details
		);
	}

	//At this point we have all the data we need, perform checks
	let functionDir = path.join(process.cwd(), funcName);

	if (!fs.existsSync(functionDir)) {
		fs.mkdirSync(functionDir, "777", {
			recursive: true,
		});
	} else {
		stop(spinner);
		return error(descriptions.folderExist(funcName));
	}

	//Clone starter project from github
	let gitInitCommands =
		"git clone --depth 1 --sparse https://github.com/altogic/function-templates .";
	let gitPullCommands = `git sparse-checkout add ${answers.runtime.id}`;

	if (process.platform == "win32") {
		gitInitCommands = 'cmd /c "' + gitInitCommands + '"';
		gitPullCommands = 'cmd /c "' + gitPullCommands + '"';
	}

	try {
		childProcess.execSync(gitInitCommands, { stdio: "pipe", cwd: functionDir });
		childProcess.execSync(gitPullCommands, { stdio: "pipe", cwd: functionDir });
	} catch (error) {
		if (error.message.includes("error: unknown option")) {
			stop(spinner);
			return error(descriptions.unknownOption(error.message));
		} else if (
			error.message.includes(
				"is not recognized as an internal or external command,"
			) ||
			error.message.includes("command not found")
		) {
			stop(spinner);
			return error(descriptions.gitNotInstalled(error.message));
		} else {
			stop(spinner);
			return error(error.message);
		}
	}

	//Delete unnecessary files and prepare the local repo
	fs.rmSync(path.join(functionDir, ".git"), { recursive: true });
	fs.rmSync(path.join(functionDir, "LICENSE"), { recursive: true });
	fs.rmSync(path.join(functionDir, "README.md"), { recursive: true });
	copySync(path.join(functionDir, answers.runtime.id), functionDir);
	fs.rmSync(path.join(functionDir, answers.runtime.id), {
		recursive: true,
		force: true,
	});

	let funcConfig = new ConfigManager(functionDir);
	funcConfig.setConfig({
		appId: appId,
		functionId: response.data._id,
		name: funcName,
		runtime: answers.runtime.id,
		entrypoint: answers.runtime.entrypoint,
	});

	stop(spinner);
	success();
};

create
	.command("function")
	.description(descriptions.createFunction)
	.action(createFunctionAction);

module.exports = {
	create,
};
