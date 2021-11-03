import React, { useContext } from "react";

import BookTable from "./BookTable";
import TaniaTable from "./TaniaTable";
import { Context } from "../globalContext";
import AddBook from "./AddBook";

const Library = () => {
	const global = useContext(Context);

	return (
		<div>
			<div className="md:text-left text-center">
				<div className="text-2xl font-bold">Your Library</div>
			</div>
			<div className="md:m-0 m-auto w-3/4">
				<AddBook></AddBook>
			</div>
			<TaniaTable
				rows={global.books.userBooks.concat(
					global.books.householdBooks
				)}
				columns={[
					{
						accessor: "cover",
						label: "",
						format: (value) => {
							return (
								<img
									width="5rem"
									loading="lazy"
									className="w-8 container"
									src={value}
									alt="cover"
								></img>
							);
						},
					},
					{ accessor: "title", label: "Title" },
					{ accessor: "author", label: "Author" }
				]}
			></TaniaTable>
			{/* <BookTable
				user={global.currentUser}
				books={global.books.userBooks.concat(
					global.books.householdBooks
				)}
				// books={global.allBooks}
			></BookTable> */}
		</div>
	);
};

export default Library;
