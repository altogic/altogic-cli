const fs = require("fs");
const path = require("path");

function copySync(src, dest) {
	let exists = fs.existsSync(src);
	let stats = exists && fs.statSync(src);
	let isDirectory = exists && stats.isDirectory();

	if (isDirectory) {
		if (!fs.existsSync(dest)) fs.mkdirSync(dest);

		fs.readdirSync(src).forEach(function (childItemName) {
			copySync(path.join(src, childItemName), path.join(dest, childItemName));
		});
	} else fs.copyFileSync(src, dest);
}

function getFiles(folder) {
	const files = [];
	for (const pathDir of fs.readdirSync(folder)) {
		const pathAbsolute = path.join(folder, pathDir);
		if (fs.statSync(pathAbsolute).isDirectory()) {
			files.push(...getFiles(pathAbsolute));
		} else {
			files.push(pathAbsolute);
		}
	}
	return files;
}

module.exports = {
	copySync: copySync,
	getFiles: getFiles,
};
