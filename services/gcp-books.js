const { default: axios } = require("axios");
const keys = require("../config/keys");

module.exports = (isbn) => {
	return new Promise(async (resolve, reject) => {
		console.log(isbn);
		const response = await axios.get(
			`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${keys.GOOGLE_BOOKS_API}`
		);
		console.log(response.data);
		if (response.data.totalItems === 0) {
			reject("No information found on Google.");
		} else {
			resolve(response.data.items[0]);
		}
	});
};
