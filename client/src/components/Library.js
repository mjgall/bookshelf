import React, { useContext, useState, useEffect } from "react";

import BookTable from "./BookTable";
import { Context } from "../globalContext";
import AddBook from "./AddBook";

const Library = () => {
	const global = useContext(Context);
	const [books, setBooks] = useState([]);

	// useEffect(() => {
	// 	const refreshed = global.books.userBooks.concat(
	// 		global.books.householdBooks
	// 	)

	// 	setBooks(refreshed)
	// }, [global.books.userBooks, global.books.householdBooks])

	return (
		<div>
			<div className="text-2xl font-bold">Your Library</div>
			<AddBook></AddBook>
			<BookTable
				books={global.books.userBooks.concat(
					global.books.householdBooks
				)}
				// books={global.allBooks}
			></BookTable>
		</div>
	);
};

export default Library;
