import React, { useState } from "react";
// import { usePopper } from "react-popper";
import Tippy from "@tippyjs/react/headless"; // different import path!
import { MoreVertical } from "@styled-icons/evaicons-solid";
import MenuConfirm from "./MenuConfirm";

const MoreMenu = (props) => {
	const [menuOpen, setMenuOpen] = useState(false);
	const [confirmingState, setConfirmingState] = useState(false)
	const [confirmingIndex, setConfirmingIndex] = useState(undefined)

	const isConfirming = (state, index) => {
		setConfirmingIndex(index)
		setConfirmingState(state)
	}

	const determineStyle = (index) => {
		if (confirmingState && index !== confirmingIndex) {
			return { minWidth: "7rem", filter: "blur(.2rem)" }
		} else {
			return { minWidth: "7rem" }
		}
	}

	return (
		<Tippy
			visible={menuOpen}
			interactive
			onClickOutside={() => { setMenuOpen(false); setConfirmingState(false) }}
			// trigger="click"
			placement={props.placement || "bottom-end"}
			render={(attrs) => (
				<div
					tabIndex="-1"
					className="px-4 py-2 border border-solid rounded shadow-sm bg-white"
					{...attrs}
				>
					{props.options.map((option, index) => {
						return (
							<div
								key={index}
								style={determineStyle(index)}
								className="cursor-pointer my-1 bg-white"
							>
								{option.confirm ? (
									<MenuConfirm
										confirmingIndex={index}
										isConfirming={isConfirming}
										close={() => setMenuOpen(false)}
										action={option.action}
										text={option.text}
									></MenuConfirm>
								) : (
									<div
										onClick={() => {
											option.action();
											setMenuOpen(false);
										}}
									>
										{option.text}
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}
		>
			{props.type === "button" ? (
				<div
					onClick={() => {
						setMenuOpen(!menuOpen);
					}}
					className="bg-newblue hover:bg-blue-700 text-white my-1 mx-2 mt-6 py-2 px-3 rounded focus:outline-none focus:shadow-outline text-center cursor-pointer"
				>
					<div className="flex justify-center">
						<MoreVertical size="1.5rem"></MoreVertical>
						<span className="ml-2">Actions...</span>
					</div>
				</div>
			) : (
				<div
					onClick={() => {
						setMenuOpen(!menuOpen);
					}}
				>
					<MoreVertical
						className="cursor-pointer"
						size={props.size || "2em"}
					></MoreVertical>
				</div>
			)}
		</Tippy>
	);
};

export default MoreMenu;
