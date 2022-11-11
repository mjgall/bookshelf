import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import ReactJson from "react-json-view";
import { Helmet } from "react-helmet";
import { Context } from "../globalContext";
import Tip from "../common/Tip";
import Switch from "react-switch";
import flow from "@prosperstack/flow";

const Cancellation = (props) => {
	const [customPaymentProvider, setCustomPaymentProvider] = useState(true);
	const [cancellationStatus, setCancellationStatus] = useState("");
	const [subscriberId, setsubscriberId] = useState("");
	const [testMode, setTestMode] = useState(false);
	const [internalId, setInternalId] = useState("");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [subscriptionTrial, setTrial] = useState(false);
	const [subscriptionProperties, setSubscriptionProperties] = useState("");
	const [subscriberProperties, setSubscriberProperties] = useState("");
	const [mrr, setMRR] = useState(0);

	const global = React.useContext(Context);

	if (customPaymentProvider) {
		window.__PROSPERSTACK_DEBUG_APP_HOST__ = "https://app.prosperstack.com";
		window.__PROSPERSTACK_DEBUG_API_HOST__ = "https://api.prosperstack.com";
	} else {
		window.__PROSPERSTACK_DEBUG_APP_HOST__ =
			"https://app.staging.prosperstack.com";
		window.__PROSPERSTACK_DEBUG_API_HOST__ =
			"https://api.staging.prosperstack.com";
	}

	const handleSubscriberIdChange = (e) => {
		setsubscriberId(e.target.value);
	};

	const handleInternalIdChange = (e) => {
		setInternalId(e.target.value);
	};

	const handleNameChange = (e) => {
		setName(e.target.value);
	};

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
	};

	const handleSubscriberPropertiesChange = (e) => {
		setSubscriberProperties(e.target.value);
	};

	const handleSubcriptionPropertiesChange = (e) => {
		setSubscriptionProperties(e.target.value);
	};

	const handleMRRChange = (e) => {
		setMRR(e.target.value);
	};

	const callProsperstack = () => {
		if (customPaymentProvider) {
			flow(
				{
					clientId: "acct_k82PIoYRCo32YCglABzogqed",
					// flowId: "flow_Ns3j1zqFf7NmpE6QPz2AkBeY",
					subscriber: {
						internalId: internalId,
						name: name,
						email: email,
						properties: {
							books: global.allBooks.count,
							...JSON.parse(subscriberProperties),
						},
					},
					subscription: {
						mrr: mrr,
						properties: JSON.parse(subscriptionProperties),
					},
				},
				{
					testMode: testMode,
					onCompleted: (result) => {
						if (
							result.status === "saved" &&
							result.offer.id === "offr_vwXnBZyQiN10J6ii8YSjSPhU"
						) {
							console.log("bonus featur unlocked!");
						}
						setCancellationStatus(result);
					},
				}
			);
		} else {
			flow(
				{
					clientId: "acct_j2NsgB3SXjnvFVg8fEhgUkr2",
					flowId: "j8cwF_Q46H42h91H4a_iB",
					subscriber: {
						properties: {
							"Total Books": 100,
						},
					},
					subscription: {
						paymentProviderId: subscriberId || "random_string",
						properties: {
							"Total Books": 100,
						},
					},
				},
				{
					testMode: testMode,
					onCompleted: (result) => {
						if (
							result.status === "saved" &&
							result.offer.id === "offr_vwXnBZyQiN10J6ii8YSjSPhU"
						) {
							console.log("bonus featur unlocked!");
						}
						setCancellationStatus(JSON.stringify(result));
					},
				}
			);
		}
	};

	const updateTestMode = () => {
		if (customPaymentProvider) {
			setsubscriberId("");
		}
		setTestMode(!testMode);
	};

	const updatePaymentProvider = () => {
		setTestMode(false);
		setCustomPaymentProvider(!customPaymentProvider);
	};

	useEffect(() => {
		console.log(cancellationStatus);
	}, [cancellationStatus]);

	return (
		<>
			<Helmet>
				<title>{"PS Cancellation Sandbox"}</title>
			</Helmet>

			<div>
				<div
					className="text-center w-32 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mt-8 rounded cursor-pointer cente"
					onClick={callProsperstack}
				>
					Cancel
				</div>

				<div>
					<label>
						<input
							type="checkbox"
							className="form-checkbox cursor-pointer"
							onChange={updatePaymentProvider}
							checked={customPaymentProvider}
						></input>
						<span>Custom Payment Provider</span>
					</label>
				</div>
				<div>
					<label>
						<input
							type="checkbox"
							className="form-checkbox cursor-pointer"
							onChange={updateTestMode}
							checked={testMode}
						></input>
						<span>Test Mode</span>
					</label>
				</div>
				{testMode ? null : (
					<div>
						{customPaymentProvider ? (
							<>
								<div className="mt-4">
									<div className="text-lg">
										Subscriber Information
									</div>
									<div className="flex flex-col">
										<input
											placeholder="Internal ID"
											onChange={handleInternalIdChange}
											value={internalId}
											className="border border-gray-400 rounded-sm w-1/4"
										></input>
										<input
											placeholder="Name"
											onChange={handleNameChange}
											value={name}
											className="border border-gray-400 rounded-sm w-1/4"
										></input>
										<input
											placeholder="Email"
											onChange={handleEmailChange}
											value={email}
											className="border border-gray-400 rounded-sm w-1/4"
										></input>
										<textarea
											placeholder="Subscriber Properties JSON"
											onChange={
												handleSubscriberPropertiesChange
											}
											value={subscriberProperties}
											className="border border-gray-400 rounded-sm w-1/4"
										></textarea>
									</div>
								</div>
								<div className="mt-4">
									<div className="text-lg">
										Subscription Information
									</div>
									<div className="flex flex-col">
										<input
											placeholder="MRR"
											onChange={handleMRRChange}
											value={mrr}
											className="border border-gray-400 rounded-sm w-1/4"
										></input>
										<div className="flex content-center my-2">
											<div className="text-sm mr-4">
												Trial
											</div>
											<Switch
												onChange={setTrial}
												checked={subscriptionTrial}
												handleDiameter={14}
												height={18}
												width={36}
											/>
										</div>
										<textarea
											placeholder="Subscription Properties JSON"
											onChange={
												handleSubcriptionPropertiesChange
											}
											value={subscriptionProperties}
											className="border border-gray-400 rounded-sm w-1/4"
										></textarea>
									</div>
								</div>
							</>
						) : (
							<input
								placeholder="Stripe ID"
								onChange={handleSubscriberIdChange}
								value={subscriberId}
								className="border border-gray-400 rounded-sm w-1/4"
							></input>
						)}
					</div>
				)}
				{/* <div>{JSON.stringify(cancellationStatus, null, 2)}</div> */}
				{cancellationStatus ? (
					<ReactJson
						theme="grayscale:inverted"
						src={cancellationStatus}
					/>
				) : null}
			</div>
		</>
	);
};

export default withRouter(Cancellation);
