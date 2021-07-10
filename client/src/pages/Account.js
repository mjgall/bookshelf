import React, { useContext } from "react";
import moment from "moment";
import { Context } from "../globalContext";
import Transparent from "../components/Transparent";
import axios from "axios";
import Tip from "../common/Tip";
import Switch from "react-switch";

const Account = (props) => {
	const global = useContext(Context);
	const [shelfEnabled, setShelfEnabled] = React.useState(
		global.currentUser.shelf_enabled
	);

	const [searchable, setSearchable] = React.useState(
		global.currentUser.searchable
	);

	const toggleSearchable = () => {
		axios.put("/api/users", {
			field: "searchable",
			value: !searchable,
		});

		setSearchable(!searchable);
	};

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
					<div className="flex items-center justify-between md:w-1/2 border-b border-t border-dashed border-black py-2">
						<div className="flex items-center">
							<div className="md:ml-0 ml-4 text-lg">Public Shelf Available</div>
							<Tip
								content="Whether your shared shelf is visible at the link found in your Profile."
								placement="bottom"
								size="1rem"
								className="ml-2"
							></Tip>
						</div>
						<Switch className="mr-4 md:mr-0"
							onChange={toggleShelfEnabled}
							checked={shelfEnabled}
						/>
					</div>
					<div className="flex items-center justify-between md:w-1/2 border-b border-dashed border-black py-2">
						<div className="flex items-center">
							<div className="md:ml-0 ml-4 text-lg">Searchable</div>
							<Tip
								content="Whether you are seachable from others' Profiles by your name."
								placement="bottom"
								size="1rem"
								className="ml-2"
							></Tip>
						</div>
						<Switch className="mr-4 md:mr-0"
							onChange={toggleSearchable}
							checked={searchable}
						/>
					</div>
				</div>
			</div>
			{global.currentUser.admin ? <Transparent></Transparent> : null}
		</div>
	);
};

export default Account;
