import React, { useContext, useState, useEffect } from "react";
import LogRocket from "logrocket";
import "./App.css";
import "./styles/tailwind.css";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	// Redirect,
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
import { ToastProvider, DefaultToast } from "react-toast-notifications";
import Transparent from "./components/Transparent";
import GlobalModal from "./components/GlobalModal";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Helmet } from "react-helmet";
import NewAddBook from "./components/NewAddBook";
import Upzelo from "./pages/Upzelo";
import posthog from "posthog-js";
import zipy from "zipyai";

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

		posthog.init("phc_DbgHM9qK6bG9vPMnws0tFkyNVKJvS6CUsyq81XLXGFA", {
			api_host: "https://app.posthog.com",
			bootstrap: {
				featureFlags: {
					clubs: false,
				},
			},
		});

		zipy.init("1b69acc2");

		if (!loading && global.currentUser) {
			console.log("identifying zipy");
			console.log({
				firstName: global.currentUser.first,
				lastName: global.currentUser.last,
				email: global.currentUser.email,
				userId: global.currentUser.id,
			});
			zipy.identify(global.currentUser.id, {
				firstName: global.currentUser.first,
				lastName: global.currentUser.last,
				email: global.currentUser.email,
			});
		}

		posthog.identify(global.currentUser?.id, {
			email: global.currentUser?.email,
		});

		if (global.currentUser && !window.Frill_Config) {
			window.Frill_Config = window.Frill_Config || [];
			window.Frill_Config.push({
				key: "766e4f5e-5a68-446c-8d0c-71dbf086c7ae",
			});
			if (global.currentUser) {
				window.Beacon("identify", {
					name: global.currentUser.full,
					email: global.currentUser.email,
					avatar: global.currentUser.picture,
				});
			}
		}
	}, [global.currentUser, loading]);

	const CustomToast = ({ children, ...props }) => (
		<DefaultToast {...props}>{children}</DefaultToast>
	);

	return (
		<ToastProvider
			transitionDuration="100"
			autoDismissTimeout="2000"
			components={{ Toast: CustomToast }}
		>
			{global.currentUser ? (
				<Helmet>
					<script
						async
						src="https://widget.frill.co/v2/widget.js"
					></script>
					<title>{"papyr.io"}</title>
				</Helmet>
			) : null}
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
							<Route
								path="/logout"
								component={() => {
									posthog.reset();
									window.location.href = "/api/logout";
									return null;
								}}
							/>
							<Route exact path="/login">
								<Login></Login>
							</Route>
							<Route exact path="/register">
								<Register></Register>
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
							<Route path="/upzelo">
								<Upzelo></Upzelo>
							</Route>
							<Route path="/scanner">
								<Scanner></Scanner>
							</Route>
							<Route path="/sandbox">
								<NewAddBook></NewAddBook>
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
