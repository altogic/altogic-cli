const { axios } = require("./axios");
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

module.exports = {
	isError,
	isLoggedIn,
	initializeLogin,
	loginUserPwd,
	loginUserCode,
	getApps,
	getEnvs,
};
