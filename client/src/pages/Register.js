import axios from "axios";
import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { Google } from "@styled-icons/boxicons-logos";


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
		<div className="sm:container md:max-w-md my-4">
			<form className="bg-white sm:shadow-md sm:rounded px-8 pt-6 pb-8 mb-4">
			<div className="mb-4">
					<label
						className="block text-gray-700 text-sm font-bold mb-2"
						for="first-name"
					>
						First Name
					</label>
					<input
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="first-name"
						type="text"
						placeholder="Jane"
						value={firstName}
						onChange={updateFirstName}
					></input>
				</div>
				<div className="mb-4">
					<label
						className="block text-gray-700 text-sm font-bold mb-2"
						for="last-name"
					>
						Last Name
					</label>
					<input
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="last-name"
						type="text"
						placeholder="Doe"
						value={lastName}
						onChange={updateLastName}
					></input>
				</div>
				<div className="mb-4">
					<label
						className="block text-gray-700 text-sm font-bold mb-2"
						for="email"
					>
						Email
					</label>
					<input
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="email"
						type="text"
						placeholder="email@domain.com"
						value={email}
						onChange={updateEmail}
					></input>
				</div>
				<div className="mb-6">
					<label
						className="block text-gray-700 text-sm font-bold mb-2"
						for="password"
					>
						Password
					</label>
					<input
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
						id="password"
						type="password"
						placeholder="*******"
						value={password}
						onChange={updatePassword}
					></input>
				</div>
				<div className="flex items-center justify-between">
					<button
						className="bg-newblue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						type="button"
						onClick={submit}
					>
						Register
					</button>
					<Link
						className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
						to="/login"
					>
						Have an account already?
					</Link>
				</div>
			</form>
			<div className="bg-white sm:shadow-md sm:rounded px-2 mb-4">
				<a
					href={
						global.redirect
							? `/auth/google/redirect${global.redirect}`
							: `/auth/google`
					}
					className="inline-block text-sm px-2 leading-none border rounded border-white hover:border-transparent text-newblue hover:text-blue-600 hover:bg-white lg:mt-0 "
				>
					<div className="flex items-center">
						<div>
							<Google size="4em"></Google>
						</div>
						<div className="ml-4 text-lg text-gray-700">Register with Google</div>
					</div>
				</a>
			</div>
		</div>
	);
};

export default withRouter(Register);
