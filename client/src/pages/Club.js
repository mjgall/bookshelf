import axios from "axios";
import React, { useEffect, useState, useContext, useRef, useReducer } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { Context } from "../globalContext";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../common/Modal/Modal";
import {
	PlusSquare,
	ChevronDownSquare,
} from "@styled-icons/boxicons-solid";
import { MailSend } from "@styled-icons/boxicons-regular";
import MoreMenu from "../common/MoreMenu";
import Tip from "../common/Tip";
import { Formik, Field, Form } from "formik";

import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { searchWithCancel } from "../utils";


const Club = (props) => {
	const [value, setValue] = useState("");
	const global = useContext(Context);
	let { id } = useParams();
	const [loaded, setLoaded] = useState(false);
	const [club, setClub] = useState({});
	const addNoteModal = useRef(null);
	const selectBookModal = useRef(null);
	const memberInviteModal = useRef(null)
	const [searchResults, setSearchResults] = useState([]);
	const [values, setValues] = useState({
		email: "",
		quantity: 0,
		unitCost: 0,
	});

	const [friendSearchResults, setFriendSearchResults] = useState([]);
	const [friendMenuOpen, setFriendMenuOpen] = useState(false);
	const [friendValues, setFriendValues] = useState({
		email: "",
		quantity: 0,
		unitCost: 0,
	});

	const search = async (val) => {
		const res = await searchWithCancel(`/api/books/search/${val}`);
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

	const handleSaveNote = async () => {
		await axios.post("/api/bookclubs/notes", { bookId: club.global_book_id, clubId: club.id, bookClubsGlobalBooksId: club.book_clubs_global_books_id, note: value })
		getClub();
		addNoteModal.current.close()
	}

	const handleMemberInvite = async () => {
		memberInviteModal.current.open();
	}

	const deleteNote = async (noteId) => {
		await axios.delete(`/api/bookclubs/notes/${noteId}`)
		getClub();
	}

	const handleSelectBookModal = () => {
		selectBookModal.current.open();
	}

	const selectBook = async (result) => {

		const { author, title, cover, id } = result
		await axios.put(`/api/bookclubs/${club.book_club_id}/book`, { bookId: id })
		setClub({ ...club, author, title, cover, global_book_id: id })
	}

	const searchFriends = async (val) => {
		const res = await searchWithCancel(`/api/users/search/${val}`);
		setFriendSearchResults(res?.map((friend, index) => {
			return { friend, selected: true }
		}));
	};

	const handleFriendValuesChange = async (e) => {
		const { name, value } = e.target;

		if (value.length >= 2) {
			searchFriends(value);
		} else if (value.length < 2) {
			setSearchResults([]);
		}

		setFriendValues({ ...values, [name]: value });
	};

	const sendInvite = async (friend, index) => {
		const response = await axios.post("/api/bookclubs/members", {
			userEmail: friend.email,
		});

		if (response) {
			const newResults = friendSearchResults;
			newResults[index].sent = true;
			setFriendSearchResults(newResults);
		}

		setFriendValues({ ...values, email: "" });
		setFriendMenuOpen(!friendMenuOpen);
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
						{club.title ? <div className="flex gap-6">
							<img className="h-48" src={club.cover}></img>
							<div>
								<div className="font-bold text-lg">{club.title}</div>
								<div className="font-thin text-sm">{club.author}</div>
							</div>
						</div> : (<div className="h-32 px-10 border border-gray-800 rounded cursor-pointer" onClick={handleSelectBookModal}>
							Select a book to read
						</div>)}

					</div>
					<div className="md:flex md:gap-6 md:mt-4 mt-2">
						<div className="w-1/3">
							<div className="flex">

								<div className="font-semibold">Members</div>
								<div>
									<div
										className="cursor-pointer inline-block px-4 py-1 rounded text-green bg-green-600 text-white  hover:bg-green-500"
										onClick={handleMemberInvite}
									>Invite member</div>
								</div>
							</div>
							<div>
								{club.members.map((member) => {
									return <div>{member.member_full}</div>;
								})}
							</div>
						</div>
						<div className="flex-grow">
							<div className="font-semibold">Notes</div>
							<div
								className="cursor-pointer inline-block px-4 py-1 rounded text-green bg-green-600 text-white  hover:bg-green-500"
								onClick={handleAddNoteModal}
							>
								Add Note
							</div>
							<div>
								{club.notes.map((note) => {
									return (
										<div className="border-gray-400 border mt-2 mb-2 pr-6 rounded flex items-center">
											<div className="flex items-center">
												{note.user_id === global.currentUser.id ? (
													<div>
														<MoreMenu
															placement="left"
															size="18px"
															options={[
																{
																	action: () => deleteNote(note.note_id),
																	confirm: true,
																	text: "Delete note",
																},
															]}
														></MoreMenu>
													</div>
												) : null}
												<div
													className={
														note.user_id === global.currentUser.id
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
													<span className="font-bold">{note.user}</span>{" "}
												</div>

												<div className="text-xs font-thin">
													{moment(note.note_date).subtract(6, 'hours').format(
														"dddd, MMMM Do YYYY, h:mm:ss a"
													)}
												</div>
												<div className="flex my-1">
													<div dangerouslySetInnerHTML={{ __html: note.note }} />
												</div>
											</div>
											<div className="ml-auto flex items-center">
												<div>

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
			<Modal ref={memberInviteModal} header="Invite member" type="addNote">
				<div>Invite Member</div>
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
								value={friendValues.email}
								onChange={handleFriendValuesChange}
								aria-label="Friend email"
							></input>
						</div>
					</div>
				) : null}
				<div>
					<ul>
						{friendSearchResults?.map((result, index) => {
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
										<div>{result.friend.full}</div>
										<div className="ml-auto mr-0">
											<Tip
												renderChildren
												content="Send invite"
												placement="left"
											>
												<input
													type="checkbox"
													className="form-checkbox cursor-pointer"
													onChange={() => {
														let newList = friendSearchResults

														newList[index].selected = !friendSearchResults[index].selected
														console.log(newList)
														setFriendSearchResults(newList)
													}}
													checked={friendSearchResults[index].selected}
												></input>
											</Tip>
										</div>
									</div>
								);
							}
						})}
					</ul>
				</div>

				<div className="flex gap-2 my-4">
					<div
						className="cursor-pointer inline-block px-4 py-1 rounded text-green bg-green-600 text-white  hover:bg-green-500"
					>Submit</div>
					<div
						className="cursor-pointer inline-block px-4 py-1 rounded border-gray-600 border"
						onClick={() => { memberInviteModal.current.close(); setValue('') }}
					>Cancel</div>
				</div>
			</Modal>
			<Modal ref={addNoteModal} header="Add note" type="addNote">
				<div><ReactQuill theme="snow" value={value} onChange={setValue} modules={{
					toolbar: [
						['bold', 'italic', 'underline', 'strike'],
						['link'],
						['clean']
					],
				}} /></div>
				<div className="flex gap-2 my-4">
					<div
						className="cursor-pointer inline-block px-4 py-1 rounded text-green bg-green-600 text-white  hover:bg-green-500"
						onClick={handleSaveNote}
					>Submit</div>
					<div
						className="cursor-pointer inline-block px-4 py-1 rounded border-gray-600 border"
						onClick={() => { addNoteModal.current.close(); setValue('') }}
					>Cancel</div>
				</div>
			</Modal>
			<Modal ref={selectBookModal} header="Select Book" type="selectBook">
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
					<div>
						<ul>
							{searchResults?.map((result, index) => {
								return (
									<div
										key={index}
										className="flex my-1 border-gray-500 rounded-sm px-2 border items-center"
									>
										<div className="cursor-pointer" onClick={() => selectBook(result)}>{result.title}</div>
									</div>
								);

							})}
						</ul>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default Club;
