import React, { useEffect, useState } from "react";
import axios from 'axios'

const BookTimeline = (props) => {
    const [activities, setActivities] = useState()

	const fetchActivities = async () => {
		const result = await axios.get(
			`/api/activities/book/${props.globalBookId}`
		);
		setActivities(result.data);
	};

	useEffect(() => {
		fetchActivities();
	}, [fetchActivities]);

	return <div>{activities}</div>;
};

export default BookTimeline;
