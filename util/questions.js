const questionLoginEmail = [
	{
		type: "input",
		name: "email",
		message: "Enter your email or username:",
		validate(value) {
			if (!value) {
				return "Please enter your email or username";
			}
			return true;
		},
	},
];

const questionLoginCode = [
	{
		type: "input",
		name: "code",
		message: "Enter your authorization code:",
		validate(value) {
			if (!value) {
				return "Please enter your authorization code";
			}
			return true;
		},
	},
];

const questionLoginPassword = [
	{
		type: "password",
		name: "password",
		message: "Enter your password:",
		mask: "*",
		validate(value) {
			if (!value) {
				return "Please enter your password";
			}
			return true;
		},
	},
];

module.exports = {
	questionLoginEmail,
	questionLoginCode,
	questionLoginPassword,
};
