import React from "react";
import { createPopper } from "@popperjs/core";
import { Menu as MenuIcon } from "@styled-icons/boxicons-regular";
import { Link, withRouter } from "react-router-dom";
import links from "./pages";

const Dropdown = ({ color, path }) => {
	// dropdown props
	const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
	const btnDropdownRef = React.createRef();
	const popoverDropdownRef = React.createRef();

	const openDropdownPopover = () => {
		createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
			placement: "bottom-start",
		});
		setDropdownPopoverShow(true);
	};
	const closeDropdownPopover = () => {
		setDropdownPopoverShow(false);
	};

	const determineClass = (currentPage, to) => {
		if (currentPage === to || (currentPage === "/" && to === "/library")) {
			return "bg-newblue text-white";
		} else {
			return "hover:bg-gray-400 text-black";
		}
	};

	// bg colors
	let bgColor;
	color === "white"
		? (bgColor = "bg-blueGray-700")
		: (bgColor = "bg-" + color + "-500");
	return (
		<>
			<div className="flex flex-wrap">
				<div className="w-full sm:w-6/12 md:w-4/12 px-4">
					<div className="relative inline-flex align-middle w-full">
						<div
							className={
								"text-white font-bold uppercase text-sm rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-50 "
							}
							ref={btnDropdownRef}
							onClick={() => {
								dropdownPopoverShow
									? closeDropdownPopover()
									: openDropdownPopover();
							}}
						>
							<MenuIcon
								color="white"
								size="2rem"
								id="menu-icon"
							></MenuIcon>
						</div>
						<div
							ref={popoverDropdownRef}
							className={
								(dropdownPopoverShow ? "block " : "hidden ") +
								(color === "white"
									? "bg-white "
									: bgColor + " ") +
								"w-full text-base z-50 float-left list-none text-left rounded shadow-lg mt-1 bg-white"
							}
							style={{ minWidth: "12rem"}}
						>
							{[
								{ to: "/profile", text: "Profile" },
								...links,
							].map((link, index) => {
								return (
									<Link
										key={index}
										// onClick={() => window.scrollTo(0, 0)}
										onClick={() => {
                                            window.scrollTo(0, 0)
											dropdownPopoverShow
												? closeDropdownPopover()
												: openDropdownPopover();
										}}
										style={{
											borderRadius: "4px",
											display: "block",
										}}
										className={`px-2 py-1 text-center text-lg my-1 ${determineClass(
											path,
											link.to
										)}`}
										to={link.to}
									>
										{link.text}
									</Link>
								);
							})}
							<a
								href="/api/logout"
                                style={{
                                    borderRadius: "4px",
                                    display: "block",
                                }}
								className={`px-2 py-1 text-center text-lg my-1 ${determineClass(
									path,
									"/api/logout"
								)}`}
							>
								Logout
							</a>
							{/* <a
								href="#pablo"
								className={
									"text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent " +
									(color === "white"
										? " text-blueGray-700"
										: "text-white")
								}
								onClick={(e) => e.preventDefault()}
							>
								Action
							</a>
							<a
								href="#pablo"
								className={
									"text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent " +
									(color === "white"
										? " text-blueGray-700"
										: "text-white")
								}
								onClick={(e) => e.preventDefault()}
							>
								Another action
							</a>
							<a
								href="#pablo"
								className={
									"text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent " +
									(color === "white"
										? " text-blueGray-700"
										: "text-white")
								}
								onClick={(e) => e.preventDefault()}
							>
								Something else here
							</a> */}
							{/* <div className="h-0 my-2 border border-solid border-t-0 border-blueGray-800 opacity-25" />
							<a
								href="#pablo"
								className={
									"text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent " +
									(color === "white"
										? " text-blueGray-700"
										: "text-white")
								}
								onClick={(e) => e.preventDefault()}
							>
								Seprated link
							</a> */}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default withRouter(Dropdown);
