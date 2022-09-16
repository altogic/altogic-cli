const axios = require("axios");
const { constants } = require("./config");

const cliAxios = axios.create({
	baseURL: constants.baseUrl,
	headers: { "Content-Type": "application/json", "accept-language": "en_US" },
});

module.exports = { axios: cliAxios };
