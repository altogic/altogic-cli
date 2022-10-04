#! /usr/bin/env node
const program = require("commander");
const { descriptions } = require("./util/descriptions");
const { version } = require("./package.json");
const { login } = require("./commands/login");
const { logout } = require("./commands/logout");
const { config } = require("./commands/config");
const { create } = require("./commands/create");
const { get } = require("./commands/get");
const { build } = require("./commands/build");
const { deploy } = require("./commands/deploy");
const { apply } = require("./commands/apply");
const { undeploy } = require("./commands/undeploy");

program
	.description(descriptions.main)
	.version(version, "-v, --version", "output the current version")
	.showSuggestionAfterError()
	.addCommand(apply)
	.addCommand(build)
	.addCommand(config)
	.addCommand(create)
	.addCommand(deploy)
	.addCommand(get)
	.addCommand(login)
	.addCommand(logout)
	.addCommand(undeploy)
	.parse(process.argv);