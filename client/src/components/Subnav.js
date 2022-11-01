import React from "react";
import { Link } from "react-router-dom";
import links from "../common/pages";

const Subnav = (props) => {
	const determineClass = (currentPage, to) => {
		if (currentPage === to || (currentPage === "/" && to === "/library")) {
			return "bg-newblue text-white";
		} else {
			return "hover:bg-gray-400";
		}
	};

	const startHelpScout = () => {
		window.Beacon("init", "b1b3e665-8909-4289-bcc4-097b0825650e");
		window.Beacon("on", "email-sent", () => window.Beacon("destroy"));
		window.Beacon("open");
		window.Beacon("navigate", "/ask");
	};

	return (
		<div className="md:w-full hidden md:block md:sticky md:top-sticky">
			<div className="w-full mx-auto">
				{links.map((link, index) => {
					return (
						<>
							<Link
								key={index}
								onClick={() => window.scrollTo(0, 0)}
								style={{
									borderRadius: "4px",
									display: "block",
								}}
								className={`px-2 text-center text-lg my-1 ${determineClass(
									props.currentPage,
									link.to
								)}`}
								to={link.to}
							>
								{link.text}
							</Link>
						</>
					);
				})}
				<Link
					onClick={startHelpScout}
					style={{
						borderRadius: "4px",
						display: "block",
					}}
					className={`px-2 text-center text-lg my-1 "hover:bg-gray-400"`}
				>
					Help
				</Link>
			</div>
		</div>
	);
};

export default Subnav;
