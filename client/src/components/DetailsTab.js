import React, { useEffect, useContext, useReducer } from "react";

import { Context } from "../globalContext";

import axios from "axios";

const DetailsTab = ({ closeModal }) => {
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
		console.log(e.target.name, e.target.value);
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
		const book = await axios
			.post("/api/books", {
				...state,
				author: state.id ? state.author : state.authors[0],
			})
			.then((response) => response.data);
		const newArr = [...global.books.userBooks, book];

		book.user_book_id = book.id
		book.id = book.global_id;

		const newGlobal = {
			...global,
			books: {
				...global.books,
				userBooks: [...global.books.userBooks, book],
			},
			allBooks: [...global.allBooks, book],
			householdBooks: [...global.householdBooks, book],
			capturedBook: false
		};

		console.log(newGlobal);
		global.setGlobal(newGlobal);
		closeModal();
	};

	const fields = ["title", "author"];

	return (
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
					{/* {Object.entries(state).map(([key, value], index) => {
						return (
							<div>
								<span className="w-1/5">{key}</span>
								<input
									onChange={(e) =>
										handleDetailsChange(e, index)
									}
									className="w-4/5"
									name={key}
									value={value}
									key={index}
								></input>
							</div>
						);
					})} */}

					{fields.map((key, index) => {
						return (
							<div>
								<span className="w-1/5 mr-3">
									{key.charAt(0).toUpperCase() + key.slice(1)}
									:
								</span>
								<input
									onChange={(e) =>
										handleDetailsChange(e, index)
									}
									className="w-4/5"
									name={key}
									value={state[key] || ""}
									key={index}
								></input>
							</div>
						);
					})}
				</div>
			</div>
			<button onClick={add}>Add Book</button>
		</div>
	);
};

export default DetailsTab;
