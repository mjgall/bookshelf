import React, { useEffect } from "react";

const GlobalSearchModal = (props) => {
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
