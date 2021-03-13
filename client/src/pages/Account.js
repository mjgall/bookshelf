import React, {useContext} from "react";
import moment from 'moment'
import { Context } from "../globalContext";
import Transparent from "../components/Transparent";

const Account = (props) => {
    const global = useContext(Context);
	return (
		<div>
			<div className="md:text-left text-center">
				<div className="text-2xl font-bold">Account</div>
			</div>
			<div className="text-xl font bold underline mb-2">
				<a
					target="_blank"
					rel="noopener noreferrer"
					href="https://gllghr.io/blog/bookshelf-improvements/"
				>
					Improvements to be made (gllghr.io)
				</a>
			</div>
			<div>
				Joined{" "}
				{moment(global.currentUser.create_date).format(
					"MMMM Do YYYY - h:mm a"
				)}
			</div>
            {global.currentUser.admin ? <Transparent></Transparent> : null}
            
		</div>
	);
};

export default Account;
