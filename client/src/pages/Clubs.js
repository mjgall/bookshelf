import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { Context } from "../globalContext";
import { withRouter } from "react-router-dom";

import LoadingSpinner from "../components/LoadingSpinner";

import MoreMenu from "../common/MoreMenu";
import Tip from "../common/Tip";
import { Formik, Field, Form } from "formik";

const Clubs = (props) => {
	const global = useContext(Context);

	const [loaded, setLoaded] = useState(false);
	const [bookClubs, setbookClubs] = useState([]);

	const getBookClubs = async () => {
		const response = await axios.get("/api/bookclubs");
		setbookClubs(response.data);
		setLoaded(true);
	};

	useEffect(() => {
		getBookClubs();
	}, []);

	const addBookClub = async (values) => {
		const response = await axios.post("/api/bookclub", {
			name: values.bookClubName,
		});
		console.log(response.data);
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
					</div>
					<div>
						<div>Add Book Club</div>
						<Formik
							initialValues={{
								bookClubName: "",
							}}
							onSubmit={(values) => addBookClub(values)}
						>
							<Form>
								<label htmlFor="bookClubName">Name</label>
								<Field
									id="bookClubName"
									name="bookClubName"
									placeholder="Book club name..."
								/>
								<button type="submit">Submit</button>
							</Form>
						</Formik>
					</div>
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
										<tr key={index} onClick={() => props.history.push(`/clubs/${club.id}`)} className="cursor-pointer">
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
