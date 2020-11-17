import React from "react";
import { Link } from "react-router-dom";

const Subnav = (props) => {
	const links = [
		{ to: "/feed", text: "Feed" },
		{ to: "/library", text: "Library" },
        { to: "/account", text: "Account" }
	];

	const determineClass = (currentPage, to) => {
		if (currentPage === to || (currentPage === "/" && to === "/feed")) {
			return "bg-royalblue text-white";
		} else {
			return "hover:bg-gray-400";
		}
	};

	return (
		<div className="md:w-full md:sticky md:top-sticky">
			<div className="w-full mx-auto">
				{links.map((link, index) => {
					return (
						<Link
							key={index}
							onClick={() => window.scrollTo(0, 0)}
							style={{ borderRadius: "4px", display: "block" }}
							className={`px-2 text-center text-lg my-1 ${determineClass(
								props.currentPage,
								link.to
							)}`}
							to={link.to}
						>
							{link.text}
						</Link>
					);
				})}
			</div>
		</div>
	);
};

export default Subnav;
