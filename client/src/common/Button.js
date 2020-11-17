import React from "react";

const Button = (props) => {
	return (
		<button
			{...props}
			className={
				`bg-royalblue hover:bg-blue-700 text-white my-2 mx-1 py-2 px-4 rounded text-center cursor-pointer ` +
				props.className
			}
			type="button"
		>
			{props.children}
		</button>
	);
};

export default Button;
