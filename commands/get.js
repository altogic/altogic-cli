const { Command } = require("commander");
const { descriptions } = require("../util/descriptions");
const { getApps, getEnvs, isLoggedIn, isError } = require("../util/api");
const { error, hTable } = require("../util/render");
const { config } = require("../util/config");

const get = new Command("get").description(descriptions.get);

const getAppsAction = async () => {
	if (!isLoggedIn()) error(descriptions.needLogin);

	const response = await getApps();
	if (isError(response))
		return error(response.data.message || response.data.details);

	//Sort apps by name
	let apps = response.data;
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
	if (!isLoggedIn()) error(descriptions.needLogin);

	let appId = options?.app ?? config.get("appId");
	if (!appId) {
		return error(descriptions.missingAppId);
	}
	const response = await getEnvs(appId);
	if (isError(response))
		return error(response.data.message || response.data.details);

	//Sort envs by name
	let envs = response.data;
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

get.command("apps").description(descriptions.apps).action(getAppsAction);
get
	.command("envs")
	.description(descriptions.envs)
	.option("-a, --app <appId>", "application id")
	.action(getEnvsAction);

module.exports = {
	get,
};
