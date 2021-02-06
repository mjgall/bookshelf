import React, { useState } from "react";
// import { usePopper } from "react-popper";
import Tippy from "@tippyjs/react/headless"; // different import path!
import { MoreVertical } from "@styled-icons/evaicons-solid";
import MenuConfirm from "./MenuConfirm";

const MoreMenu = (props) => {
	const [menuOpen, setMenuOpen] = useState(false);
	console.log(props.children);
	return (
		<Tippy
			visible={menuOpen}
			interactive
			onClickOutside={() => setMenuOpen(false)}
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
								style={{ minWidth: "7rem" }}
								className="cursor-pointer my-1 bg-white"
							>
								{option.confirm ? (
									<MenuConfirm
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
					className="bg-royalblue hover:bg-blue-700 text-white my-1 mx-2 mt-6 py-2 px-3 rounded focus:outline-none focus:shadow-outline text-center cursor-pointer"
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
