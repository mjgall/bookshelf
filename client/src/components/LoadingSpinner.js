import ReactLoading from "react-loading";
import React from "react";


const LoadingSpinner = () => {
	return (
		<div className="flex items-center justify-center h-full">
			<ReactLoading
				type={"spin"}
				color={"gray"}
				height={"3rem%"}
				width={"3rem"}
			/>
		</div>
	);
};


export default LoadingSpinner;