import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Context } from "../globalContext";
const LoanModal = (props) => {
	const global = useContext(Context);
	const [connections, setConnections] = useState([]);
	const fetchConnections = async () => {
		const result = await axios.get("/api/connections");

		setConnections(result.data);
	};
	useEffect(() => {
		fetchConnections();
	}, []);

	const loanTo = async (friendId) => {
		await axios.post("/api/loans", {
			bookId: props.bookId,
			lenderId: global.currentUser.id,
			borrowerId: friendId,
		});
	};

	return (
		<>
			<div className="flex flex-wrap py-6 px-8">
				<div>
					{connections.map((connection, index) => {
						return (
							<div
								onClick={() => loanTo(connection.user_id)}
								key={index}
								className="flex items-center my-2"
							>
								<img
									alt={connection.full}
									src={connection.picture}
									className="rounded-full h-12 w-12 mr-4"
								></img>
								<div>{connection.full}</div>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
};

export default LoanModal;
