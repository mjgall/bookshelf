import React, { useEffect, useContext } from "react";
import { Context } from "../globalContext";

const GlobalSearchModal = (props) => {
	const global = useContext(Context);

	useEffect(() => {}, []);

	return (
		<>
			<div className="flex flex-wrap py-6 px-8">
				<div>{props.isbn}</div>
			</div>
		</>
	);
};

export default GlobalSearchModal;
