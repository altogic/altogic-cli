const fs = require("fs");
const path = require("path");
const { Command } = require("commander");
const nodemon = require("nodemon");
const micro = require("micro");
const { json, send } = require("micro");
const { ConfigManager, constants } = require("../util/config");
const { descriptions } = require("../util/descriptions");
const { error, log } = require("../util/render");
const { isLoggedIn } = require("../util/api");

const server = micro(async (req, res) => {
	let logs = [];
	let payload = {};

	try {
		payload = await json(req);
	} catch (err) {}

	const request = {
		ids: payload.ids ?? {},
		query: payload.query ?? {},
		headers: payload.headers ?? {},
		appParams: payload.appParams ?? {},
		client: payload.client ?? {},
		session: payload.session ?? {},
		appInfo: payload.appInfo ?? {},
		body: payload.body ?? {},
		files: payload.files
			? payload.files.map((entry) => {
					return { ...entry, contents: Buffer.from(entry.contents) };
			  })
			: [],
	};

	//Bind console ouptput
	console.stdlog = console.log.bind(console);
	console.stderror = console.error.bind(console);
	console.stdinfo = console.info.bind(console);
	console.stddebug = console.debug.bind(console);
	console.stdwarn = console.warn.bind(console);

	const logger = (type) => {
		return function () {
			var args = [];
			Array.from(arguments).forEach((arg) => {
				if (arg instanceof Object || Array.isArray(arg)) {
					args.push(JSON.stringify(arg));
				} else {
					args.push(arg);
				}
			});
			logs.push({
				timestamp: new Date().toISOString(),
				type: type,
				message: args.join(" "),
			});
		};
	};

	//Override the colsole output methods
	console.log = logger("log");
	console.info = logger("info");
	console.debug = logger("debug");
	console.error = logger("error");
	console.warn = logger("warn");

	//Define the response object
	const response = {
		send: (text, status = 200) =>
			send(res, status, {
				response: text,
				logs,
			}),
		json: (json, status = 200) =>
			send(res, status, {
				response: json,
				logs,
			}),
	};

	try {
		let funcConfig = new ConfigManager(process.cwd());
		let userFunction = require(process.cwd() +
			"/" +
			funcConfig.get("entrypoint"));
		if (
			!(
				userFunction &&
				typeof userFunction === "function" &&
				(userFunction.constructor || userFunction.call || userFunction.apply)
			) ||
			(userFunction.default &&
				!(
					userFunction.default.constructor ||
					userFunction.default.call ||
					userFunction.default.apply
				))
		) {
			throw new Error(
				`Function specified in path ${userFunction} is not valid. A callable function is required.`
			);
		}

		if (userFunction.default) {
			await userFunction.default(request, response);
		} else {
			await userFunction(request, response);
		}
	} catch (err) {
		logs.push({
			timestamp: new Date().toISOString(),
			type: "error",
			message: err.stack ? err.stack : err,
		});
		send(res, 400, { logs });
	}

	//Reset values
	logs = [];
	console.log = console.stdlog;
	console.error = console.stderror;
	console.debug = console.stddebug;
	console.warn = console.stdwarn;
	console.info = console.stdinfo;
});

const startLocalDevelopmentAction = (port) => {
	if (!isLoggedIn()) return error(descriptions.needLogin);

	let folderPath = fs.realpathSync(process.cwd());
	if (!fs.lstatSync(folderPath).isDirectory())
		return error(descriptions.notDirectory(process.cwd()));

	let configFile = path.join(process.cwd(), constants.configFile);
	if (!fs.existsSync(configFile)) return error(descriptions.missingConfigFile);

	nodemon({
		script: process.cwd(),
		ext: "js json",
	});

	nodemon.on("restart", function (files) {
		//Clear cache
		Object.keys(require.cache).forEach(function (key) {
			delete require.cache[key];
		});

		log("Function restarted due to: ", files);
	});

	let portNumber = port ?? constants.localDevelopmentPort;
	if (
		isNaN(portNumber) ||
		parseInt(Number(portNumber)) != portNumber ||
		isNaN(parseInt(portNumber, 10))
	)
		return error(descriptions.invalidPortNumber(portNumber));

	if (portNumber < 0 || portNumber >= 65536)
		return error(descriptions.portOutofBounds(portNumber));

	log(descriptions.localServerRunning(portNumber));
	server.listen(portNumber);
};

const start = new Command("start")
	.description(descriptions.start)
	.argument("[port]", "port number")
	.action(startLocalDevelopmentAction);

module.exports = {
	start,
};
