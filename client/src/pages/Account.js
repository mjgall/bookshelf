import React, { useContext } from "react";
import moment from "moment";
import { Context } from "../globalContext";
import Transparent from "../components/Transparent";
import axios from "axios";
import Tip from "../common/Tip"

const Account = (props) => {
	const global = useContext(Context);
	const [shelfEnabled, setShelfEnabled] = React.useState(
		global.currentUser.shelf_enabled
	);

	const toggleShelfEnabled = () => {
		axios.put("/api/users", {
			field: "shelf_enabled",
			value: !shelfEnabled,
		});

		setShelfEnabled(!shelfEnabled);
	};

	return (
		<div>
			<div className="flex">
				<div className="md:text-left text-center">
					<div className="text-2xl font-bold">Account</div>
				</div>
			</div>
			<div className="text-xl font bold underline mb-2">
				<a
					target="_blank"
					rel="noopener noreferrer"
					href="https://gllghr.io/blog/bookshelf-improvements/"
				>
					Improvements to be made (gllghr.io)
				</a>
			</div>
			<div>
				Joined{" "}
				{moment(global.currentUser.create_date).format(
					"MMMM Do YYYY - h:mm a"
				)}
			</div>
			<div>
				<div className="md:text-left text-center">
					<div className="text-2xl font-bold">Settings</div>
				</div>
				<div>
					<div className="flex items-center">
						<div>Public Shelf Available</div>
						<Tip
							content="Whether your shared shelf is visible at the link found in your Profile."
							placement="right"
							size="1rem"
							className="ml-2"
						></Tip>
						<input
							style={{
								height: "1.5rem",
								width: "1.5rem",
							}}
							className="mx-2 cursor-pointer"
							type="checkbox"
							checked={shelfEnabled}
							onChange={toggleShelfEnabled}
						></input>
					</div>
				</div>
			</div>
			{global.currentUser.admin ? <Transparent></Transparent> : null}
		</div>
	);
};

export default Account;
