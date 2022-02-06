import axios from "axios";
import React, { useEffect, useState } from "react";

import { withRouter } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import Tip from "../common/Tip";
import { Formik, Field, Form } from "formik";

const Clubs = (props) => {

	const [loaded, setLoaded] = useState(false);
	const [bookClubs, setbookClubs] = useState([]);
	const [newBookClubForm, setNewBookClubForm] = useState(false);
	const getBookClubs = async () => {
		const response = await axios.get("/api/bookclubs");
		setbookClubs(response.data);
		setLoaded(true);
	};

	useEffect(() => {
		getBookClubs();
	}, []);

	const addBookClub = async (values) => {
		if (values.bookClubName) {
			const response = await axios.post("/api/bookclub", {
				name: values.bookClubName,
			});
			setNewBookClubForm(false)
			props.history.push(
				`/clubs/${response.data.book_club_id}`
			)
		} else {
			return;
		}
	};

	return (
		<div>
			{!loaded ? (
				<LoadingSpinner></LoadingSpinner>
			) : (
				<>
					<div className="flex items-center text-center">
						<div className="text-2xl font-bold">Book Clubs</div>
						<Tip
							content="Organize book clubs and notes"
							placement="right"
							size="1rem"
							className="ml-2"
						></Tip>
						<button
							className="cursor-pointer inline-block mx-1 px-4 py-1 rounded text-green bg-green-600 text-white  hover:bg-green-500"
							onClick={() => setNewBookClubForm(!newBookClubForm)}
						>Create Club</button>
					</div>
					{newBookClubForm ? (
						<div>
							<Formik
								initialValues={{
									bookClubName: "",
								}}
								onSubmit={(values) => addBookClub(values)}
							>
								<Form>
									<Field
										id="bookClubName"
										name="bookClubName"
										placeholder="Book club name..."
										className="leading-8 w-1/2 m-auto rounded-md border border-gray-400 px-2"
									/>
									<button
										className="cursor-pointer inline-block mx-1 px-4 py-1 rounded text-green bg-green-600 text-white  hover:bg-green-500"
										type="submit"
									>
										Submit
									</button>
								</Form>
							</Formik>
						</div>
					) : null}

					<div>
						<table className="w-full">
							<thead>
								<tr>
									<th className="text-left">
										Book Club Name
									</th>
									<th className="text-left">Total Members</th>
									<th className="text-left">Active</th>
								</tr>
							</thead>
							<tbody>
								{bookClubs.map((club, index) => {
									return (
										<tr
											key={index}
											onClick={() =>
												props.history.push(
													`/clubs/${club.id}`
												)
											}
											className="cursor-pointer hover:bg-gray-200"
										>
											<td>{club.name}</td>
											<td>{club.members.length}</td>
											<td>
												{club.active ? "Yes" : "No"}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</>
			)}
		</div>
	);
};

export default withRouter(Clubs);
