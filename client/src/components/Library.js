import React, { useContext } from "react";
import Scanner from "./Scanner";
import BookTable from "./BookTable";
import { Context } from "../globalContext";

const Library = () => {
	const global = useContext(Context);

	const addBookToGlobalState = (book) => {
		global.setGlobal({
			...global,
			books: {
				...global.books,
				userBooks: { ...global.books.userBooks, book },
			},
		});
	};

	return (
		<div>
			<div className="text-2xl font-bold">Your Library</div>
			<Scanner
				user={global.currentUser}
				addBookToGlobalState={addBookToGlobalState}
			></Scanner>
			<BookTable
				books={global.books.userBooks.concat(
					global.books.householdBooks
				)}
			></BookTable>
		</div>
	);
};

export default Library;
