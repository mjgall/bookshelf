import React, {
	useState,
	useRef,
	useEffect,
	useContext,
	useReducer,
} from "react";
import Modal from "react-modal";
import { Context } from "../globalContext";
import Scan from "./Scanner2";
import axios from "axios";
import useWindowSize from "../hooks/useWindowSize";
import DetailsTab from "./DetailsTab";
import Button from "../common/Button";

const AddBook = () => {
	const scanTabRef = useRef(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [openTab, setOpenTab] = React.useState(1);
	const [enteredISBN, setEnteredISBN] = useState("");
	const [reason, setReason] = useState("");
	const global = useContext(Context);
	const toggleModal = () => {
		setModalOpen(!modalOpen);
	};
	const size = useWindowSize();

	const submitManual = async () => {
		let isNumerical = /^\d+$/.test(enteredISBN);
		const index = global.books.userBooks.findIndex((element) => {
			console.log(element);

			return (
				element.isbn10 == enteredISBN || element.isbn13 == enteredISBN
			);
		});

		if (enteredISBN && isNumerical) {
			if (index >= 0) {
				setReason("This book has already been saved.");
			} else {
				axios
					.get(`/api/book/lookup/${enteredISBN}`)
					.then((response) => {
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

	const handleManualISBN = (e) => {
		setEnteredISBN(e.target.value);
	};

	const modalStyles = {
		content: {
			width: size.width > 500 ? "50vw" : "100%",
			height: size.width > 500 ? "50vh" : "100%", 
			minHeight: "30vh",
			maxHeight: "80vh",
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
			<Button color="green" onClick={toggleModal}>
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
										"text-xs font-bold px-5 py-3 block leading-normal " +
										(openTab === 1
											? "text-white bg-royalblue"
											: "bg-white")
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
										"text-xs font-bold px-5 py-3 block leading-normal " +
										(openTab === 2
											? "text-white bg-royalblue"
											: "bg-white")
									}
									onClick={(e) => {
										setOpenTab(2);
									}}
									data-toggle="tab"
									href="#link2"
									role="tablist"
								>
									Enter ISBN
								</div>
							</li>
							<li className="-mb-px mr-0  flex-auto text-center cursor-pointer">
								<div
									className={
										"text-xs font-bold px-5 py-3 block leading-normal " +
										(openTab === 3
											? "text-white bg-royalblue"
											: "bg-white")
									}
									onClick={(e) => {
										setOpenTab(3);
									}}
									data-toggle="tab"
									role="tablist"
								>
									{global.capturedBook
										? "Edit and Save"
										: "Enter Manually"}
								</div>
							</li>
						</ul>
						<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6">
							<div className="px-4 flex-auto">
								<div className="tab-content tab-space">
									<div
										className={
											openTab === 1 ? "block" : "hidden"
										}
										id="link1"
									>
										<div
											ref={scanTabRef}
											className="md:w-3/4 m-auto h-8"
										>
											<Scan
												currentTab={
													openTab === 1 ? true : false
												}
												setReason={setReason}
												onFound={() => setOpenTab(3)}
											></Scan>
										</div>
									</div>
									<div
										className={
											openTab === 2 ? "block" : "hidden"
										}
										id="link2"
									>
										{reason ? (
											<div className="w-1/2 m-auto text-center text-white bg-red-700 py-2 px-3 rounded-sm">
												{reason}
											</div>
										) : null}

										<div className="m-auto text-center">
											<input
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
									</div>
									<div
										className={
											openTab === 3 ? "block" : "hidden"
										}
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
