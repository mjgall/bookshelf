import React, { useEffect, useState } from "react";
import { withRouter, Link } from "react-router-dom";
import logo from "../images/logo.png";

import { Context } from "../globalContext";
import DropdownMenu from "../common/DropdownMenu";

const NavBar = ({
	windowWidth,
	scrollPosition,
	location,
	history,
	clearReferrer,
	referrer,
}) => {
	const global = React.useContext(Context);

	const [existingUser, setExistingUser] = useState();
	const [menuOpen, setMenuOpen] = useState(false);
	const checkExistingUser = () => {
		if (localStorage.getItem("existingUser")) {
			setExistingUser(true);
		} else {
			setExistingUser(false);
		}
	};

	useEffect(() => {
		checkExistingUser();
	}, []);

	scrollPosition = 1;

	const goHome = () => {
		history.push("");
	};

	const calcLogoSize = () => {
		if (
			windowWidth < 1025 ||
			scrollPosition > 0 ||
			location.pathname.indexOf("/book/") > -1
		) {
			return "1.5rem";
		} else {
			return "3rem";
		}
	};

	return (
		<nav className="z-50 flex shadow-lg items-center justify-between flex-wrap bg-royalblue px-8 py-1 md:py-3 sticky top-safe0 md:top-0">
			<div className="flex items-center">
				<div
					className="flex items-center flex-shrink-0 text-white mr-6 cursor-pointer"
					onClick={goHome}
				>
					<img
						alt="Bookshelf logo"
						className="mr-4"
						src={logo}
						style={{ width: calcLogoSize() }}
					></img>
					<span className="font-semibold text-lg tracking-tight">
						{window.location.host === "bookshelf.mikegallagher.app"
							? "Bookshelf"
							: "Papyr"}
					</span>
				</div>
				<span className="hidden md:inline-block text-sm  text-white hover:text-white">
					{global.currentUser
						? `You have ${
								global.books.householdBooks
									.concat(global.books.userBooks)
									.filter(
										(book) =>
											book.user_id ===
											global.currentUser.id
									).length
						  } books`
						: null}
				</span>
			</div>

			<div>
				{!global.currentUser ? (
					<a
						onClick={clearReferrer}
						href={
							global.redirect
								? `/auth/google/redirect${global.redirect}`
								: `/auth/google`
						}
						className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white lg:mt-0 "
					>
						{existingUser ? "Log In" : "Sign Up"}{" "}
						<span role="img" aria-label="books">
							📚
						</span>
					</a>
				) : (
					<>
						<div className=" hidden lg:block">
							<Link
								to="/profile"
								className="inline-block mx-1 text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-black hover:bg-white lg:mt-0 "
							>
								{global.householdMembers.some((membership) => {
									return (
										!membership.invite_declined &&
										!membership.invite_accepted &&
										membership.user_id ===
											global.currentUser.id
									);
								}) && windowWidth > 380 ? (
									<div className="mr-2 inline-block rounded-full bg-red-600 p-1 "></div>
								) : null}
								<div className="flex ">Profile</div>
							</Link>
							<a
								href="/api/logout"
								className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-black hover:bg-white lg:mt-0"
							>
								Logout
							</a>
						</div>
						<div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
							<div
								className="text-white cursor-pointer text-xl leading-none px-1 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
								type="button"
								onClick={() => setMenuOpen(!menuOpen)}
							>
								<DropdownMenu>
									
								</DropdownMenu>
							</div>
						</div>
					</>
				)}
			</div>
		</nav>
	);
};

export default withRouter(NavBar);
