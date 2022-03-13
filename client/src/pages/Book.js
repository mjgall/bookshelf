import React, {
	useState,
	useEffect,
	useContext,
	useCallback,
	useRef,
} from "react";
import axios from "axios";
import InlineEdit from "@atlaskit/inline-edit";
import TextArea from "@atlaskit/textarea";
import Textfield from "@atlaskit/textfield";
import {
	Lock,
	LockOpen,
	Book as BookIcon,
	BookOpen,
} from "@styled-icons/boxicons-solid";
import Tip from "../common/Tip";
import NotesFromHouseholds from "../components/NotesFromHouseholds";
import { Link, useParams } from "react-router-dom";
import { Context } from "../globalContext";
import { withRouter } from "react-router-dom";
import MoreMenu from "../common/MoreMenu";
import BookFeed from "../components/BookFeed";
import Modal from "../common/Modal/Modal";
import FileUpload from "../components/FileUpload";
import LoanModal from "../components/LoanModal";
import LoadingSpinner from "../components/LoadingSpinner";

const Book = (props) => {
	const global = useContext(Context);
	const params = useParams();
	const paramId = Number(params.id);

	const [book, setBook] = useState(undefined);
	const [type, setType] = useState("");
	const [loaded, setLoaded] = useState(false);
	const [newImage, setNewImage] = useState(null);
	const [googleInfo, setGoogleInfo] = useState(null);
	const [googleLoaded, setGoogleLoaded] = useState(false);
	const modal = useRef(null);
	const loanModal = useRef(null);
	const fetchGlobalBook = useCallback(async (id) => {
		const globalBookDetails = await axios
			.get(`/api/book/${id}`)
			.then((response) => response.data);
		setBook(globalBookDetails);
		setLoaded(true);
	}, []);

	useEffect(() => {
		const getGoogleInfo = async () => {
			if (book?.isbn13) {
				const response = await axios.get(
					`/api/gcpbooks/${book?.isbn13}`
				);
				setGoogleInfo(response.data);
				setGoogleLoaded(true);
			}
		};

		const determineBookType = (id) => {
			const index = global.allBooks.findIndex((book) => {
				return book.id === id;
			});

			if (!global.allBooks[index]) {
				return "global";
			} else if (
				global.allBooks[index].user_id === global.currentUser.id
			) {
				return "personal";
			} else if (global.allBooks[index].household_id) {
				return "household";
			}
		};

		const bookType = determineBookType(paramId);

		setType(bookType);

		if (bookType === "personal" || bookType === "household") {
			const index = global.allBooks.findIndex((book) => {
				return book.id === paramId;
			});
			setBook({ ...global.allBooks[index], index: index });
			setLoaded(true);
			getGoogleInfo();
		} else {
			fetchGlobalBook(paramId);
			setGoogleLoaded(true);
		}
	}, [fetchGlobalBook, global, paramId, book?.isbn13]);

	const updateBookField = async (field, value) => {
		let options = { bookType: type, field, value, id: undefined };
		switch (field) {
			case "title":
			case "author":
			case "private":
			case "started":
				if (type === "personal") {
					options.id = book.user_book_id;
					options.globalId = book.id;
				}
				break;
			case "read":
				if (type === "personal") {
					options.id = book.user_book_id;
					options.globalId = book.id;
				} else if (type === "household" || type === "global") {
					options.id = book.id;
				}
				break;
			case "notes":
				//updating personal notes
				if (type === "personal") {
					options.id = book.user_book_id;
					options.globalId = book.id;
				} else if (type === "global" || type === "household") {
					options.id = book.id;
					options.usersGlobalBooksId = book.users_globalbooks_id;
				}
				break;
			case "cover":
				options.id = book.user_book_id;
				options.globalId = book.id;
				break;
			default:
				break;
		}

		axios.put("/api/books", options).then((response) => {
			if (type !== "global") {
				global.allBooks[book.index][field] = response.data[field];
			}
			setBook({ ...book, [field]: response.data[field] });
		});
	};

	const deleteBook = async () => {
		axios.delete(`/api/books/${book.id}`).then((response) => {
			if (response.data.affectedRows > 0) {
				const index = global.books.userBooks.findIndex(
					(userBook) => book.id === userBook.id
				);

				const newUserBooks = global.books.userBooks;

				newUserBooks.splice(index, 1);
				global.setGlobal({
					books: { ...global.books, userBooks: newUserBooks },
				});
				props.history.replace("/library");
			} else {
				props.history.replace("/library");
				throw Error("Error deleting book");
			}
		});
	};

	const addToLibrary = async () => {
		await axios.post("/api/books", book);
	};

	const requestToBorrow = async () => {
		const data = {
			bookId: book.id,
			lenderId: null,
			borrowerId: global.currentUser.id,
			requesting: true,
		};
		// first check if we navigated here from a book table, if we did we will find the book owner in the location state
		if (props.location?.state?.ownerId) {
			data.lenderId = props.location.state.ownerId;
			await axios.post("/api/loans", data);
		} else {
			// if not, throw modal to select the non-household connections who have this book
			global.setGlobal({
				modalOpen: true,
				currentModal: "requestToBorrow",
				bookId: book.id,
				userBookId: book.user_book_id,
			});
		}
	};

	const getMenuOptions = () => {
		if (book.on_loan) {
			return [
				{
					action: () => deleteBook(),
					confirm: true,
					text: "Delete",
				},
			];
		} else {
			return [
				{
					action: () => deleteBook(),
					confirm: true,
					text: "Delete",
				},
				{
					action: () => {
						loanModal.current.open();
					},
					confirm: false,
					text: "Loan",
				},
			];
		}
	};

	const onUpload = async (image) => {
		// await axios.put("/api/users", { field: "picture", value: image.Location })
		await updateBookField("cover", image.Location);
		setNewImage(image.Location);
		modal.current.close();
	};

	return (
		<div className="container mx-auto md:mt-12 mt-2">
			{/* Upload new cover image modal */}
			<Modal ref={modal} header="Upload cover">
				<FileUpload onUpload={onUpload}></FileUpload>
			</Modal>
			{/* Lend book to connection modal */}
			<Modal ref={loanModal} header="Loan book">
				<LoanModal
					bookId={book?.id}
					userBookId={global.user_book_id}
					closeModal={() => loanModal.current.close()}
				></LoanModal>
			</Modal>
			{loaded ? (
				<div
					className="md:grid md:grid-cols-2"
					style={{ gridTemplateColumns: `25% 70% 5%` }}
				>
					<div>
						<div className="border-gray-400 border rounded-md shadow-md p-4 md:mr-3 mx-6 bg-white md:mb-0 mb-2">
							<div id="book-details">
								{book.cover ? (
									<div className="mx-0">
										{type === "personal" ? (
											<Tip
												renderChildren
												content="Change cover photo"
												placement="bottom"
											>
												<img
													onClick={() =>
														modal.current.open()
													}
													alt="book cover"
													className="w-2/5 block ml-auto mr-auto cursor-pointer"
													src={newImage || book.cover}
												></img>
											</Tip>
										) : (
											<img
												alt="book cover"
												className="w-2/5 block ml-auto mr-auto"
												src={book.cover}
											></img>
										)}
									</div>
								) : null}

								{type === "household" || type === "global" ? (
									<div className="mt-2">{book.title}</div>
								) : (
									<InlineEdit
										readViewFitContainerWidth
										defaultValue={book.title || undefined}
										editView={(fieldProps) => (
											<Textfield
												{...fieldProps}
												autoFocus
											/>
										)}
										readView={() => (
											<div className="text-center">
												{book.title ||
													"No notes, click to enter some!"}
											</div>
										)}
										onConfirm={(value) =>
											updateBookField("title", value)
										}
									/>
								)}
								{type === "household" || type === "global" ? (
									<div className="mt-2">{book.author}</div>
								) : (
									<InlineEdit
										readViewFitContainerWidth
										defaultValue={book.author || undefined}
										editView={(fieldProps) => (
											<Textfield
												{...fieldProps}
												autoFocus
											/>
										)}
										readView={() => (
											<div className="text-center">
												{book.author || "No author"}
											</div>
										)}
										onConfirm={(value) =>
											updateBookField("author", value)
										}
									/>
								)}

								{book.read ? (
									<Tip
										renderChildren
										content="Mark as unread"
										placement="bottom"
									>
										<div
											onClick={() =>
												updateBookField(
													"read",
													!book.read
												)
											}
											className="bg-green-500 hover:bg-green-700 text-white my-1 mx-2 mt-6 py-2 px-3 rounded focus:outline-none focus:shadow-outline text-center cursor-pointer"
										>
											<div className="flex justify-center">
												<BookIcon size="1.5rem"></BookIcon>
												<span className="ml-2">
													You've read this book
												</span>
											</div>
										</div>
									</Tip>
								) : (
									<Tip
										renderChildren
										content="Mark as read"
										placement="bottom"
									>
										<div
											onClick={() =>
												updateBookField(
													"read",
													!book.read
												)
											}
											className="bg-newblue hover:bg-blue-700 text-white my-1 mx-2 mt-6 py-2 px-3 rounded focus:outline-none focus:shadow-outline text-center cursor-pointer"
										>
											<div className="flex justify-center">
												<BookOpen size="1.5rem"></BookOpen>
												<span className="ml-2">
													Not read yet
												</span>
											</div>
										</div>
									</Tip>
								)}
								{type === "personal" ? (
									<>
										{book.read ? null : book.started ? (
											<Tip
												renderChildren
												content="Started"
												placement="bottom"
											>
												<div
													onClick={() =>
														updateBookField(
															"started",
															!book.started
														)
													}
													className="bg-green-500 hover:bg-green-700 text-white my-1 mx-2 mt-6 py-2 px-3 rounded focus:outline-none focus:shadow-outline text-center cursor-pointer"
												>
													<div className="flex justify-center">
														<BookIcon size="1.5rem"></BookIcon>
														<span className="ml-2">
															Started
														</span>
													</div>
												</div>
											</Tip>
										) : (
											<Tip
												renderChildren
												content="Not started"
												placement="bottom"
											>
												<div
													onClick={() =>
														updateBookField(
															"started",
															!book.started
														)
													}
													className="bg-newblue hover:bg-blue-700 text-white my-1 mx-2 mt-6 py-2 px-3 rounded focus:outline-none focus:shadow-outline text-center cursor-pointer"
												>
													<div className="flex justify-center">
														<BookOpen size="1.5rem"></BookOpen>
														<span className="ml-2">
															Not started
														</span>
													</div>
												</div>
											</Tip>
										)}
										{book.private ? (
											<Tip
												renderChildren
												content="Click to make public."
												placement="bottom"
											>
												<div
													className="bg-red-500 hover:bg-red-700 text-white my-1 mx-2 mt-6 py-2 px-3 rounded focus:outline-none focus:shadow-outline text-center cursor-pointer"
													onClick={() =>
														updateBookField(
															"private",
															!book.private
														)
													}
												>
													<div className="flex justify-center">
														<Lock size="1.5rem"></Lock>
														<span className="ml-2">
															Private
														</span>
													</div>
												</div>
											</Tip>
										) : (
											<Tip
												renderChildren
												content="Make private"
												placement="bottom"
											>
												<div
													onClick={() =>
														updateBookField(
															"private",
															!book.private
														)
													}
													className="bg-newblue hover:bg-blue-700 text-white my-1 mx-2 mt-6 py-2 px-3 rounded focus:outline-none focus:shadow-outline text-center cursor-pointer"
												>
													<div className="flex justify-center">
														<LockOpen size="1.5rem"></LockOpen>
														<span className="ml-2">
															Public
														</span>
													</div>
												</div>
											</Tip>
										)}
									</>
								) : null}
								<div className="md:mx-0 md:hidden">
									{type === "personal" ? (
										<MoreMenu
											placement="bottom"
											type="button"
											size="1.5em"
											options={getMenuOptions()}
										></MoreMenu>
									) : type === "global" ? (
										<MoreMenu
											placement="bottom"
											type="button"
											options={[
												{
													action: addToLibrary,
													confirm: true,
													text: "Add to your shelf",
												},
												{
													action: requestToBorrow,
													confirm: true,
													text: props.location?.state
														?.ownerId
														? `Request to borrow from ${props.location.state.ownerFull}`
														: `Request to borrow`,
												},
											]}
										></MoreMenu>
									) : null}
								</div>
							</div>
						</div>
					</div>
					<div className="mx-6 border-gray-400 border rounded-md shadow-md p-4 md:mr-3 bg-white md:mb-0 mb-2">
						{book.on_loan ? (
							<div className="bg-yellow-100 w-full h-12 rounded border-2 border-yellow-300 flex">
								<div className="self-center text-center	w-full">
									Loaned to
									{book.shelf_enabled ? (
										<Link to={`/shelf/${book.shelf_id}`}>
											{` ${book.full}`}
										</Link>
									) : (
										` ${book.full || book.manual_name}`
									)}
								</div>
							</div>
						) : null}
						<div className="mx-6 border-gray-400 border rounded-md shadow-md p-4 md:mr-3 bg-white md:mb-0 mb-2">
							{!googleLoaded ? (
								<LoadingSpinner></LoadingSpinner>
							) : (
								googleInfo?.volumeInfo?.description ||
								book?.google?.volumeInfo?.description ||
								"No description available."
							)}
						</div>

						{type === "household" || type === "global" ? (
							<InlineEdit
								defaultValue={book.notes || undefined}
								label="Personal Notes"
								editView={(fieldProps, ref) => (
									// textarea does not currently correctly pass through ref as a prop
									<TextArea
										type="text"
										className="w-full"
										{...fieldProps}
									/>
								)}
								readView={() => {
									if (book.notes) {
										return (
											<div className="multiline">
												{book.notes}
											</div>
										);
									} else {
										return (
											<div className="text-gray-500">
												No notes yet - click to add
												some!
											</div>
										);
									}
								}}
								onConfirm={(value) =>
									updateBookField("notes", value)
								}
								autoFocus
								readViewFitContainerWidth
							/>
						) : (
							<InlineEdit
								defaultValue={book.notes || undefined}
								label={"Personal Notes"}
								editView={(fieldProps, ref) => (
									<TextArea
										{...fieldProps}
										ref={ref}
									></TextArea>
								)}
								readView={() => {
									if (book.notes) {
										return (
											<div className="multiline">
												{book.notes}
											</div>
										);
									} else {
										return (
											<div className="text-gray-500">
												No notes yet - click to add
												some!
											</div>
										);
									}
								}}
								onConfirm={(value) =>
									updateBookField("notes", value)
								}
								autoFocus
								readViewFitContainerWidth
							/>
						)}
						{type === "global" ||
						global.households.length < 1 ? null : (
							<div>
								<div className="text-lg mt-6">
									<span role="img" aria-label="house">
										🏠
									</span>
									Notes from households
								</div>
								<NotesFromHouseholds
									bookId={book.id}
								></NotesFromHouseholds>
							</div>
						)}
						<BookFeed bookId={book.id}></BookFeed>
					</div>
					<div className="md:mx-0 mx-6 hidden md:block md:ml-4">
						{type === "personal" ? (
							<MoreMenu
								placement="left"
								size="1.5em"
								options={getMenuOptions()}
							></MoreMenu>
						) : type === "global" ? (
							<MoreMenu
								options={[
									{
										action: addToLibrary,
										confirm: true,
										text: "Add to your shelf",
									},
									{
										action: requestToBorrow,
										confirm: true,
										text: props.location?.state?.ownerId
											? `Request to borrow from ${props.location.state.ownerFull}`
											: `Request to borrow`,
									},
								]}
							></MoreMenu>
						) : null}
					</div>
				</div>
			) : null}
		</div>
	);
};

export default withRouter(Book);
