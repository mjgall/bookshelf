import React, { useState } from "react";
import {
	CheckSquare,
	XSquare,
	PlusSquare,
	ChevronDownSquare,
} from "@styled-icons/boxicons-solid";

const HandleConfirm = ({ action, text, close }) => {
	const [confirm, setConfirm] = useState(false);

	return (
		<>
			{confirm ? (
				<div className="flex flex-auto">
					<div
						className="flex-auto text-center"
						onClick={() => {
							action();
							setConfirm(!confirm);
							close();
						}}
					>
						<CheckSquare color="green" size="1.5rem"></CheckSquare>
					</div>
					<div
						className="flex-auto text-center"
						onClick={() => {
							setConfirm(!confirm);
							close();
						}}
					>
						<XSquare color="red" size="1.5rem"></XSquare>
					</div>
				</div>
			) : (
				<div onClick={() => setConfirm(!confirm)}>{text}</div>
			)}
		</>
	);
};

export default HandleConfirm;
