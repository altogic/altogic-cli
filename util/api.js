const fs = require("fs");
const { axios } = require("./axios");
const FormData = require("form-data");
const { config } = require("./config");

const isLoggedIn = () => {
	return config.get("token") === undefined || config.get("userId") === undefined
		? false
		: true;
};

const isError = (response) => {
	return response.status !== 200;
};

const initializeLogin = async (email) => {
	try {
		let result = await axios.post("/users/cli-login", { email });
		return result;
	} catch (err) {
		return err.response;
	}
};

const loginUserPwd = async (email, password) => {
	try {
		let result = await axios.post("/users/login", { email, password });
		return result;
	} catch (err) {
		return err.response;
	}
};

const loginUserCode = async (email, code) => {
	try {
		let result = await axios.post("/users/login-code", { email, code });
		return result;
	} catch (err) {
		return err.response;
	}
};

const logoutUser = async () => {
	try {
		let result = await axios.post(
			`/users/${config.get("userId")}/logout`,
			null,
			{
				headers: { Authorization: config.get("token") },
			}
		);
		return result;
	} catch (err) {
		return err.response;
	}
};

const getApps = async () => {
	try {
		let result = await axios.get(`/users/${config.get("userId")}/apps`, {
			headers: { Authorization: config.get("token") },
		});
		return result;
	} catch (err) {
		return err.response;
	}
};

const getApp = async (appId) => {
	try {
		let result = await axios.get(
			`/users/${config.get("userId")}/apps/${appId}`,
			{
				headers: { Authorization: config.get("token") },
			}
		);
		return result;
	} catch (err) {
		return err.response;
	}
};

const getEnvs = async (appId) => {
	try {
		let result = await axios.get(
			`/users/${config.get("userId")}/apps/${appId}/envs`,
			{
				headers: { Authorization: config.get("token") },
			}
		);
		return result;
	} catch (err) {
		return err.response;
	}
};

const getEnv = async (appId, envId) => {
	try {
		let result = await axios.get(
			`/users/${config.get("userId")}/apps/${appId}/envs/${envId}`,
			{
				headers: { Authorization: config.get("token") },
			}
		);
		return result;
	} catch (err) {
		return err.response;
	}
};

const getRuntimes = async () => {
	try {
		let result = await axios.get(`/users/${config.get("userId")}/runtimes`, {
			headers: { Authorization: config.get("token") },
		});
		return result;
	} catch (err) {
		return err.response;
	}
};

const createFunction = async (appId, payload) => {
	try {
		let result = await axios.post(
			`/users/${config.get("userId")}/apps/${appId}/functions`,
			payload,
			{
				headers: { Authorization: config.get("token") },
			}
		);
		return result;
	} catch (err) {
		return err.response;
	}
};

const getFunctions = async (appId) => {
	try {
		let result = await axios.get(
			`/users/${config.get("userId")}/apps/${appId}/functions`,
			{
				headers: { Authorization: config.get("token") },
			}
		);
		return result;
	} catch (err) {
		return err.response;
	}
};

const getFunctionBuilds = async (appId, functionId) => {
	try {
		let result = await axios.get(
			`/users/${config.get(
				"userId"
			)}/apps/${appId}/functions/${functionId}/builds`,
			{
				headers: { Authorization: config.get("token") },
			}
		);
		return result;
	} catch (err) {
		return err.response;
	}
};

const getFunctionBuildLogs = async (appId, functionId, buildId) => {
	try {
		let result = await axios.get(
			`/users/${config.get(
				"userId"
			)}/apps/${appId}/functions/${functionId}/builds/${buildId}/logs`,
			{
				headers: { Authorization: config.get("token") },
			}
		);
		return result;
	} catch (err) {
		return err.response;
	}
};

const getFunctionDeploymentLogs = async (appId, functionId, deploymentId) => {
	try {
		let result = await axios.get(
			`/users/${config.get(
				"userId"
			)}/apps/${appId}/functions/${functionId}/deployments/${deploymentId}/logs`,
			{
				headers: { Authorization: config.get("token") },
			}
		);
		return result;
	} catch (err) {
		return err.response;
	}
};

const getFunctionDeployments = async (appId, functionId) => {
	try {
		let result = await axios.get(
			`/users/${config.get(
				"userId"
			)}/apps/${appId}/functions/${functionId}/deployments`,
			{
				headers: { Authorization: config.get("token") },
			}
		);
		return result;
	} catch (err) {
		return err.response;
	}
};

const buildFunction = async (functionConfig, filePath) => {
	try {
		const form = new FormData();
		form.append("code", fs.createReadStream(filePath));
		form.append("config", JSON.stringify(functionConfig));

		let result = await axios.post(
			`/users/${config.get("userId")}/apps/${functionConfig.appId}/functions/${
				functionConfig.functionId
			}/builds`,
			form,
			{
				headers: { Authorization: config.get("token"), ...form.getHeaders() },
				maxBodyLength: 1000000000,
			}
		);

		return result;
	} catch (err) {
		return err.response;
	}
};

const deployFunction = async (functionConfig, filePath) => {
	try {
		const form = new FormData();
		form.append("code", fs.createReadStream(filePath));
		form.append("config", JSON.stringify(functionConfig));

		let result = await axios.post(
			`/users/${config.get("userId")}/apps/${functionConfig.appId}/functions/${
				functionConfig.functionId
			}/deployments`,
			form,
			{
				headers: { Authorization: config.get("token"), ...form.getHeaders() },
				maxBodyLength: 1000000000,
			}
		);

		return result;
	} catch (err) {
		return err.response;
	}
};

const applyFunction = async (funcConfig) => {
	try {
		let result = await axios.post(
			`/users/${config.get("userId")}/apps/${funcConfig.appId}/functions/${
				funcConfig.functionId
			}/builds/${funcConfig.buildId}/apply`,
			funcConfig,
			{
				headers: { Authorization: config.get("token") },
			}
		);

		return result;
	} catch (err) {
		return err.response;
	}
};

const undeployFunction = async (funcConfig) => {
	try {
		let result = await axios.post(
			`/users/${config.get("userId")}/apps/${funcConfig.appId}/functions/${
				funcConfig.functionId
			}/undeploy`,
			funcConfig,
			{
				headers: { Authorization: config.get("token") },
			}
		);

		return result;
	} catch (err) {
		return err.response;
	}
};

module.exports = {
	isError,
	isLoggedIn,
	initializeLogin,
	loginUserPwd,
	loginUserCode,
	logoutUser,
	getApps,
	getApp,
	getEnvs,
	getEnv,
	getRuntimes,
	createFunction,
	getFunctions,
	getFunctionBuilds,
	getFunctionDeployments,
	buildFunction,
	deployFunction,
	applyFunction,
	undeployFunction,
	getFunctionBuildLogs,
	getFunctionDeploymentLogs,
};
