const os = require("os");
const fs = require("fs");
const _path = require("path");

const CONFIG_FILE_PATH = ".altogic/config.json";

class CLIConfig {
	constructor() {
		this.path = `${os.homedir()}/${CONFIG_FILE_PATH}`;
		this.read();
	}

	read() {
		try {
			const file = fs.readFileSync(this.path).toString();
			this.config = JSON.parse(file);
		} catch (e) {
			this.config = {};
		}
	}

	write() {
		let dir = _path.dirname(this.path);
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}
		fs.writeFileSync(this.path, JSON.stringify(this.config, null, 2));
	}

	get(key) {
		return this.config[key];
	}

	set(key, value) {
		this.config[key] = value;
		this.write();
	}

	delete(key) {
		delete this.config[key];
		this.write();
	}

	clear() {
		this.config = {};
		this.write();
	}
}

const constants = {
	baseUrl: "http://api.development.test",
};

module.exports = {
	config: new CLIConfig(),
	constants,
};
