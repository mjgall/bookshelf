import axios from "axios";
import React, { useState, useContext } from "react";
import { withRouter, Link } from "react-router-dom";

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
        if (response.data.message === 'redirect') {
            const user = await axios.get("/api/current_user")
            global.setGlobal({currentUser: user.data})
            global.setAuth()
            props.history.push("/");    
          } else {
            console.error(response.data)
          }
	};

	return (
		<div className="md:container my-4">
			<form className="w-full max-w-sm mx-auto" onSubmit={submit}>
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
							Log in
						</button>
					</div>
					<div className="mt-1">
						<Link to="/register">
							<button
								className="shadow bg-royalblue hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
								type="button"
							>
								Register
							</button>
						</Link>
					</div>
				</div>
			</form>
		</div>
	);
};

export default withRouter(Login);

