import axios from "axios";
import React, {
	useEffect,
	useState,
	useContext,
	useRef,
	useCallback,
} from "react";
import moment from "moment";
import { Context } from "../globalContext";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../common/Modal/Modal";

import { PlusCircleIcon as PlusCircle } from "@heroicons/react/outline";

import MoreMenu from "../common/MoreMenu";
import Tip from "../common/Tip";

import ReactQuill from "react-quill";
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
	const memberInviteModal = useRef(null);
	const [searchResults, setSearchResults] = useState([]);
	const [values, setValues] = useState({
		email: "",
		quantity: 0,
		unitCost: 0,
	});

	const [friendSearchResults, setFriendSearchResults] = useState([]);
	const [friendSearchResultsSelected, setFriendSearchResultsSelected] =
		useState([]);
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

	const getClub = useCallback(async () => {
		const club = await axios.get(`/api/bookclubs/${id}`);
		setClub(club.data);
		setLoaded(true);
	}, [id]);

	useEffect(() => {
		getClub();
	}, [getClub]);

	const handleAddNoteModal = () => {
		addNoteModal.current.open();
	};

	const handleSaveNote = async () => {
		await axios.post("/api/bookclubs/notes", {
			bookId: club.global_book_id,
			clubId: club.id,
			bookClubsGlobalBooksId: club.book_clubs_global_books_id,
			note: value,
		});
		getClub();
		addNoteModal.current.close();
	};

	const handleMemberInvite = async () => {
		memberInviteModal.current.open();
	};

	const deleteNote = async (noteId) => {
		await axios.delete(`/api/bookclubs/notes/${noteId}`);
		getClub();
	};

	const handleSelectBookModal = () => {
		selectBookModal.current.open();
	};

	const selectBook = async (result) => {
		const { author, title, cover, id } = result;
		await axios.put(`/api/bookclubs/${club.book_club_id}/book`, {
			bookId: id,
		});
		setClub({ ...club, author, title, cover, global_book_id: id });
	};

	const searchFriends = async (val) => {
		const res = await searchWithCancel(`/api/users/search/${val}`);

		setFriendSearchResults(res);
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

	const handleCheck = (event) => {
		var updatedList = [...friendSearchResultsSelected];
		if (event.target.checked) {
			updatedList = [...friendSearchResultsSelected, event.target.value];
		} else {
			updatedList.splice(
				friendSearchResultsSelected.indexOf(event.target.value),
				1
			);
		}
		setFriendSearchResultsSelected(updatedList);
	};

	const inviteFriendsToBookClub = () => {
		const invitedUsers = friendSearchResultsSelected.map(
			(result, index) => {
				return JSON.parse(result);
			}
		);

		axios.post("/api/bookclubs/invites", {
			clubId: club.book_club_id,
			invitedUsers,
		});
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
						{club.title ? (
							<div className="flex gap-6">
								<img
									className="h-48"
									src={club.cover}
									alt={`Cover of ${club.title}.`}
								></img>
								<div>
									<div className="font-bold text-lg">
										{club.title}
									</div>
									<div className="font-thin text-sm">
										{club.author}
									</div>
								</div>
							</div>
						) : (
							<div
								className="h-32 px-10 border border-gray-800 rounded cursor-pointer"
								onClick={handleSelectBookModal}
							>
								Select a book to read
							</div>
						)}
					</div>
					<div className="md:flex md:gap-6 md:mt-4 mt-2">
						<div className="w-1/3">
							<div className="flex items-center">
								<div className="font-semibold text-lg">
									Members
								</div>
								<div
									className="cursor-pointer inline-block mx-1 text-sm px-1 py-1 leading-none rounded text-green bg-green-600 text-white  hover:bg-green-400"
									onClick={handleMemberInvite}
								>
									<PlusCircle
										className="h-4 w-4"
										aria-hidden="true"
									/>
								</div>
							</div>
							<div>
								{club.members.map((member, index) => {
									return (
										<div key={index}>
											{member.member_full}
										</div>
									);
								})}
							</div>
						</div>
						<div className="flex-grow">
							<div className="flex items-center">
								<div className="font-semibold text-lg">
									Notes
								</div>
								<div
									className="cursor-pointer inline-block mx-1 text-sm px-1 py-1 leading-none rounded text-green bg-green-600 text-white  hover:bg-green-400"
									onClick={handleAddNoteModal}
								>
									<PlusCircle
										className="h-4 w-4"
										aria-hidden="true"
									/>
								</div>
							</div>
							<div>
								{club.notes.map((note, index) => {
									return (
										<div
											key={index}
											className="border-gray-400 border mt-2 mb-2 pr-6 rounded flex items-center"
										>
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
																		deleteNote(
																			note.note_id
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
													{moment(note.note_date)
														.subtract(6, "hours")
														.format(
															"dddd, MMMM Do YYYY, h:mm:ss a"
														)}
												</div>
												<div className="flex my-1">
													<div
														dangerouslySetInnerHTML={{
															__html: note.note,
														}}
													/>
												</div>
											</div>
											<div className="ml-auto flex items-center">
												<div></div>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</>
			)}
			<Modal
				ref={memberInviteModal}
				header="Invite member"
				type="addNote"
			>
				<div className="items-center w-full justify-between">
					<div>
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
					</div>
				</div>
				{friendSearchResults?.length > 0 ? (
					<div>
						{friendSearchResults.map((result, index) => {
							return (
								<div key={index}>
									<input
										value={JSON.stringify(result)}
										type="checkbox"
										onChange={handleCheck}
									/>
									<span>{result.full}</span>
								</div>
							);
						})}
					</div>
				) : null}

				<div className="flex gap-2 my-4">
					<div
						onClick={inviteFriendsToBookClub}
						className="cursor-pointer inline-block px-4 py-1 rounded text-green bg-green-600 text-white  hover:bg-green-500"
					>
						Submit
					</div>
					<div
						className="cursor-pointer inline-block px-4 py-1 rounded border-gray-600 border"
						onClick={() => {
							memberInviteModal.current.close();
							setValue("");
						}}
					>
						Cancel
					</div>
				</div>
			</Modal>
			<Modal ref={addNoteModal} header="Add note" type="addNote">
				<div>
					<ReactQuill
						theme="snow"
						value={value}
						onChange={setValue}
						modules={{
							toolbar: [
								["bold", "italic", "underline", "strike"],
								["link"],
								["clean"],
							],
						}}
					/>
				</div>
				<div className="flex gap-2 my-4">
					<div
						className="cursor-pointer inline-block px-4 py-1 rounded text-green bg-green-600 text-white  hover:bg-green-500"
						onClick={handleSaveNote}
					>
						Submit
					</div>
					<div
						className="cursor-pointer inline-block px-4 py-1 rounded border-gray-600 border"
						onClick={() => {
							addNoteModal.current.close();
							setValue("");
						}}
					>
						Cancel
					</div>
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
										<div
											className="cursor-pointer"
											onClick={() => selectBook(result)}
										>
											{result.title}
										</div>
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
