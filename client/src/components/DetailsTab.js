import React, { useEffect, useContext, useReducer } from "react";
import InlineEdit from "@atlaskit/inline-edit";
import Textfield from "@atlaskit/textfield";
import { Context } from "../globalContext";
import Button from "../common/Button";
import { useToasts } from "react-toast-notifications";
import axios from "axios";

const DetailsTab = ({ closeModal, setOpenTab }) => {
	const global = useContext(Context);
	const { addToast } = useToasts();
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

	const handleDetailsChange = (value, field) => {
		dispatch({
			type: "UPDATE_FIELD",
			value: value,
			field: field,
		});
	};

	useEffect(() => {
		dispatch({ type: "SET", book: { ...global.capturedBook } });
	}, [global.capturedBook]);

	const add = async () => {
		if (!state.author || !state.title) {
			addToast("Can't add a blank book.", {
				appearance: "error",
				autoDismiss: true,
			});
			return;
		}

		const book = await axios
			.post("/api/books", {
				...state,
				author:
					state.id || !global.capturedBook
						? state.author
						: state.authors[0],
				manual: !global.capturedBook ? true : false,
				addGlobal: true,
			})
			.then((response) => response.data);

		book.user_book_id = book.id;
		book.id = book.global_id;
		const newGlobal = {
			...global,
			books: {
				...global.books,
				userBooks: [...global.books.userBooks, book],
			},
			allBooks: [...global.allBooks, book],
			householdBooks: [...global.householdBooks, book],
			capturedBook: false,
		};

		global.setGlobal(newGlobal);
		closeModal();
	};

	const addAndAnother = async () => {
		if (!state.author || !state.title) {
			addToast("Can't add a blank book.", {
				appearance: "error",
				autoDismiss: true,
			});
			return;
		}

		const book = await axios
			.post("/api/books", {
				...state,
				author:
					state.id || !global.capturedBook
						? state.author
						: state.authors[0],
				manual: !global.capturedBook ? true : false,
				addGlobal: true,
			})
			.then((response) => response.data);

		book.user_book_id = book.id;
		book.id = book.global_id;
		const newGlobal = {
			...global,
			books: {
				...global.books,
				userBooks: [...global.books.userBooks, book],
			},
			allBooks: [...global.allBooks, book],
			householdBooks: [...global.householdBooks, book],
			capturedBook: false,
		};

		global.setGlobal(newGlobal);
		setOpenTab(2);
	};

	const fields = [
		{ key: "title", display: "Title" },
		{ key: "author", display: "Author" },
		{ key: "binding", display: "Binding" },
		{ key: "publisher", display: "Publisher" },
		{ key: "isbn", display: "ISBN" },
	];

	return (
		<>
			{global.capturedBook ? (
				<div>
					<div className="md:grid md:grid-cols-2">
						<div>
							<img
								alt="book cover"
								className="w-2/5 block ml-auto mr-auto"
								src={
									global.capturedBook.image ||
									global.capturedBook.cover
								}
							></img>
						</div>
						<div>
							{fields.map((object, index) => {
								console.log(object);
								return (
									<div>
										<div className="mr-2 font-bold text-lg">
											{object.display}
										</div>
										{object.key ===
											"binding" || object.key === "publisher" || object.key === "isbn" ? (
												<div>{state[object.key] || ""}</div>
											) : (
												<InlineEdit
													className="w-4/5 my-2"
													readViewFitContainerWidth
													defaultValue={
														state[object.key] || ""
													}
													editView={(fieldProps) => (
														<Textfield
															{...fieldProps}
															autoFocus
														/>
													)}
													readView={() => (
														<div>
															{state[object.key] ||
																""}
														</div>
													)}
													onConfirm={(value) =>
														handleDetailsChange(
															value,
															object.key
														)
													}
												/>
											)}
										<div key={index}></div>
									</div>
								);
							})}
						</div>
					</div>

					<Button color="royalblue" onClick={add}>
						Save
					</Button>
					<Button color="royalblue" onClick={addAndAnother}>
						Save + Add Another
					</Button>
				</div>
			) : (
					<>
						{fields
							.filter((field) => {
								if (
									field.key === "author" ||
									field.key === "title"
								) {
									return field;
								} else {
									return null;
								}
							})
							.map((object, index) => {
								return (
									<div>
										<InlineEdit
											className="w-4/5 my-2"
											readViewFitContainerWidth
											defaultValue={state[object.key] || ""}
											editView={(fieldProps) => (
												<Textfield
													{...fieldProps}
													autoFocus
												/>
											)}
											readView={() => {
												if (!state[object.key]) {
													return (
														<div className="text-gray-500">
															{object.key
																.charAt(0)
																.toUpperCase() +
																object.key.slice(1)}
														</div>
													);
												} else {
													return (
														<div>
															{state[object.key] ||
																object.key}
														</div>
													);
												}
											}}
											onConfirm={(value) =>
												handleDetailsChange(
													value,
													object.key
												)
											}
										/>
									</div>
								);
							})}
						<Button color="royalblue" onClick={add}>
							Save
					</Button>
						<Button color="royalblue" onClick={addAndAnother}>
							Save + Add Another
					</Button>
					</>
				)}
		</>
	);
};

export default DetailsTab;
