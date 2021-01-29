import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import axios from "axios";

import { Context } from "../globalContext";
import MoreMenu from "../common/MoreMenu";
import { ThumbUp } from "@styled-icons/heroicons-outline";
import { CommentAdd } from "@styled-icons/boxicons-regular";

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

	const updateActivity = async (id) => {
		const result = await axios.put("/api/activities", {
			field: "hidden",
			value: true,
			id,
			owner_id: global.currentUser.id,
		});
		if (result) {
			setActivities(
				activities.filter((activity) => activity.id !== result.data.id)
			);
		}
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

	const handleLike = async (item) => {
		console.log(item);
		const result = await axios.post("/api/interactions", {
			type: "like",
			activityId: item.id,
		});
		console.log(result);
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
						className="border-gray-400 border mt-2 mb-2 pr-6 rounded flex items-center"
						key={index}
					>
						<div className="flex items-center">
							{item.user_id === global.currentUser.id ? (
								<div>
									<MoreMenu
										placement="left"
										size="18px"
										options={[
											{
												action: () =>
													updateActivity(item.id),
												confirm: true,
												text: "Hide activity",
											},
										]}
									></MoreMenu>
								</div>
							) : null}
							<div
								className={
									item.user_id === global.currentUser.id
										? "h-12 w-12 mr-2"
										: "h-12 w-12 mr-2 ml-4"
								}
							>
								<img
									alt="user"
									src={item.friend_picture}
									className="rounded-full h-12 w-12 mr-2"
								></img>
							</div>
						</div>
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
							<div className="flex text-xs my-1">
								<div
									className="mr-2 cursor-pointer"
									onClick={() => handleLike(item)}
								>
									<ThumbUp
										color="lightgray"
										size="1.5em"
									></ThumbUp>
								</div>
								<div className="ml-2 cursor-pointer">
									<CommentAdd
										color="lightgray"
										size="1.5em"
									></CommentAdd>
								</div>
							</div>
						</div>
						<div className="ml-auto flex items-center">
							<div>
								<Link to={`/book/${item.object_id}`}>
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
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default Feed;
