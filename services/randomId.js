const crypto = require("crypto");

const generateId = () => {
	return crypto.randomBytes(3).toString("hex");
};

module.exports = generateId
