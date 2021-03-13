import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { ArrowFromLeft as LoginIcon } from "@styled-icons/boxicons-regular/ArrowFromLeft";
import Tip from "../common/Tip"
import { withRouter } from "react-router-dom";
import { Context } from "../globalContext";

const Transparent = (props) => {
	const [id, setId] = useState("");
	const [loaded, setLoaded] = useState(false);
	const [users, setUsers] = useState([]);
	const [admin, setAdmin] = useState(false);
	const global = useContext(Context);

	const handleIdChange = (e) => {
		setId(e.target.value);
	};
	const login = async (e, tableId) => {
		if (e) e.preventDefault();

		const result = await axios.post("/auth/transparent", {
			email: "empty",
			password: "empty",
			id: id || tableId,
		});

		if (result.data.message === "redirect") {
			global.setGlobal({ currentUser: result.data.user });
			global.setAuth();
		}
	};

	const getUsers = async () => {
		const users = await axios.get("/api/users");
		setUsers(users.data);
	};

	useEffect(() => {
		if (global.currentUser && global.currentUser.admin) {
			setAdmin(true);
			getUsers();
			setLoaded(true);
		} else {
			setLoaded(true);
			props.history.push("/");
		}
	}, [global, props]);

	return loaded && admin ? (
		// <div>
		// 	<input
		// 		value={id}
		// 		onChange={handleIdChange}
		// 		onSubmit={login}
		// 	></input>
		// 	<Button onClick={login}>Login</Button>
		// </div>
		<div>
			<form
				onSubmit={(e) => e.preventDefault()}
				className="w-full max-w-md"
			>
				<div className="flex items-center border-b border-black ">
					<input
						className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 pr-2 leading-tight focus:outline-none"
						type="text"
						placeholder="User ID"
						value={id}
						onChange={handleIdChange}
						aria-label="user id"
					></input>
					<button
						onClick={login}
						className="bg-royalblue hover:bg-blue-700 text-white my-1 mx-1 py-1 px-4 rounded focus:outline-none focus:shadow-outlineundefined"
						type="submit"
					>
						Login
					</button>
				</div>
			</form>
			<table className="w-full">
				<thead>
					<tr>
						<th className="text-left">Name</th>
						<th className="text-left">Email</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{users.map((user, index) => {
						return (
							<tr key={index}>
								<td>{user.full}</td>
								<td>{user.email}</td>
								<td>
									<div>
										<Tip
											renderChildren
											content="Transparent Login"
											placement="left"
										>
											<LoginIcon
												className="cursor-pointer"
												size="1.5em"
												onClick={() => login(null, user.id)}
											></LoginIcon>
										</Tip>
									</div>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	) : null;
};

export default withRouter(Transparent);
