const { default: axios } = require("axios");
const keys = require("../config/keys");

module.exports = (isbn) => {
	return new Promise(async (resolve, reject) => {
		const response = await axios.get(
			`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${keys.GOOGLE_BOOKS_API}`
		);
		// console.log(response.data);
		resolve(response.data.items[0]);
	});
};
