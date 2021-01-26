import React, { useState } from "react";
// import { usePopper } from "react-popper";
import Tippy from "@tippyjs/react/headless"; // different import path!
import { MoreVertical } from "@styled-icons/evaicons-solid";
import MenuConfirm from "./MenuConfirm";

const MoreMenu = (props) => {
	const [menuOpen, setMenuOpen] = useState(false);

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
			<MoreVertical
				onClick={() => {
					setMenuOpen(!menuOpen);
				}}
				className="cursor-pointer"
				size={props.size || "2em" }
			></MoreVertical>
		</Tippy>
	);
};

export default MoreMenu;
