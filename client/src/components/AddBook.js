import React, { useState, useRef, useContext } from "react";
import Modal from "react-modal";
import { Context } from "../globalContext";
import Scan from "./Scanner2";
import axios from "axios";
import useWindowSize from "../hooks/useWindowSize";
import DetailsTab from "./DetailsTab";
import Button from "../common/Button";
import { useToasts } from "react-toast-notifications";

const AddBook = () => {
	const { addToast } = useToasts();
	const scanTabRef = useRef(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [openTab, setOpenTab] = React.useState(1);
	const [enteredISBN, setEnteredISBN] = useState("");
	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [reason, setReason] = useState("");
	const [searchResults, setSearchResults] = useState([])
	const global = useContext(Context);

	const toggleModal = () => {
		setModalOpen(!modalOpen);
		global.setGlobal({ capturedBook: false });
	};
	const size = useWindowSize();

	const titleCase = (s) => s.replace(/^_*(.)|_+(.)/g, (s, c, d) => c ? c.toUpperCase() : ' ' + d.toUpperCase())

	const submitManual = async () => {

		const index = global.books.userBooks.findIndex((element) => {
			return element.isbn10 === enteredISBN || element.isbn13 === enteredISBN;
		});

		if (enteredISBN) {
			if (index >= 0) {
				setReason("This book has already been saved.");
			} else {
				axios.get(`/api/book/lookup/${enteredISBN}`).then((response) => {
					if (!response.data.error) {
						global.setGlobal({
							capturedBook: response.data,
						});
						setOpenTab(3);
					} else {
						setReason(response.data.reason);
					}
				});
			}
		} else {
			setReason("This is not a valid ISBN");
		}

		// if (response.data)
	};

	const submitSearch = async (e) => {
		e.preventDefault();
		try {
			if ((!title && !author) || !title) {
				addToast("Please include at least a title", {
					appearance: "error",
					autoDismiss: true,
				});
			} else if (title && !author) {
				const response = await axios.get(
					encodeURI(`/api/book/search/title/${title}`)
				);
				console.log(response.data);
				setSearchResults(response.data.books)
			} else {
				const response = await axios.get(
					encodeURI(`/api/book/search/title/${title}/author/${author}`)
				);
				setSearchResults(response.data.books)
				console.log(response.data);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handleManualISBN = (e) => {
		setEnteredISBN(e.target.value);
	};

	const handleTitle = (e) => {
		setTitle(e.target.value);
	};

	const handleAuthor = (e) => {
		setAuthor(e.target.value);
	};

	const selectSearch = async (book) => {
		const added = await axios.post("/api/global_book", { ...book })
		console.log(added)

		global.setGlobal({
			capturedBook: book
		});
		setOpenTab(3);
	}

	const modalStyles = {
		content: {
			width: size.width > 500 ? "50vw" : "100%",
			height: size.width > 500 ? "70vh" : "100%",
			minHeight: "30vh",
			maxHeight: "80vh",
			minWidth: "70vw",
			padding: 0,
			top: "50%",
			left: "50%",
			right: "auto",
			bottom: "auto",
			marginRight: "-50%",
			transform: "translate(-50%, -50%)",
		},
	};

	return (
		<>
			<Button className="md:w-1/6 w-full" color="green" onClick={toggleModal}>
				Add Book
      </Button>
			<Modal
				shouldCloseOnEsc
				style={modalStyles}
				isOpen={modalOpen}
				onRequestClose={toggleModal}
			>
				<div className="flex flex-wrap">
					<div className="w-full">
						<ul
							className="flex mb-0 list-none flex-wrap pb-4 flex-row"
							role="tablist"
						>
							<li className="-mb-px mr-2 last:mr-0 flex-auto text-center cursor-pointer">
								<div
									className={
										"text-sm px-5 py-3 block leading-normal " +
										(openTab === 1 ? "text-white bg-royalblue" : "bg-white")
									}
									onClick={(e) => {
										setOpenTab(1);
									}}
									data-toggle="tab"
									role="tablist"
								>
									Scan Barcode
                </div>
							</li>
							<li className="-mb-px mr-2 last:mr-0 flex-auto text-center cursor-pointer">
								<div
									className={
										"text-sm px-5 py-3 block leading-normal " +
										(openTab === 2 ? "text-white bg-royalblue" : "bg-white")
									}
									onClick={(e) => {
										setOpenTab(2);
									}}
									data-toggle="tab"
									href="#link2"
									role="tablist"
								>
									Search
                </div>
							</li>
							<li className="-mb-px mr-0  flex-auto text-center cursor-pointer">
								<div
									className={
										"text-sm px-5 py-3 block leading-normal " +
										(openTab === 3 ? "text-white bg-royalblue" : "bg-white")
									}
									onClick={(e) => {
										setOpenTab(3);
									}}
									data-toggle="tab"
									role="tablist"
								>
									{global.capturedBook ? "Edit and Save" : "Enter Manually"}
								</div>
							</li>
						</ul>
						<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6">
							<div className="px-4 flex-auto">
								<div className="tab-content tab-space">
									<div
										className={openTab === 1 ? "block" : "hidden"}
										id="link1"
									>
										<div ref={scanTabRef} className="md:w-3/4 m-auto h-8">
											<Scan
												currentTab={openTab === 1 ? true : false}
												setReason={setReason}
												onFound={() => setOpenTab(3)}
											></Scan>
										</div>
									</div>
									<div
										className={openTab === 2 ? "block" : "hidden"}
										id="link2"
									>
										{reason ? (
											<div className="w-1/2 m-auto text-center text-white bg-red-700 py-2 px-3 rounded-sm">
												{reason}
											</div>
										) : null}

										<div className="m-auto text-center">
											<input
												placeholder="Search by ISBN"
												onChange={handleManualISBN}
												value={enteredISBN}
												className="leading-8 w-1/2 m-auto rounded-md border border-gray-400"
											/>
											<button
												onClick={submitManual}
												className="bg-royalblue hover:bg-blue-700 text-white my-1 mx-1 py-1 px-4 rounded focus:outline-none focus:shadow-outline"
											>
												Submit
                      </button>
										</div>
										<div className="m-auto text-center">
											<form>
												<input
													placeholder="Title"
													onChange={handleTitle}
													value={title}
													className="leading-8 w-1/2 m-auto rounded-md border border-gray-400"
												/>
												<input
													placeholder="Author"
													onChange={handleAuthor}
													value={author}
													className="leading-8 w-1/2 m-auto rounded-md border border-gray-400"
												/>
												<button
													onSubmit={submitSearch}
													onClick={submitSearch}
													className="bg-royalblue hover:bg-blue-700 text-white my-1 mx-1 py-1 px-4 rounded focus:outline-none focus:shadow-outline"
												>
													Search
                        </button>
											</form>
											{searchResults ? <div>
												{searchResults.filter(result => {
													if (!result.authors || result.authors?.length === 0) {
														return null
													} else {
														return result
													}
												}).map(result => {
													return { ...result, author: result.authors.length > 0 ? titleCase(result.authors?.[0]) : null, title: result.title ? titleCase(result.title) : null }
												}).map(result => {
													return (
														<div className="flex cursor-pointer my-2" onClick={() => selectSearch(result)}>
															<div className="flex-none w-1/3"><img style={{ maxHeight: "8rem" }} className="m-auto" alt={`Cover of ${result.title}`} src={result.image}></img></div>
															<div className="flex-none w-1/3">{result.title}</div>
															<div className="flex-none w-1/3">{result.author}</div>
														</div>
													)
												})}
											</div> : null}

										</div>
									</div>
									<div
										className={openTab === 3 ? "block" : "hidden"}
										id="link3"
									>
										<DetailsTab
											closeModal={() => {
												setModalOpen(false);
											}}
										></DetailsTab>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default AddBook;
