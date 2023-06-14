const { PostHog } = require("posthog-node");

const client = new PostHog("phc_DbgHM9qK6bG9vPMnws0tFkyNVKJvS6CUsyq81XLXGFA", {
	host: "https://app.posthog.com",
});

module.exports = client;
