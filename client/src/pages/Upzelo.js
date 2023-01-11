import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { withRouter } from "react-router-dom";
import Button from "../common/Button";

const Upzelo = (props) => {
	const [id, setId] = useState(null);
	const launchUpzelo = (id) => {
		window.upzelo.init({
			customerId: id,
			// selector: "#unsubscribe",
			// type: "full",
		});
		window.upzelo.open();
	};

	useEffect(() => {
		setId(Math.floor(100 + Math.random() * 900));
	}, []);

	return (
		<>
			<Helmet>
				<script
					id="upzpdl"
					src="//assets.upzelo.com/upzelo.min.js"
					appId="upz_app_aa23e5fed554"
				></script>
			</Helmet>
			<Button
				id="unsubscribe"
				color="newblue"
				onClick={() => launchUpzelo(id)}
			>
				Cancel - ID: {id}
			</Button>
		</>
	);
};

export default withRouter(Upzelo);
