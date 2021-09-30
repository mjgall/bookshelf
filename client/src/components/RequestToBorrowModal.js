import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Context } from "../globalContext";
import { Link } from "react-router-dom";

const RequestToBorrowModal = (props) => {
	const global = useContext(Context);
	const [friendsWithBook, setfriendsWithBook] = useState([]);
	const fetchFriendsWithBook = async () => {
		const result = await axios.get(`/api/friendwithbook/${props.bookId}`);

		setfriendsWithBook(result.data);
	};
	useEffect(() => {
		fetchFriendsWithBook();
	}, []);

	const borrowFrom = async (friendId, friendName) => {

		await axios.post("/api/loans", {
			bookId: props.bookId,
			lenderId: friendId,
			borrowerId: global.currentUser.id,
			requesting: true
		});

		// const index = global.allBooks.findIndex(
		// 	(book) => book.user_book_id === global.userBookId
		// );

		// let updatedAllBooks = [...global.allBooks];
		// updatedAllBooks[index].on_loan = 1;
		// updatedAllBooks[index].borrower_id = friendId;
		// updatedAllBooks[index].full = friendName;
		// global.setGlobal({ allBooks: updatedAllBooks });

		global.setGlobal({ modalOpen: false });
	};

	return (
		<>
			<div className="flex flex-wrap py-6 px-8">
				<div>
					{friendsWithBook.length < 1 ? (
						<div className="text-center text my-1 text-gray-500 italic font-weight-light">
							<div>
								You don't have any friendsWithBook, create a
								household or connect with friends from
							</div>
							<Link
								onClick={() =>
									global.setGlobal({ modalOpen: false })
								}
								className="border-gray-600 border-dotted border-b"
								to="/profile"
							>
								your profile.
							</Link>
						</div>
					) : (
						<>
							<div className="text-lg font-weight-bold">
								Request From:
							</div>
							{friendsWithBook.map((connection, index) => {
								return (
									<div
										onClick={() =>
											borrowFrom(
												connection.user_id,
												connection.full
											)
										}
										key={index}
										className="flex items-center my-2 cursor-pointer"
									>
										<img
											alt={connection.full}
											src={connection.picture}
											className="rounded-full h-12 w-12 mr-4"
										></img>
										<div>{connection.full}</div>
									</div>
								);
							})}
						</>
					)}
				</div>
			</div>
		</>
	);
};

export default RequestToBorrowModal;
