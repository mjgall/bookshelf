import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
	CheckSquare,
	PlusSquare,
	ChevronDownSquare,
} from "@styled-icons/boxicons-solid";
import { MailSend } from "@styled-icons/boxicons-regular";
import Tip from "../common/Tip";

import { Context } from "../globalContext";
import { Link } from "react-router-dom";
import { searchWithCancel } from "../utils";

//live search credits to this article: https://www.digitalocean.com/community/tutorials/react-live-search-with-axios

const Friends = (props) => {
	const global = useContext(Context);
	const [friends, setFriends] = useState([]);
	const [searchResults, setSearchResults] = useState([]);

	const [friendMenuOpen, setFriendMenuOpen] = useState(false);
	const [values, setValues] = useState({
		email: "",
		quantity: 0,
		unitCost: 0,
	});

	const search = async (val) => {
		const res = await searchWithCancel(`/api/users/search/${val}`);
		setSearchResults(res);
	};

	const handleValueChange = async (e) => {
		const { name, value } = e.target;

		if (value.length >= 2) {
			search(value);
		} else if (value.length < 2) {
			setSearchResults([]);
		}

		setValues({ ...values, [name]: value });
	};

	const sendInvite = async (friend, index) => {
		const response = await axios.post("/api/friends", {
			userEmail: friend.email,
		});

		if (response) {
			const newResults = searchResults;
			newResults[index].sent = true;
			setSearchResults(newResults);
		}

		setValues({ ...values, email: "" });
		setFriendMenuOpen(!friendMenuOpen);
	};

	const editInvite = async (friendshipId, action) => {
		await axios.put("/api/friends", {
			friendshipId,
			action,
		});
		const fetchFriends = async () => {
			const result = await axios.get("/api/friends");

			setFriends(result.data);
		};

		fetchFriends();
	};

	useEffect(() => {
		const fetchFriends = async () => {
			const result = await axios.get("/api/friends");

			setFriends(result.data);
		};

		fetchFriends();
	}, []);

	return (
		<div className="md:w-full w-5/6 container">
			<div className="flex items-center w-full justify-between">
				<div className="text-2xl font-bold">Friends</div>
				{friendMenuOpen ? (
					<ChevronDownSquare
						onClick={() => setFriendMenuOpen(!friendMenuOpen)}
						size="2em"
						className="cursor-pointer text-green-400"
					></ChevronDownSquare>
				) : (
					<Tip renderChildren content="Add friend" placement="left">
						<PlusSquare
							onClick={() => setFriendMenuOpen(!friendMenuOpen)}
							size="2em"
							className="cursor-pointer text-green-400"
						></PlusSquare>
					</Tip>
				)}
			</div>
			{friendMenuOpen ? (
				<div className="w-full">
					<div className="flex items-center border-b border-b-1 border-newblue ">
						<input
							name="email"
							className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 pr-2 leading-tight focus:outline-none"
							type="text"
							placeholder="Type name to search"
							value={values.email}
							onChange={handleValueChange}
							aria-label="Friend email"
						></input>
					</div>
				</div>
			) : null}
			{searchResults ? (
				<div>
					<ul>
						{searchResults.map((result, index) => {
							if (result.sent) {
								return (
									<div
										key={index}
										className="flex my-1 border-gray-500 rounded-sm px-2 border items-center"
									>
										<div>Invite sent!</div>
										<div className="ml-auto mr-0">
											<Tip
												renderChildren
												content="Sent!"
												placement="left"
											>
												<MailSend
													size="2em"
													className="cursor-pointer text-gray-400"
												></MailSend>
											</Tip>
										</div>
									</div>
								);
							} else {
								return (
									<div
										key={index}
										className="flex my-1 border-gray-500 rounded-sm px-2 border items-center"
									>
										<div>{result.full}</div>
										<div className="ml-auto mr-0">
											<Tip
												renderChildren
												content="Send invite"
												placement="left"
											>
												<MailSend
													onClick={() =>
														sendInvite(
															result,
															index
														)
													}
													size="2em"
													className="cursor-pointer text-green-400"
												></MailSend>
											</Tip>
										</div>
									</div>
								);
							}
						})}
					</ul>
				</div>
			) : null}

			<div>
				<div>
					{friends.filter((friendship) => {
						return friendship.accepted && !friendship.declined;
					}) < 1 ? (
						<div className="text-xs my-1 text-gray-500 italic font-weight-light">
							You don't have any friends. Search by name and add
							some here.
						</div>
					) : null}

					<div>
						{friends
							.filter((friendship) => {
								return friendship.accepted;
							})
							.map((friend, index) => {
								return (
									<div
										key={index}
										className="flex items-center my-2"
									>
										<img
											alt={friend.full}
											src={friend.picture}
											className="rounded-full h-12 w-12 mr-4"
										></img>
										<Link
											className="cursor-pointer"
											to={`/shelf/${
												friend.shelf_id
											}`}
										>
											<div>{friend.full}</div>
										</Link>
									</div>
								);
							})}
					</div>
				</div>
				{friends.filter((friendship) => {
					return (
						!friendship.accepted &&
						!friendship.declined &&
						friendship.user_id_2 === global.currentUser.id
					);
				}).length > 0 ? (
					<>
						<div>Pending Invites</div>
						<div>
							{friends
								.filter((friendship) => {
									return (
										!friendship.accepted &&
										!friendship.declined &&
										friendship.user_id_2 ===
											global.currentUser.id
									);
								})
								.map((friend, index) => {
									return (
										<div
											key={index}
											className="flex items-center my-2"
										>
											<img
												alt={friend.full}
												src={friend.picture}
												className="rounded-full h-12 w-12 mr-4"
											></img>
											<div className="flex items-center">
												<div>
													<Tip
														content="Accept"
														renderChildren
														placement="right"
													>
														<CheckSquare
															size="2em"
															className="cursor-pointer text-green-400 w-full"
															onClick={() =>
																editInvite(
																	friend.friendship_id,
																	"accept"
																)
															}
														></CheckSquare>
													</Tip>
												</div>
												<div>{friend.full}</div>
											</div>
										</div>
									);
								})}
						</div>
					</>
				) : null}
			</div>
		</div>
	);
};

export default Friends;
