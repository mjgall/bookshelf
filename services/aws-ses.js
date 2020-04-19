const AWS = require('aws-sdk');
const keys = require('../config/keys')

module.exports = (recipientAddress, subject, body) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const jsonPath = path.join(__dirname, '..', 'config', 'aws_key.json');
      // AWS.config.loadFromPath(jsonPath);

      AWS.config.update({ accessKeyId: keys.accessKeyId, secretAccessKey: keys.secretAccessKey, region: keys.region })
      const sender = 'Bookshelf <mike@michaeljamesgallagher.com>';

      const recipient = recipientAddress;

      const body_text = body;

      const body_html = body;

      const charset = 'UTF-8';

      const ses = new AWS.SES();

      const params = {
        Source: sender,
        Destination: {
          ToAddresses: [recipient]
        },
        Message: {
          Subject: {
            Data: subject,
            Charset: charset
          },
          Body: {
            Text: {
              Data: body_text,
              Charset: charset
            },
            Html: {
              Data: body_html,
              Charset: charset
            }
          }
        }
        // ConfigurationSetName: configuration_set
      };

      // Try to send the email.
      ses.sendEmail(params, function (err, data) {
        // If something goes wrong, error message.
        if (err) {
          console.log(err.message);
          reject(err.message);
        } else {
          console.log('Email sent! Message ID: ', data.MessageId);
          resolve(data.MessageId);
        }
      });
    } catch (error) {
      reject(error);
      console.log(error);
      throw new Error(error);
    }
  });
};
