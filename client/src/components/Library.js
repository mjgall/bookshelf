import React, { useContext } from "react";
import Scanner from "./Scanner";
import BookTable from "./BookTable";
import { Context } from "../globalContext";
import AddBook from "./AddBook";

const Library = () => {
	const global = useContext(Context);

	return (
		<div>
			<div className="text-2xl font-bold">Your Library</div>
			<AddBook></AddBook>
			<BookTable
				books={global.books.userBooks.concat(
					global.books.householdBooks
				)}
			></BookTable>
		</div>
	);
};

export default Library;
