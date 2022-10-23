const os = require("os");
const fs = require("fs");
const _path = require("path");

const constants = {
	globalConfigFile: ".altogic/config.json",
	configFile: "altogic.json",
	baseUrl: "https://api.altogic.com", //"http://api.development.test",
	codeFile: "function-code.tar.gz",
};

class ConfigManager {
	constructor(path, configFile = constants.configFile) {
		this.path = `${path}/${configFile}`;
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

	setConfig(config) {
		this.config = config;
		this.write();
	}
}

module.exports = {
	config: new ConfigManager(os.homedir(), constants.globalConfigFile),
	constants,
	ConfigManager,
};
