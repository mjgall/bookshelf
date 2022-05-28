const { default: axios } = require("axios");
const keys = require("../config/keys");

module.exports = (value, type) => {
	return new Promise(async (resolve, reject) => {
		let response;

		try {
			if (type === "isbn") {
				response = await axios.get(
					`https://www.googleapis.com/books/v1/volumes?q=isbn:${value}&key=${keys.GOOGLE_BOOKS_API}`
				);
			} else if (type === "query") {
				response = await axios.get(
					`https://www.googleapis.com/books/v1/volumes?q=${value}&maxResults=12&key=${keys.GOOGLE_BOOKS_API}`
				);
			}

			if (response.data.totalItems === 0) {
				reject("No information found on Google.");
			} else if (type === "isbn") {
				resolve(response.data.items[0]);
			} else {
				resolve(
					response.data.items.filter((result) => {
						if (result.saleInfo.isEbook) {
							return;
						} else {
							return result;
						}
					})
				);
			}
		} catch (error) {
			reject(`Something went wrong: ${error}`);
		}
	});
};
