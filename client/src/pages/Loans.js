import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { Context } from "../globalContext";

import MoreMenu from "../common/MoreMenu";
import Tip from "../common/Tip";

const LoanBox = ({ book, user, loan, index, update }) => {
	const global = useContext(Context);
	const endLoan = async () => {
		const response = await axios.put("/api/loans", {
			action: "end",
			id: loan.id,
			user_books_id: loan.user_books_id,
		});

		if (response) {
			const index = global.allBooks.findIndex(
				(allBook) => allBook.id === book.global_id
			);
			let updatedAllBooks = [...global.allBooks];
			updatedAllBooks[index].on_loan = 0;
			updatedAllBooks[index].borrower_id = null;
			global.setGlobal({ allBooks: updatedAllBooks });
		}
		update();
	};

	const grantLoan = async () => {
		console.log("loan granted");
	};

	const determineVerb = (type) => {
		switch (type) {
			case "lend":
				return "loaned ";
			case "borrow":
				return "borrowed ";
			case "requested":
				return "requested ";
			case "request":
				return "requested ";
			default:
				break;
		}
	};

	return (
		<div
			className="border-gray-400 border mt-2 mb-2 pr-6 rounded flex items-center"
			key={index}
		>
			<div className="flex items-center">
				{(!loan.end_date && loan.start_date) ||
				(!loan.start_date &&
					loan.borrower_id !== global.currentUser.id) ? (
					<div>
						{loan.type === "request" ? (
								<MoreMenu
								placement="left"
								size="18px"
								options={[
									{
										action: () => grantLoan(),
										confirm: true,
										text: "Grant loan",
									},
								]}
							></MoreMenu>
						) : (<MoreMenu
							placement="left"
							size="18px"
							options={[
								{
									action: () => endLoan(),
									confirm: true,
									text: "End loan",
								},
							]}
						></MoreMenu>)}
						
					</div>
				) : null}

				<div
					className={
						loan.end_date || (!loan.start_date && loan.borrower_id === global.currentUser.id) ? "h-12 w-12 mr-2 ml-4" : "h-12 w-12 mr-2"
					}
				>
					<img
						alt="user"
						src={user.user_picture}
						className="rounded-full h-12 w-12 mr-2"
					></img>
				</div>
			</div>
			<div>
				<div>
					<span className="font-bold">
						{loan.type === "request" || loan.type === "lend"
							? `${user.user_name} `
							: "You "}
					</span>
					<span>{determineVerb(loan.type)}</span>
					<Link
						className="border-gray-600 border-dotted border-b"
						to={`/book/${book.global_id}`}
					>
						{book.title}
					</Link>
					{loan.type === "lend" ? " to " : " from "}
					<span>
						{loan.type === "request" || loan.type === "lend"
							? "you."
							: `${user.user_name}.`}
					</span>
				</div>
				<span className="text-xs font-thin">
					{moment
						.unix(loan.start_date / 1000)
						.format("dddd, MMMM Do YYYY, h:mm:ss a")}

					{loan.end_date ? (
						<span>
							<span className="mr-2 ml-2">to</span>
							{moment
								.unix(loan.end_date / 1000)
								.format("dddd, MMMM Do YYYY, h:mm:ss a")}
						</span>
					) : null}
				</span>
				<div className="flex text-xs my-1"></div>
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

	const update = () => {
		getLoans();
	};

	useEffect(() => {
		getLoans();
	}, []);

	const determineLoanType = (lenderId, currentUserId, startDate) => {
		if (lenderId === currentUserId && startDate) {
			return "lend";
		} else if (lenderId !== currentUserId && startDate) {
			return "borrow";
		} else if (lenderId !== currentUserId && !startDate) {
			return "requested";
		} else if (lenderId === currentUserId && !startDate) {
			return "request";
		}
	};

	return (
		<div>
			<div className="flex items-center text-center">
				<div className="text-2xl font-bold">Loans</div>
				<Tip
					content="You can track books you've loaned to friends and household members."
					placement="right"
					size="1rem"
					className="ml-2"
				></Tip>
			</div>
			<div>
				<div className="text-xl">Loan Requests</div>
				{loans.filter(
					(book) =>
						(book.borrower_id === global.currentUser.id ||
							book.lender_id === global.currentUser.id) &&
						!book.end_date &&
						!book.start_date
				).length < 1 ? (
					<div className="text-xs my-1 text-gray-500 italic font-weight-light">
						You have not requested any books.
					</div>
				) : (
					<>
						{loans
							.filter(
								(book) =>
									(book.borrower_id ===
										global.currentUser.id ||
										book.lender_id ===
											global.currentUser.id) &&
									!book.end_date &&
									!book.start_date
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
											user_books_id: loan.user_books_id,
											borrower_id: loan.borrower_id,
											lender_id: loan.lender_id,
											start_date: loan.start_date,
											end_date: loan.end_date,
											id: loan.id,
											type: determineLoanType(
												loan.lender_id,
												global.currentUser.id,
												loan.start_date
											),
										}}
										index={index}
										update={update}
									></LoanBox>
								);
							})}
					</>
				)}
			</div>
			<div>
				<div className="text-xl">Borrowed</div>
				{loans.filter(
					(book) =>
						book.borrower_id === global.currentUser.id &&
						!book.end_date &&
						book.start_date
				).length < 1 ? (
					<div className="text-xs my-1 text-gray-500 italic font-weight-light">
						You currently are not borrowing any books.
					</div>
				) : (
					<>
						{loans
							.filter(
								(book) =>
									book.borrower_id ===
										global.currentUser.id &&
									!book.end_date &&
									book.start_date
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
											user_books_id: loan.user_books_id,
											borrower_id: loan.borrower_id,
											lender_id: loan.lender_id,
											start_date: loan.start_date,
											end_date: loan.end_date,
											id: loan.id,
											type: determineLoanType(
												loan.lender_id,
												global.currentUser.id,
												loan.start_date
											),
										}}
										index={index}
										update={update}
									></LoanBox>
								);
							})}
					</>
				)}
			</div>
			<div>
				<div className="text-xl">Loaned</div>
				{loans.filter(
					(book) =>
						book.lender_id === global.currentUser.id &&
						!book.end_date &&
						book.start_date
				).length < 1 ? (
					<div className="text-xs my-1 text-gray-500 italic font-weight-light">
						You currently are not lending any books.
					</div>
				) : (
					<>
						{loans
							.filter(
								(book) =>
									book.lender_id === global.currentUser.id &&
									!book.end_date &&
									book.start_date
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
											user_books_id: loan.user_books_id,
											borrower_id: loan.borrower_id,
											lender_id: loan.lender_id,
											start_date: loan.start_date,
											end_date: loan.end_date,
											id: loan.id,
											type: determineLoanType(
												loan.lender_id,
												global.currentUser.id,
												loan.start_date
											),
										}}
										index={index}
										update={update}
									></LoanBox>
								);
							})}
					</>
				)}
			</div>
			<div>
				<div className="text-xl">Past</div>
				{loans.filter((loan) => loan.end_date).length < 1 ? (
					<div className="text-xs my-1 text-gray-500 italic font-weight-light">
						You haven't loaned or borrowed any books in the past.
					</div>
				) : (
					<>
						{loans
							.filter((book) => book.end_date)
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
											user_books_id: loan.user_books_id,
											borrower_id: loan.borrower_id,
											lender_id: loan.lender_id,
											start_date: loan.start_date,
											end_date: loan.end_date,
											id: loan.id,
											type: determineLoanType(
												loan.lender_id,
												global.currentUser.id,
												loan.start_date
											),
										}}
										index={index}
									></LoanBox>
								);
							})}
					</>
				)}
			</div>
		</div>
	);
};

export default Loans;
