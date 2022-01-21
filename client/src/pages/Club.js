import axios from "axios";
import React, { useEffect, useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { Context } from "../globalContext";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../common/Modal/Modal";

import MoreMenu from "../common/MoreMenu";
import Tip from "../common/Tip";
import { Formik, Field, Form } from "formik";
import { useQuill } from "react-quilljs";

const Club = (props) => {
	const { quill, quillRef } = useQuill();
	const global = useContext(Context);
	let { id } = useParams();
	const [loaded, setLoaded] = useState(false);
	const [club, setClub] = useState({});
	const addNoteModal = useRef(null);
	const getClub = async () => {
		const club = await axios.get(`/api/bookclubs/${id}`);
		setClub(club.data);
		setLoaded(true);
	};

	useEffect(() => {
		getClub();
	}, []);

	const handleAddNoteModal = () => {
		addNoteModal.current.open();
	};

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
					<div className="md:flex md:gap-6 md:mt-4 mt-2">
						<div className="w-1/3">
							<div className="font-semibold">Members</div>
							<div>
								{club.members.map((member) => {
									return <div>{member.member_first}</div>;
								})}
							</div>
						</div>
						<div className="flex-grow">
							<div className="font-semibold">Notes</div>
							<button
								className="cursor-pointer inline-block mx-1 px-4 py-1 rounded text-green bg-green-600 text-white  hover:bg-green-500"
								onClick={handleAddNoteModal}
							>
								Add Note
							</button>
							<div>
								{club.notes.map((note) => {
									return (
										<div className="border-gray-400 border mt-2 mb-2 pr-6 rounded flex items-center">
											<div className="flex items-center">
												{note.user_id ===
												global.currentUser.id ? (
													<div>
														<MoreMenu
															placement="left"
															size="18px"
															options={[
																{
																	action: () =>
																		console.log(
																			"Delete note"
																		),
																	confirm: true,
																	text: "Delete note",
																},
															]}
														></MoreMenu>
													</div>
												) : null}
												<div
													className={
														note.user_id ===
														global.currentUser.id
															? "h-12 w-12 mr-2"
															: "h-12 w-12 mr-2 ml-4"
													}
												>
													<Tip
														content={note.full}
														placement="right"
														size="1rem"
														className="ml-2"
														renderChildren
													>
														<img
															alt="user"
															src={note.picture}
															className="rounded-full h-12 w-12 mr-2"
														></img>
													</Tip>
												</div>
											</div>
											<div>
												<div>
													<span className="font-bold">
														{note.user}
													</span>{" "}
												</div>

												<div className="text-xs font-thin">
													{moment(
														note.create_date
													).format(
														"dddd, MMMM Do YYYY, h:mm:ss a"
													)}
												</div>
												<div className="flex my-1">
													<div>{note.note}</div>
												</div>
											</div>
											<div className="ml-auto flex items-center">
												<div>
													<Link
														to={`/book/${club.global_book_id}`}
													>
														{club.cover ? (
															<img
																alt="user"
																src={club.cover}
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
						</div>
					</div>
				</>
			)}
			<Modal ref={addNoteModal} header="Add note" type="addNote">
				<>
					<div style={{ width: 500, height: 300 }}>
						<div ref={quillRef} />
					</div>
				</>
			</Modal>
		</div>
	);
};

export default Club;
