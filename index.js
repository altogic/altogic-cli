#! /usr/bin/env node
const program = require("commander");
const { descriptions } = require("./util/descriptions");
const { version } = require("./package.json");
const { login } = require("./commands/login");
const { logout } = require("./commands/logout");
const { config } = require("./commands/config");
const { get } = require("./commands/get");

program
	.description(descriptions.main)
	.version(version, "-v, --version", "output the current version")
	.showSuggestionAfterError()
	.addCommand(config)
	.addCommand(get)
	.addCommand(login)
	.addCommand(logout)
	.parse(process.argv);
