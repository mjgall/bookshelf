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

const DetailsTab = (props) => {
	const global = useContext(Context);

	const reducer = (state, action) => {
		const { field, value, book } = action;

		switch (action.type) {
			case "SET":
				return { ...book };
			case "UPDATE_FIELD":
				return {
					...state,
					[field]: value,
				};
			default:
				break;
		}
	};
	const [state, dispatch] = useReducer(reducer, {});

	const handleDetailsChange = (e, index) => {
		dispatch({
			type: "UPDATE_FIELD",
			field: e.target.name,
			value: e.target.value,
		});
	};

	useEffect(() => {
		dispatch({ type: "SET", book: { ...global.capturedBook } });
	}, [global.capturedBook]);

	const add = async () => {
		console.log(state);
		await axios.post("/api/books", {
			...state,
			author: state.id ? state.author : state.authors[0],
		});
	};

	return (
		<div>
			{Object.entries(state).map(([key, value], index) => {
				return (
					<div>
						<span className="w-1/5">{key}</span>
						<input
							onChange={(e) => handleDetailsChange(e, index)}
							className="w-4/5"
							name={key}
							value={value}
							key={index}
						></input>
					</div>
				);
			})}
			<button onClick={add}>Add Book</button>
		</div>
	);
};

const AddBook = () => {
	const scanTabRef = useRef(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [openTab, setOpenTab] = React.useState(1);
	const [details, setDetails] = useState("");
	const [enteredISBN, setEnteredISBN] = useState("");
	const global = useContext(Context);
	const toggleModal = () => {
		setModalOpen(!modalOpen);
	};

	const submitManual = async () => {
		await axios.get(`/api/book/lookup/${enteredISBN}`).then((response) => {
			global.setGlobal({ ...global, capturedBook: response.data });
		});
		setOpenTab(3);
	};

	useEffect(() => {
		return () => {
			global.setGlobal({ ...global, capturedBook: false });
		};
	}, []);

	const handleManualISBN = (e) => {
		setEnteredISBN(e.target.value);
	};

	const modalStyles = {
		content: {
			width: "50vw",
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
			<button onClick={toggleModal}>Add Book</button>
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
							<div className="px-4 py-5 flex-auto">
								<div className="tab-content tab-space">
									<div
										className={
											openTab === 1 ? "block" : "hidden"
										}
										id="link1"
									>
										<div
											ref={scanTabRef}
											className="w-1/2 m-auto"
										>
											<Scan
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
										<div className="m-auto">
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
										{global.capturedBook ? (
											<div className="grid grid-cols-2">
												<img
													alt="book cover"
													className="w-2/5 block ml-auto mr-auto"
													src={
														global.capturedBook
															.image ||
														global.capturedBook
															.cover
													}
												></img>
												<div>
													<DetailsTab></DetailsTab>
												</div>
											</div>
										) : null}
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
