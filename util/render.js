const chalk = require("chalk");
const Table = require("cli-table3");
const ora = require("ora");

const log = (message1, message2, message3) => {
	console.log(message1, message2 ?? "", message3 ?? "");
};

const success = (message) => {
	console.log(`${chalk.green.bold("✔ Success")} ${chalk.green(message ?? "")}`);
};

const error = (message) => {
	if (Array.isArray(message)) {
		message.forEach((entry) =>
			console.error(
				`${chalk.red.bold("✗ Error")} ${chalk.red(entry.msg ?? "")}`
			)
		);
	} else
		console.error(`${chalk.red.bold("✗ Error")} ${chalk.red(message ?? "")}`);
};

const info = (message) => {
	console.log(`${chalk.cyan.bold("ℹ Info")} ${chalk.cyan(message ?? "")}`);
};

const vTable = (object) => {
	let table = new Table({
		chars: {
			top: "",
			"top-mid": "",
			"top-left": "",
			"top-right": "",
			bottom: "",
			"bottom-mid": "",
			"bottom-left": "",
			"bottom-right": "",
			left: "",
			"left-mid": "",
			mid: "",
			"mid-mid": "",
			right: "",
			"right-mid": "",
			middle: "",
		},
	});
	for (const [key, value] of Object.entries(object)) {
		let entry = {};
		entry[chalk.yellow.bold(key)] = value;
		table.push(entry);
	}
	log(table.toString());
};

const hTable = (headers, rows) => {
	let table = new Table({
		head: headers.map((entry) => chalk.reset.bold(entry)),
		chars: {
			top: "",
			"top-mid": "",
			"top-left": "",
			"top-right": "",
			bottom: "",
			"bottom-mid": "",
			"bottom-left": "",
			"bottom-right": "",
			left: "",
			"left-mid": "",
			mid: "",
			"mid-mid": "",
			right: "",
			"right-mid": "",
			middle: "",
		},
	});
	for (let i = 0; i < rows.length; i++) {
		const entry = rows[i];
		table.push(Object.values(entry));
	}

	log(table.toString());
};

const progress = (text) => {
	return ora(text).start();
};

const start = (spinner, text) => {
	spinner.start(text);
};

const stop = (spinner) => {
	spinner.stop();
};

const stopSuccess = (spinner, text) => {
	spinner.succeed(text);
};

module.exports = {
	log,
	success,
	error,
	info,
	progress,
	start,
	stop,
	stopSuccess,
	vTable,
	hTable,
};
