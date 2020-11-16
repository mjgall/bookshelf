import React from "react";

const Button = (props) => {
	console.log(props);
	return (
		<div
			{...props}
			className={
				`bg-royalblue hover:bg-blue-700 text-white font-bold my-2 mx-1 py-2 px-4 rounded focus:outline-none focus:shadow-outline text-center cursor-pointer ` +
				props.className
			}
			type="button"
		>
			{props.children}
		</div>
	);
};

export default Button;
