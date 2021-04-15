import React, { useContext, useState, useEffect } from "react";
import LogRocket from "logrocket";
import "./App.css";
import "./styles/tailwind.css";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	// useRouteMatch,
} from "react-router-dom";

import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Book from "./pages/Book";
import Profile from "./pages/Profile";
import Scanner from "./components/AddBook";
import SharedShelf from "./pages/SharedShelf";
import PrivateRoute from "./components/PrivateRoute";
import { Context } from "./globalContext";
import { ToastProvider } from "react-toast-notifications";
import Transparent from "./components/Transparent";
import GlobalModal from "./components/GlobalModal";


const App = (props) => {
	const global = useContext(Context);
	const { loading } = global;
	const [referrer, setReferrer] = useState("");
	// const match = useRouteMatch();

	const updateNavReferrer = (referrer) => {
		setReferrer(referrer);
	};

	const clearReferrer = () => {
		setReferrer(null);
	};

	useEffect(() => {
		if (
			!loading &&
			global.currentUser &&
			process.env.NODE_ENV === "production"
		) {
			LogRocket.init("e6mxy2/bookshelf");
			LogRocket.identify(global.currentUser.id, {
				name: global.currentUser.full,
				email: global.currentUser.email,
			});
		}
	}, [global.currentUser, loading]);

	return (
		<ToastProvider transitionDuration="100" autoDismissTimeout="2000">
			<Router>
				{loading ? null : (
					<>
						<NavBar
							// currentPage={match.url}
							windowWidth={1000}
							referrer={referrer}
						></NavBar>
						<Switch>
							<Route exact path="/">
								<Home
									clearReferrer={clearReferrer}
									updateNavReferrer={updateNavReferrer}
								></Home>
							</Route>
							<PrivateRoute path="/profile" exact>
								<Profile
									books={global.books}
									members={global.householdMembers}
									households={global.households}
									user={global.currentUser}
								></Profile>
							</PrivateRoute>
							<PrivateRoute exact path="/book/:id">
								<Book></Book>
							</PrivateRoute>
							<Route path="/shelf/:shelfId">
								<SharedShelf></SharedShelf>
							</Route>
							<PrivateRoute path="/transparent">
								<Transparent></Transparent>
							</PrivateRoute>
							
							<Route path="/scanner">
								<Scanner></Scanner>
							</Route>

							<Route path="/*">
								<Home
									clearReferrer={clearReferrer}
									updateNavReferrer={updateNavReferrer}
								></Home>
							</Route>
						</Switch>
					</>
				)}
				<GlobalModal></GlobalModal>
			</Router>
		</ToastProvider>
	);
};

export default App;
