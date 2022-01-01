const AWS = require("aws-sdk");
const keys = require("../config/keys");
const { v4: uuidv4 } = require("uuid");
const mime = require("mime-types");
const sharp = require("sharp")


const resizeImage = (imageBuffer) => {
	return new Promise(async (resolve, reject) => {
		resolve(sharp(imageBuffer).resize({ width: 1024 }).jpeg({
			quality: 60,
		}).toBuffer())
	})
}


module.exports = (file) => {
	return new Promise(async (resolve, reject) => {
		try {
			AWS.config.update({
				accessKeyId: keys.accessKeyId,
				secretAccessKey: keys.secretAccessKey,
				region: keys.region,
			});

			const buf = Buffer.from(
				file.base64.replace(/^data:image\/\w+;base64,/, ""),
				"base64"
			);

			const newImage = await resizeImage(buf)

			console.log(newImage);

			const s3 = new AWS.S3();

			// Setting up S3 upload parameters
			const params = {
				Bucket: "papyr-io",
				Key: `${uuidv4()}.${mime.extension(file.type)}`, // File name you want to save as in S3
				Body: await newImage
			};

			console.log(params);

			// Uploading files to the bucket
			s3.upload(params, function (err, file) {
				if (err) {
					throw err;
				}
				resolve(file);
			});
		} catch (error) {
			console.log(error);
			reject(error);
		}
	});
};
