import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import axios from "axios";

import { Context } from "../globalContext";

const Feed = (props) => {
	const getSavedSelfFilter = () => {
		const local = JSON.parse(localStorage.getItem("hideSelf"));
		if (local) {
			return local;
		} else {
			return false;
		}
	};

	const [activities, setActivities] = useState([]);
	const [hideSelf, setHideSelf] = useState(getSavedSelfFilter());
	const global = useContext(Context);

	const data = () => {
		if (hideSelf) {
			return activities.filter((activity) => {
				return activity.user_id !== global.currentUser.id;
			});
		} else {
			return activities;
		}
	};

	const toggleHideSelf = () => {
		setHideSelf(!hideSelf);
		localStorage.setItem("hideSelf", !hideSelf);
	};

	const fetchActivities = async () => {
		const result = await axios.get("/api/activities");
		setActivities(result.data);
	};

	useEffect(() => {
		fetchActivities();
	}, []);

	const determineAction = (actionNumber) => {
		switch (actionNumber) {
			case 1:
				return "started reading";
			case 2:
				return "read";
			case 3:
				return "added";
			case 4:
				return "removed";
			default:
				break;
		}
	};

	return (
		<div>
			<div className="md:text-left text-center">
				<div className="text-2xl font-bold">Friend Activity</div>
			</div>
			<div className="flex items-center ml-2">
				<input
					style={{ height: "1.5rem", width: "1.5rem" }}
					className="mx-2 cursor-pointer"
					type="checkbox"
					checked={hideSelf}
					onChange={toggleHideSelf}
				></input>
				<div>Hide self</div>
			</div>
			{data().map((item, index) => {
				return (
					<div
						className="border-gray-400 border mt-2 mb-2 px-6 py-2 rounded flex items-center"
						key={index}
					>
						<img
							alt="user"
							src={item.friend_picture}
							className="rounded-full h-12 w-12 mr-2"
						></img>
						<div>
							<div>
								<span className="font-bold">
									{item.user_id === global.currentUser.id
										? "You"
										: item.friend_full}
								</span>{" "}
								{determineAction(item.action)}{" "}
								<Link
									className="border-gray-600 border-dotted border-b"
									to={`/book/${item.object_id}`}
								>
									{item.title}
								</Link>
							</div>
							<div className="text-xs font-thin">
								{moment
									.unix(item.timestamp / 1000)
									.format("dddd, MMMM Do YYYY, h:mm:ss a")}
							</div>
						</div>
						<Link
							className="ml-auto"
							to={`/book/${item.object_id}`}
						>
							{item.cover ? (
								<img
									alt="user"
									src={item.cover}
									className="h-16"
								></img>
							) : (
								<div className="w-12 rounded h-16 border-gray-400 border"></div>
							)}
						</Link>
					</div>
				);
			})}
		</div>
	);
};

export default Feed;
