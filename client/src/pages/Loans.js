import axios from "axios";
import React, { useEffect, useState } from "react";

const Loans = (props) => {

	const [loans, setLoans] = useState([]);
	const getLoans = async () => {
		const loans = await axios
			.get("/api/loans")
			.then((response) => response.data);
		setLoans(loans);
	};

	useEffect(() => {
		getLoans();
	}, []);

	return (
		<div>
			{loans.map((loan) => {
				return <div>{loan.global_id}</div>;
			})}
		</div>
	);
};

export default Loans;
