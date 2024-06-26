import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import ReactJson from "react-json-view";
import { Helmet } from "react-helmet";
import { Context } from "../globalContext";
import Switch from "react-switch";
import flow from "@prosperstack/flow";
import Button from "../common/Button";
import axios from "axios";

const Cancellation = (props) => {
	const [customPaymentProvider, setCustomPaymentProvider] = useState(false);
	const [cancellationStatus, setCancellationStatus] = useState("");
	const [subscriberId, setsubscriberId] = useState("");
	const [convertSubscriberId, setConvertSubscriberId] = useState("");
	const [testMode, setTestMode] = useState(false);
	const [internalId, setInternalId] = useState("");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [subscriptionTrial, setTrial] = useState(false);
	const [subscriptionProperties, setSubscriptionProperties] = useState("{}");
	const [subscriberProperties, setSubscriberProperties] = useState("{}");
	const [mrr, setMRR] = useState(0);
	const [staging, setStaging] = useState(false);
	const [modal, setModal] = useState(false);

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

	const handleConvertSubscriberIdChange = (e) => {
		setConvertSubscriberId(e.target.value);
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
		if (customPaymentProvider && !modal) {
			console.log("calling custom and not modal flow");
			flow(
				{
					clientId: "acct_k82PIoYRCo32YCglABzogqed",
					// flowId: "flow_Ns3j1zqFf7NmpE6QPz2AkBeY",
					subscriber: {
						internalId: internalId,
						name: name,
						email: email,
						properties: {
							books: global.allBooks.length,
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
					onClosed: (result) => {
						console.log("onClosed fired.");
					},
					onCompleted: (result) => {
						if (
							result.status === "saved" &&
							result.offer.id === "offr_vwXnBZyQiN10J6ii8YSjSPhU"
						) {
							console.log("bonus featur unlocked!");
						}
						console.log("onCompleted fired");
						setCancellationStatus(result);
					},
				}
			);
		} else if (staging) {
			console.log("calling staging flow");
			flow(
				{
					clientId: "acct_XRTIa9ArbEB0mj1kS5e0vMFv",
					subscription: {
						paymentProviderId: testMode
							? "random_string"
							: subscriberId,
					},
				},
				{
					testMode: testMode,
					onCompleted: (result) => {
						setCancellationStatus(result);
					},
				}
			);
		} else if (modal && customPaymentProvider) {
			console.log("calling modal flow");
			flow(
				{
					clientId: "acct_k82PIoYRCo32YCglABzogqed",
					flowId: "flow_ak50s5PjbpHQlAHMysdg3WjQ",
					subscriber: {
						internalId: internalId,
						name: name,
						email: email,
						properties: {
							books: global.allBooks.length,
							...JSON.parse(subscriberProperties),
						},
					},
					subscription: {
						mrr: mrr,
						properties: JSON.parse(subscriptionProperties),
					},
				},
				{
					displayMode: "modal",
					testMode: testMode,
					onClosed: (result) => {
						console.log("onClosed fired.");
					},
					onCompleted: (result) => {
						if (
							result.status === "saved" &&
							result.offer.id === "offr_vwXnBZyQiN10J6ii8YSjSPhU"
						) {
							console.log("bonus featur unlocked!");
						}
						console.log("onCompleted fired");
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
						setCancellationStatus(result);
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
		if (customPaymentProvider) {
			setModal(false);
		}

		setTestMode(false);
		setStaging(false);
		setCustomPaymentProvider(!customPaymentProvider);
	};

	const updateStaging = () => {
		setModal(false);
		setTestMode(false);
		setCustomPaymentProvider(false);
		setStaging(!staging);
	};

	const updateModal = () => {
		setTestMode(false);
		setStaging(false);
		setModal(!modal);
	};

	const callStripeProdPS = async () => {
		// const payload = {
		// 	clientId: "acct_xWnc1RG2xF0QLCcc5HBizyhA",
		// 	subscription: {
		// 		platformId: convertSubscriberId,
		// 	},
		// };
		// const signature = await axios
		// 	.post("/api/sign-prosperstack")
		// 	.then((res) => res.data);
		// console.log(signature);
		// flow({
		// 	payload: JSON.stringify(payload),
		// 	signature: signature,
		// });

		flow(
			{
				clientId: "acct_xWnc1RG2xF0QLCcc5HBizyhA",
				subscription: {
					platformId: convertSubscriberId,
				},
			},
			{
				sign: async (payload) => {
					try {
						const response = await fetch("/api/sign-prosperstack", {
							method: "POST",
							body: JSON.stringify({ payload }),
							headers: {
								"Content-Type": "application/json",
							},
						});
						const signature = (await response.json()).digest;

						return signature;
					} catch (error) {
						console.log(error);
						return;
					}
				},
			}
		);
	};

	useEffect(() => {
		console.log(cancellationStatus);
	}, [cancellationStatus]);

	return (
		<>
			<Helmet>
				<title>{"ProsperStack Playground"}</title>
			</Helmet>
			<div className="border border-gray-500 mt-4 px-6 py-4">
				<div className="mb-2">Cancel Flow Playground:</div>

				<div>
					<div>
						<label>
							<input
								type="checkbox"
								className="form-checkbox cursor-pointer"
								onChange={updateModal}
								checked={modal}
							></input>
							<span>Modal</span>
						</label>
					</div>
					<div>
						<label>
							<input
								type="checkbox"
								className="form-checkbox cursor-pointer"
								onChange={updateStaging}
								checked={staging}
							></input>
							<span>Staging (with test mode)</span>
						</label>
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
							<span>Test Mode (deprecated)</span>
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
												onChange={
													handleInternalIdChange
												}
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
					<div
						className="text-center w-32 bg-red-500 hover:bg-red-700 text-white font-bold mt-2 py-2 px-4 rounded cursor-pointer cente"
						onClick={callProsperstack}
					>
						Cancel
					</div>
					{/* <div>{JSON.stringify(cancellationStatus, null, 2)}</div> */}
					{cancellationStatus ? (
						<ReactJson
							theme="grayscale:inverted"
							src={cancellationStatus}
						/>
					) : null}
				</div>
			</div>
			<div className="border border-gray-500 mt-4 px-6 py-4">
				<div className="mb-2">MJG - Stripe + Convert (620):</div>
				<input
					placeholder="Convert subscription ID (Stripe sub_)"
					onChange={handleConvertSubscriberIdChange}
					value={convertSubscriberId}
					className="border border-gray-400 rounded-sm w-1/4"
				></input>
				<div>
					<Button onClick={() => callStripeProdPS()}>Cancel</Button>
				</div>
				<div>
					<Button
						onClick={async () => {
							setConvertSubscriberId("");
							//create new subscription for mike@gllghr.io customer in stripe
							const response = await axios.post(
								"/api/create-subscription"
							);

							setConvertSubscriberId(response.data.id);
						}}
					>
						Generate sub_
					</Button>
				</div>
				{cancellationStatus ? (
					<ReactJson
						theme="grayscale:inverted"
						src={cancellationStatus}
					/>
				) : null}
			</div>
			<div className="border border-gray-500 mt-4 px-6 py-4">
				<div className="mb-2">Convert Playground:</div>
				<input
					placeholder="Convert subscription ID (Stripe sub_)"
					onChange={handleConvertSubscriberIdChange}
					value={convertSubscriberId}
					className="border border-gray-400 rounded-sm w-1/4"
				></input>
				<div>
					<Button
						onClick={async () => {
							let psResponse =
								await window.ProsperStack.convert.init(
									convertSubscriberId ||
										"sub_1NIe5NFdi6zax6LRC0s82mky"
								);
							console.log(psResponse);
						}}
					>
						Convert Test
					</Button>
				</div>
				<div>
					<Button
						onClick={async () => {
							setConvertSubscriberId("");
							//create new subscription for mike@gllghr.io customer in stripe
							const response = await axios.post(
								"/api/create-subscription"
							);

							setConvertSubscriberId(response.data.id);
						}}
					>
						Generate sub_
					</Button>
				</div>
			</div>
		</>
	);
};

export default withRouter(Cancellation);
