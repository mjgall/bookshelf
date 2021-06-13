import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { Context } from "../globalContext";

const LoanBox = ({ book, user, loan, index }) => {
	return (
		<div
			className="border-gray-400 border mt-2 mb-2 pr-6 rounded flex items-center"
			key={index}
		>
			<div className="flex items-center">
				<div className="h-12 w-12 mr-2 ml-4">
					<img
						alt="user"
						src={user.user_picture}
						className="rounded-full h-12 w-12 mr-2"
					></img>
				</div>
			</div>
			<div>
				<div>
					<span className="font-bold">You </span>
					<span>
						{loan.type === "lend" ? "loaned " : "borrowed "}
					</span>
					<Link
						className="border-gray-600 border-dotted border-b"
						to={`/book/${book.global_id}`}
					>
						{book.title}
					</Link>
					{loan.type === "lend" ? " to " : " from "}
					<span>{user.user_name}</span>
				</div>
				<div className="text-xs font-thin">
					{moment
						.unix(loan.start_date / 1000)
						.format("dddd, MMMM Do YYYY, h:mm:ss a")}
				</div>
				<div className="flex text-xs my-1">
					{/* <div
					className="mr-2 cursor-pointer"
					onClick={() => {
						updateLike(item);
					}}
				>
					{item.likeContent?.people.length > 0 ? (
						<Tip
							content={
								item.likeContent.string
									? item.likeContent.string
									: "Like"
							}
							renderChildren
							placement="right"
						>
							<ThumbUpSolid
								color={item.likeContent.color}
								size="1.5em"
							></ThumbUpSolid>
						</Tip>
					) : (
						<Tip content="Like" renderChildren placement="right">
							<ThumbUp color="lightgray" size="1.5em"></ThumbUp>
						</Tip>
					)}
				</div>
				<div>{item.likeContent?.total}</div> */}
				</div>
			</div>
			<div className="ml-auto flex items-center">
				<div>
					<Link to={`/book/${book.global_id}`}>
						{book.cover ? (
							<img
								alt="user"
								src={book.cover}
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
};

const Loans = (props) => {
	const global = useContext(Context);

	const [loans, setLoans] = useState([]);
	const getLoans = async () => {
		const loans = await axios
			.get("/api/loans")
			.then((response) => response.data);
		setLoans(loans);
	};

	useEffect(() => {
		getLoans();
	}, []);

	return (
		<div>
			<div>
				<div className="text-xl">Borrowed</div>
				{loans
					.filter(
						(book) => book.borrower_id === global.currentUser.id
					)
					.map((loan, index) => {
						return (
							<LoanBox
								book={{
									global_id: loan.global_id,
									title: loan.title,
									cover: loan.cover,
								}}
								user={{
									user_id: loan.user_id,
									user_name: loan.user_name,
									user_picture: loan.user_picture,
								}}
								loan={{
									borrower_id: loan.borrower_id,
									lender_id: loan.lender_id,
									start_date: loan.start_date,
									end_date: loan.end_date,
									id: loan.id,
									type:
										loan.lender_id === global.currentUser.id
											? "lend"
											: "borrow",
								}}
								index={index}
							></LoanBox>
						);
					})}
			</div>
			<div>
				<div className="text-xl">Loaned</div>
				{loans
					.filter((book) => book.lender_id === global.currentUser.id)
					.map((loan, index) => {
						return (
							<LoanBox
								book={{
									global_id: loan.global_id,
									title: loan.title,
									cover: loan.cover,
								}}
								user={{
									user_id: loan.user_id,
									user_name: loan.user_name,
									user_picture: loan.user_picture,
								}}
								loan={{
									borrower_id: loan.borrower_id,
									lender_id: loan.lender_id,
									start_date: loan.start_date,
									end_date: loan.end_date,
									id: loan.id,
									type:
										loan.lender_id === global.currentUser.id
											? "lend"
											: "borrow",
								}}
								index={index}
							></LoanBox>
						);
					})}
			</div>
		</div>
	);
};

export default Loans;
