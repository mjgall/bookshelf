import axios from "axios";
import React, { useState, useContext } from "react";
import { withRouter, Link } from "react-router-dom";
import { Google } from "@styled-icons/boxicons-logos";

import { Context } from "../globalContext";
const Login = (props) => {
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");

	const global = useContext(Context);

	const updatePassword = (e) => {
		setPassword(e.target.value);
	};

	const updateEmail = (e) => {
		setEmail(e.target.value);
	};

	const submit = async () => {
		const response = await axios.post("/auth/login", { password, email });
		if (response.data.message === "redirect") {
			const user = await axios.get("/api/current_user");
			global.setGlobal({ currentUser: user.data });
			global.setAuth();
			props.history.push("/");
		} else {
			console.error(response.data);
		}
	};

	return (
		<div className="sm:container md:max-w-md my-4">
			<form className="bg-white sm:shadow-md sm:rounded px-8 pt-6 pb-8 mb-4">
				<div className="mb-4">
					<label
						className="block text-gray-700 text-sm font-bold mb-2"
						for="username"
					>
						Email
					</label>
					<input
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="username"
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
						className="bg-royalblue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						type="button"
						onClick={submit}
					>
						Sign In
					</button>
					<Link
						className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
						to="/register"
					>
						Create an account instead
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
					className="inline-block text-sm px-2 leading-none border rounded border-white hover:border-transparent text-royalblue hover:text-blue-600 hover:bg-white lg:mt-0 "
				>
					<div className="flex items-center">
						<div>
							<Google size="4em"></Google>
						</div>
						<div className="ml-4 text-lg text-gray-700">Log in with Google</div>
					</div>
				</a>
			</div>
		</div>
	);
};

export default withRouter(Login);
