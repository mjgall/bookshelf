import React, { useContext, useEffect } from "react";
import Feed from "../components/Feed";
import Subnav from "../components/Subnav";
import MarketingHome from "./MarketingHome";

import moment from "moment";
import { withRouter, Switch, Route, useRouteMatch } from "react-router-dom";

import { Context } from "../globalContext";
import Library from "../components/Library";

const Home = (props) => {
	const global = useContext(Context);

	useEffect(() => {
		if (props.location.state?.redirect) {
			// addRedirect(props.location.state.from)
			global.setGlobal({
				...global,
				redirect: props.location.state.from,
			});
		}
	}, [global, props.location.state]);

	let match = useRouteMatch();

	return (
		<>
			{global.currentUser ? (
				<div className="md:container my-4">
					<div
						className="md:grid"
						style={{
							gridTemplateColumns: "10% 88%",
							gridColumnGap: "2%",
						}}
					>
						<div className="md:bg-transparent">
							<Subnav currentPage={match.url}></Subnav>
						</div>
						<Switch>
							<Route path="/library">
								<Library></Library>
							</Route>
							<Route path="/feed">
								<Feed></Feed>
							</Route>
							<Route path="/account">
								<div>
									<div className="md:text-left text-center">
										<div className="text-2xl font-bold">
											Account
										</div>
									</div>
									<div>
										Joined{" "}
										{moment(
											global.currentUser.create_date
										).format("MMMM Do YYYY - h:mm a")}
									</div>
								</div>
							</Route>

							<Route path="/*">
								<Feed></Feed>
							</Route>
						</Switch>
					</div>
				</div>
			) : (
				<MarketingHome redirect={global.redirect}></MarketingHome>
			)}
		</>
	);
};

export default withRouter(Home);
