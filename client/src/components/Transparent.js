import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import Button from "../common/Button";
import { Redirect, withRouter } from "react-router-dom";
import { Context } from "../globalContext";

const Transparent = (props) => {
	const [id, setId] = useState("");
	const [loaded, setLoaded] = useState(false);
	// const [authed, setAuthed] = useState(false);
	const [admin, setAdmin] = useState(false);
	const global = useContext(Context);

	const handleIdChange = (e) => {
		setId(e.target.value);
	};
	const login = async (e) => {
		e.preventDefault();

		const result = await axios.post("/auth/transparent", {
			email: "empty",
			password: "empty",
			id: id,
		});

		if (result.data.message === "redirect") {
			global.setGlobal({ currentUser: result.data.user });
			global.setAuth();
			// setAuthed(true);
		}
	};

	useEffect(() => {
		if (global.currentUser && global.currentUser.id === 1) {
			setAdmin(true);
			setLoaded(true);
		} else {
			setLoaded(true);
			props.history.push("/");
		}
	}, [global, props]);

	return loaded && admin ? (
		<div>
			<input
				value={id}
				onChange={handleIdChange}
				onSubmit={login}
			></input>
			<Button onClick={login}>Login</Button>
		</div>
	) : null;
};

export default withRouter(Transparent);
