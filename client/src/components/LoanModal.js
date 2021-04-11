import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Context } from "../globalContext";
const LoanModal = (props) => {
	const global = useContext(Context);
	const [friends, setFriends] = useState([]);
	const fetchFriends = async () => {
		const result = await axios.get("/api/friends");

		setFriends(result.data);
	};
	useEffect(() => {
		fetchFriends();
	}, []);

	const loanTo = async (friendId) => {
		await axios.post("/api/loans", {
			bookId: props.bookId,
			lenderId: global.currentUser.id,
			borrowerId: friendId,
		});
	};

	return (
		<>
			<div className="flex flex-wrap py-6 px-8">
				<div>
					{friends
						.filter((friendship) => {
							return friendship.accepted;
						})
						.map((friend, index) => {
							return (
								<div
									onClick={() =>
										loanTo(
											friend.user_id ===
												global.currentUser.id
												? friend.user_id_2
												: friend.user_id
										)
									}
									key={index}
									className="flex items-center my-2"
								>
									<img
										alt={friend.full}
										src={friend.picture}
										className="rounded-full h-12 w-12 mr-4"
									></img>
									<div>{friend.full}</div>
								</div>
							);
						})}
				</div>
			</div>
		</>
	);
};

export default LoanModal;
