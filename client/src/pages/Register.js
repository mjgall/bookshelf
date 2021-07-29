import axios from "axios";
import React, { useState } from "react";
import { Link, Redirect, withRouter } from "react-router-dom";

const Register = (props) => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");

	const updateFirstName = (e) => {
		setFirstName(e.target.value);
	};

	const updateLastName = (e) => {
		setLastName(e.target.value);
	};

	const updatePassword = (e) => {
		setPassword(e.target.value);
	};

	const updateEmail = (e) => {
		setEmail(e.target.value);
	};

	const submit = async () => {
		const response = await axios.post("/auth/register", { firstName, lastName, password, email });
		if (response.status === 200 && response.data.message === "success") {
			props.history.push('/login')
		}
	};

	return (
		<div className="md:container my-4">
			<form className="w-full max-w-sm mx-auto" onSubmit={submit}>
				<div className="md:flex md:items-center mb-6">
					<div className="md:w-1/3">
						<label
							className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
							for="inline-first-name"
						>
							First Name
						</label>
					</div>
					<div className="md:w-2/3">
						<input
							className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-400"
							id="inline-first-name"
							type="text"
							placeholder="Jane"
							value={firstName}
							onChange={updateFirstName}
						></input>
					</div>
				</div>
				<div className="md:flex md:items-center mb-6">
					<div className="md:w-1/3">
						<label
							className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
							for="inline-last-name"
						>
							Last Name
						</label>
					</div>
					<div className="md:w-2/3">
						<input
							className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-400"
							id="inline-last-name"
							type="text"
							placeholder="Doe"
							value={lastName}
							onChange={updateLastName}
						></input>
					</div>
				</div>
				<div className="md:flex md:items-center mb-6">
					<div className="md:w-1/3">
						<label
							className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
							for="inline-email"
						>
							Email
						</label>
					</div>
					<div className="md:w-2/3">
						<input
							className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-400"
							id="inline-email"
							type="text"
							placeholder="mail@domain.com"
							value={email}
							onChange={updateEmail}
						></input>
					</div>
				</div>
				<div className="md:flex md:items-center mb-6">
					<div className="md:w-1/3">
						<label
							className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
							for="inline-password"
						>
							Password
						</label>
					</div>
					<div className="md:w-2/3">
						<input
							className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-400"
							id="inline-password"
							type="password"
							placeholder="******************"
							value={password}
							onChange={updatePassword}
						></input>
					</div>
				</div>
				<div className="flex-col align-middle items-center text-center">
					<div className="mb-1">
						<button
							className="shadow bg-royalblue hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
							type="button"
							onClick={submit}
						>
							Register
						</button>
					</div>
					<div className="mt-1">
						<Link to="/login">
							<button
								className="shadow bg-royalblue hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
								type="button"
							>
								Log In
							</button>
						</Link>
					</div>
				</div>
			</form>
		</div>
	);
};

export default withRouter(Register);
