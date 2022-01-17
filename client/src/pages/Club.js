import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { Context } from "../globalContext";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

import MoreMenu from "../common/MoreMenu";
import Tip from "../common/Tip";
import { Formik, Field, Form } from "formik";

const Clubs = (props) => {
	const global = useContext(Context);
	let { id } = useParams();
	const [loaded, setLoaded] = useState(false);
	const [club, setClub] = useState({});

	const getClub = async () => {
		const club = await axios.get(`/api/bookclubs/${id}`);
		setClub(club.data);
		setLoaded(true);
	};

	useEffect(() => {
		getClub();
	}, []);

	return (
		<div>
			{!loaded ? (
				<LoadingSpinner></LoadingSpinner>
			) : (
				<>
					<div className="flex items-center text-center">
						<div className="text-2xl font-bold">{club.name}</div>
						<Tip
							content="This is your book club."
							placement="right"
							size="1rem"
							className="ml-2"
						></Tip>
					</div>

					<div className="flex gap-6">
						<img className="h-32" src={club.cover}></img>
						<div>
							<div className="font-bold text-lg">
								{club.title}
							</div>
							<div className="font-thin text-sm">
								{club.author}
							</div>
						</div>
					</div>
					<div className="flex gap-6 mt-4">
						<div className="flex-1">
							<div className="font-semibold">
								Members
							</div>
							<div>
								{club.members.map((member) => {
									return <div>{member.member_first}</div>;
								})}
							</div>
						</div>
						<div className="flex-1">
						<div className="font-semibold">
								Notes
							</div>
							<div>
								{club.notes.map(note => {
									return (
										<div className="border-gray-400 border mt-2 mb-2 pr-6 rounded flex items-center">{note.note}</div>
									)
								})}
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default Clubs;
