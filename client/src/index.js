import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { GlobalProvider } from "./globalContext";
import * as serviceWorker from "./serviceWorker";
import ErrorBoundary from "./common/ErrorBoundary";
import { PostHogProvider } from "posthog-js/react";

const config = {
	api_host: process.env.REACT_APP_PUBLIC_POSTHOG_HOST,
};

ReactDOM.render(
	<ErrorBoundary>
		<PostHogProvider
			apiKey={process.env.REACT_APP_PUBLIC_POSTHOG_KEY}
			config={config}
		>
			<GlobalProvider>
				<App />
			</GlobalProvider>
		</PostHogProvider>
	</ErrorBoundary>,

	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
