import React, { useState } from "react";
import banner3 from "../images/banner3.jpg";
import banner2 from "../images/banner2.jpg";
import banner1 from "../images/banner1.jpg";
import screenshot1 from "../images/library.png";
import screenshot6 from "../images/feed.png";
import screenshot7 from "../images/loan.png";
import screenshot8 from "../images/search.png";
import screenshot9 from "../images/book.png";
import axios from "axios";
import { useEffect } from "react";

const MarketingHome = (props) => {
	const [analytics, setAnalytics] = useState();
	const [background, setBackground] = useState();

	const fetchData = async () => {
		const response = await axios.get("/api/data");
		setAnalytics(response.data);
	};
	const selectRandomBackground = () => {
		const random = Math.floor(Math.random() * 3) + 1;

		switch (random) {
			case 1:
				setBackground(banner1);
				break;
			case 2:
				setBackground(banner2);
				break;
			case 3:
				setBackground(banner3);
				break;
			default:
				break;
		}
	};

	useEffect(() => {
		fetchData();
		selectRandomBackground();
	}, []);

	return (
		<div>
			<div
				className="h-32 lg:h-64 bg-cover bg-local bg-center shadow-inner"
				style={{
					backgroundImage: `url(${background})`,
				}}
			></div>
			<div className="w-5/6 container mx-auto my-4">
				<div>
					<div className="m-auto">
						{props.redirect ? (
							<div className="bg-green-400 text-white text-center rounded-lg border-gray-300 border p-3 shadow-lg mb-2">
								<div className="ml-2 mr-6">
									<a href={`http://${window.location.hostname}/auth/google/redirect${props.redirect}`}>
										Log in to view
										{props.redirect === "/profile"
											? " your profile!"
											: props.redirect.indexOf("/book") >
												-1
												? " that book!"
												: " that content!"}
									</a>
								</div>
							</div>
						) : null}

						<div className="bg-white rounded-lg border-gray-300 border p-3 shadow-lg">
							<div className="flex flex-row">
								<div className="px-2">
									<svg
										width="24"
										height="24"
										viewBox="0 0 1792 1792"
										fill="#44C997"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path d="M1299 813l-422 422q-19 19-45 19t-45-19l-294-294q-19-19-19-45t19-45l102-102q19-19 45-19t45 19l147 147 275-275q19-19 45-19t45 19l102 102q19 19 19 45t-19 45zm141 83q0-148-73-273t-198-198-273-73-273 73-198 198-73 273 73 273 198 198 273 73 273-73 198-198 73-273zm224 0q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z" />
									</svg>
								</div>

								<div className="ml-2 mr-6">
									<span className="font-semibold">
										{analytics?.users} user
										{analytics?.users > 1 ? "s" : null}{" "}
										storing {analytics?.books} books!
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="md:my-4 p-4 md:border md:rounded-lg md:shadow-sm bg-white flex items-center">
					<img
						alt="screenshot of Bookshelf"
						className=" shadow-lg rounded-lg w-1/2"
						src={screenshot1}
					></img>
					<div className="text-3xl pl-10">Keep inventory of your physical copies of books.</div>
				</div>
				<div className="md:my-4 p-4 md:border md:rounded-lg md:shadow-sm bg-white flex items-center">
					<div className="text-3xl pr-10">Track books you've borrowed and books you've lent to friends.</div>
					<img
						alt="screenshot of Bookshelf"
						className="shadow-lg rounded-lg w-1/2"
						src={screenshot7}
					></img>
				</div>
				<div className="md:my-4 p-4 md:border md:rounded-lg md:shadow-sm bg-white flex items-center">
					<img
						alt="screenshot of Bookshelf"
						className="shadow-lg rounded-lg w-1/2"
						src={screenshot6}
					></img>
					<div className="text-3xl pl-10">Keep up with the reading activity of friends.</div>
				</div>
				<div className="md:my-4 p-4 md:border md:rounded-lg md:shadow-sm bg-white flex items-center">
					<div className="text-3xl pr-10">Keep track of personal notes and shared notes from other members of your household.</div>
					<img
						alt="screenshot of Bookshelf"
						className="shadow-lg rounded-lg w-1/2"
						src={screenshot9}
					></img>
				</div>
			</div>
		</div>
	);
};

export default MarketingHome;
