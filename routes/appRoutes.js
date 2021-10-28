const axios = require("axios");

const keys = require("../config/keys");
const randomId = require("../services/randomId");

const _ = require("lodash");

const getBooks = require("../queries/getBooks");
const addBook = require("../queries/addBook.js");
const getAnalytics = require("../queries/getAnalytics");
const updateBook = require("../queries/updateBook");
const addHouseholdInvitation = require("../queries/addHouseholdInvitation");
const getUserByEmail = require("../queries/getUserByEmail");
const getHouseholds = require("../queries/getHouseholds");
const getHouseholdInvitations = require("../queries/getHouseholdInvitations");
const acceptPendingHousehold = require("../queries/acceptPendingHousehold");
const getUserById = require("../queries/getUserById");
const addHousehold = require("../queries/addHousehold");
const getHouseholdMembersByUserId = require("../queries/getHouseholdMembersByUserId");
const declinePendingHousehold = require("../queries/declinePendingHousehold");
const deleteHousehold = require("../queries/deleteHousehold");
const removeHouseholdMember = require("../queries/removeHouseholdMember");
const getUserBooks = require("../queries/getUserBooks");
const getHouseholdBooks = require("../queries/getHouseholdBooks");
const getHouseholdNotes = require("../queries/getHouseholdNotes");
const updateUsersGlobalBooks = require("../queries/updateUsersGlobalBooks");
const getBook = require("../queries/getBook");
const deleteBook = require("../queries/deleteBook");
const updateHouseholdsBooks = require("../queries/updateHouseholdsBooks");
const sendEmail = require("../services/aws-ses");
const leaveHousehold = require("../queries/leaveHousehold");
const addFriendship = require("../queries/addFriendship");
const updateFriendship = require("../queries/updateFriendship");
const getFriendships = require("../queries/getFriendships");
const addActivity = require("../queries/addActivity");
const getActivities = require("../queries/getActivities");
const getGlobalBookByISBN = require("../queries/getGlobalBookByISBN");
const saveGlobalBook = require("../queries/saveGlobalBook");
const updateActivity = require("../queries/updateActivity");
const addLike = require("../queries/updateLike");
const updateLike = require("../queries/updateLike");
const getFriendLikes = require("../queries/getFriendLikes");
const searchUsers = require("../queries/searchUsers");
const getLikes = require("../queries/getLikes");
const getBookActivities = require("../queries/getBookActivities");
const getUsers = require("../queries/getUsers");
const addLoan = require("../queries/addLoan.js");
const getLoans = require("../queries/getLoans");
const getActivitiesPaginated = require("../queries/getActivitiesPaginated");
const getConnections = require("../queries/getConnections");
const updateLoan = require("../queries/updateLoan");
const getSharedShelfBooks = require("../queries/getSharedShelfBooks");
const updateUser = require("../queries/updateUser");
const getFriendsWithBook = require("../queries/getFriendsWithBook");

const checkAuthed = (req, res, next) => {
	if (req?.user?.id) {
		next();
	} else {
		res.status(401).send("Unauthorized");
	}
};

const checkAdmin = (req, res, next) => {
	if (req?.user?.admin) {
		next();
	} else {
		res.status(401).send("Unauthorized");
	}
};

module.exports = (app) => {
	app.get("/api/bootstrap", async (req, res) => {
		if (!req.user) {
			res.send({
				currentUser: null,
				books: {
					userBooks: [],
					householdBooks: [],
				},
				households: [],
				householdMembers: [],
			});
		} else {
			const currentUser = req.user;
			// const books = await getBooks(req.user.id);

			const userBooks = await getUserBooks(req.user.id);
			const householdBooks = await getHouseholdBooks(
				req.user.id,
				req.body.householdId
			);

			const households = await getHouseholds(req.user.id);
			const householdMembers = await getHouseholdMembersByUserId(
				req.user.id
			);

			res.send({
				currentUser,
				allBooks: userBooks.concat(householdBooks),
				books: {
					userBooks,
					householdBooks,
				},
				households,
				householdBooks,
				householdMembers,
			});
		}
	});
	app.get("/api/book/search/title/:term", checkAuthed, async (req, res) => {
		try {
			const encoded = encodeURI(
				`https://api2.isbndb.com/books/${req.params.term}?page=1&pageSize=20&column=title&beta=1`
			);
			const response = await axios.get(encoded, {
				headers: {
					Authorization: keys.ISBN_AUTH_API,
				},
			});

			const results = response.data.books.filter((result) => {
				if (
					result.binding === "Audio Cd" ||
					result.binding === "Audio CD" ||
					result.binding === "ePub" ||
					result.binding === "Audio Cassette"
				) {
					return null;
				} else {
					return result;
				}
			});

			res.send({ total: response.data.total, books: results });
		} catch (error) {
			res.send(error);
		}
	});

	app.get(
		"/api/book/search/title/:term/author/:author",
		checkAuthed,
		async (req, res) => {
			try {
				const encoded = encodeURI(
					`https://api2.isbndb.com/search/books?author=${req.params.author}&text=${req.params.term}`
				);
				const response = await axios.get(encoded, {
					headers: {
						Authorization: keys.ISBN_AUTH_API,
					},
				});

				const results = response.data.data.filter((result) => {
					if (
						result.binding === "Audio Cd" ||
						result.binding === "Audio CD" ||
						result.binding === "ePub" ||
						result.binding === "Audio Cassette"
					) {
						return null;
					} else {
						return result;
					}
				});

				res.send({ total: response.data.total, books: results });
			} catch (error) {
				res.send(error);
			}
		}
	);

	app.post("/api/global_book", checkAuthed, async (req, res) => {
		console.log({ isbn10: req.body.isbn, isbn13: req.body.isbn13 });
		try {
			const book = await getGlobalBookByISBN(
				req.body.isbn,
				req.body.isbn13
			);

			if (book) {
				res.send({ success: true, existed: true });
			} else {
				console.log(req.body);
				const response = await saveGlobalBook({
					...req.body,
					isbn10: req.body.isbn,
					cover: req.body.image,
				});
				res.send({ success: true, existed: false });
			}
		} catch (error) {
			res.send(error);
		}
	});

	app.get("/api/book/lookup/:isbn", checkAuthed, async (req, res) => {
		const book = await getGlobalBookByISBN(req.params.isbn);

		if (book) {
			res.send(book);
		} else {
			try {
				const response = await axios.get(
					`https://api2.isbndb.com/book/${req.params.isbn}`,
					{
						headers: {
							Authorization: keys.ISBN_AUTH_API,
						},
					}
				);
				if (response.data.book) {
					const globalBook = await saveGlobalBook({
						...response.data.book,
						author: response.data.book.authors[0],
					});

					res.send({
						...globalBook,
					});
				} else {
					res.send({
						error: true,
						reason: "No book with that ISBN found, sorry.",
					});
				}
			} catch (error) {
				console.log(error);
			}
		}
	});

	//get information about the number of users and the number of books in total
	app.get("/api/data", async (req, res) => {
		const response = await getAnalytics();
		res.send(response);
	});

	app.get("/api/users/:id", checkAuthed, async (req, res) => {
		const response = await getUserById(req.params.id);
		res.send(response.data);
	});

	//add a book
	app.post("/api/books", checkAuthed, async (req, res) => {
		const {
			title,
			author,
			isbn10,
			isbn13,
			isbn,
			cover,
			image,
			id,
			manual,
			addGlobal,
		} = req.body;

		if (addGlobal) {
			response = await addBook({
				userId: req.user.id,
				title,
				author,
				isbn10: isbn,
				isbn13,
				cover: image || cover,
				addGlobal: true,
			});
		} else {
			response = await addBook({
				userId: req.user.id,
				id,
				title,
				author,
				isbn10,
				isbn13,
				cover,
				manual,
			});
		}

		await addActivity(req.user.id, response.global_id, 3);
		res.send(response);
	});

	//get a users books
	app.get("/api/books", checkAuthed, async (req, res) => {
		if (req.user) {
			// const response = await getBooks(req.user.id);

			const userBooks = await getUserBooks(req.body.id);
			const householdBooks = await getHouseholdBooks(req.body.id);

			res.send({
				success: true,
				books: {
					user: userBooks,
					household: householdBooks,
				},
			});
		} else {
			res.send({
				success: false,
				books: [],
			});
		}
	});

	//update the information about a book
	app.put("/api/books", checkAuthed, async (req, res) => {
		const book = {
			...req.body,
		};

		if (req.body.field === "read") {
			if (book.bookType === "personal") {
				const updatedBook = await updateBook(
					book.field,
					book.value,
					book.id
				);
				if (book.value) {
					await addActivity(req.user.id, book.globalId, 2);
				}
				res.send(updatedBook);
			} else {
				const updatedBook = await updateUsersGlobalBooks(
					req.user.id,
					req.body.id,
					req.body.field,
					req.body.value
				);
				if (book.value) {
					await addActivity(req.user.id, book.id, 2);
				}
				res.send(updatedBook);
			}
		} else if (req.body.field === "notes") {
			if (book.bookType === "personal") {
				const updatedBook = await updateBook(
					book.field,
					book.value,
					book.id
				);
				res.send(updatedBook);
			} else {
				const addNotes = await updateUsersGlobalBooks(
					req.user.id,
					req.body.id,
					req.body.field,
					req.body.value
				);
				res.send(addNotes);
			}
		} else {
			if (book.bookType === "personal") {
				const updatedBook = await updateBook(
					book.field,
					book.value,
					book.id
				);

				switch (book.field) {
					case "started":
						await addActivity(req.user.id, req.body.globalId, 1);
						break;
					case "read":
						await addActivity(req.user.id, req.body.globalId, 2);
					default:
						break;
				}

				res.send(updatedBook);
			} else {
				res.send(book);
			}
		}
	});

	//delete a household
	app.delete(
		"/api/households/:householdId",
		checkAuthed,
		async (req, res) => {
			const { householdId } = req.params;
			const householdDeleted = await deleteHousehold(householdId);
			res.send(householdDeleted);
		}
	);

	//add a household
	app.post("/api/households", checkAuthed, async (req, res) => {
		const { name, userId } = req.body;
		const newHousehold = await addHousehold(name, userId);
		res.send(newHousehold);
	});

	//get members of a household
	app.get("/api/user/households/members", checkAuthed, async (req, res) => {
		const householdMembers = await getHouseholdMembersByUserId(req.user.id);
		res.send(householdMembers);
	});

	//get households that a user is a part of
	app.get("/api/households", checkAuthed, async (req, res) => {
		const households = await getHouseholds(req.user.id);
		res.send(households);
	});

	//get household notes on any book by global id
	app.get(
		"/api/notes/households/:globalBookId",
		checkAuthed,
		async (req, res) => {
			try {
				const householdNotes = await getHouseholdNotes(
					req.params.globalBookId,
					req.user.id
				);
				res.send(householdNotes);
			} catch (error) {
				res.send({
					error: true,
				});
				throw Error(error);
			}
		}
	);

	//send invitation
	app.post("/api/invitations", checkAuthed, async (req, res) => {
		const correspondingUser = await getUserByEmail(req.body.invitedEmail);
		if (!correspondingUser) {
			res.send({
				success: false,
				message: "No user found with that email",
			});
		} else {
			const household = await addHouseholdInvitation(
				req.user.id,
				req.body.householdId,
				correspondingUser.id
			);
			res.send({
				...household,
				invited_email: correspondingUser.email,
				invited_photo: correspondingUser.picture,
			});
		}
	});

	//get current invites
	app.get("/api/invitations", checkAuthed, async (req, res) => {
		const households = await getHouseholdInvitations(req.user.id);
		res.send(households);
	});

	//accept, decline, delete a membership
	app.put("/api/invitations", checkAuthed, async (req, res) => {
		if (req.body.accept) {
			//update households_users to invite_accepted = true, should return the id of the user accepting (accepted.user_id)

			const accepted = await acceptPendingHousehold(req.body.id);

			res.send(accepted);
		} else if (req.body.decline) {
			const declined = await declinePendingHousehold(req.body.id);
			res.send(declined);
		} else if (req.body.remove) {
			let response;
			if (req.body.userId === req.user.id) {
				response = await leaveHousehold(
					req.body.householdId,
					req.body.userId
				);
			} else {
				response = await removeHouseholdMember(
					req.body.householdId,
					req.body.userId
				);
			}

			res.send(response);
		} else {
			res.status(400).send("No status");
		}
	});

	//update the households_books information (notes)
	app.post("/api/households/books", checkAuthed, async (req, res) => {
		const updatedNotes = await updateHouseholdsBooks(
			req.body.householdId,
			req.body.globalBookId,
			req.body.field,
			req.body.value,
			req.user
		);
		res.send(updatedNotes);
	});

	//send an email
	//TODO put this somewhere else
	app.post("/api/email", checkAuthed, async (req, res) => {
		const { recipientAddress, subject, body, html } = req.body;
		const email = await sendEmail(recipientAddress, subject, body, html);
		res.send({
			success: true,
			email,
		});
	});

	//get a users public books
	app.get("/api/shelves/:shelfId", async (req, res) => {
		const books = await getSharedShelfBooks(req.params.shelfId);

		// const books = await getBooks(req.params.shelfId);
		res.send(books);
	});

	//get single book by globalId
	app.get("/api/book/:bookId", checkAuthed, async (req, res) => {
		const book = await getBook(req.params.bookId, req.user.id);
		res.send(book);
	});

	//delete book
	app.delete("/api/books/:globalBookId/", checkAuthed, async (req, res) => {
		//you should only be able to delete a user_book from your own bookshelf. user.id needs to be checked when this comes in
		const deletion = await deleteBook(req.params.globalBookId, req.user.id);

		await addActivity(req.user.id, req.params.globalBookId, 4);
		res.send(deletion);
	});

	//SOCIAL ASPECT ROUTES

	app.post("/api/friends", checkAuthed, async (req, res) => {
		let connectingUser;
		if (!req.user) {
			connectingUser = 1;
		} else {
			connectingUser = req.user.id;
		}

		try {
			const response = await addFriendship(
				connectingUser,
				req.body.userEmail
			);
			res.send(response);
			if (response.id) {
				const email = await sendEmail(
					req.body.userEmail,
					"You have a new friend request on Bookshelf!",
					"Go to Bookshelf to view your pending requests.",
					`Check your <a href="https://bookshelf.mikegallagher.app/profile">Profile</a> to view your pending requests!`
				);
				console.log(email);
			}
		} catch (error) {
			res.send({ reason: error });
		}
	});

	app.put("/api/friends", checkAuthed, async (req, res) => {
		let connectingUser;
		if (!req.user) {
			connectingUser = 1;
		} else {
			connectingUser = req.user.id;
		}
		const response = await updateFriendship(
			connectingUser,
			req.body.friendshipId,
			req.body.action
		);
		console.lo;
		res.send(response);
	});

	app.get("/api/friends", checkAuthed, async (req, res) => {
		let connectingUser;
		if (!req.user) {
			connectingUser = 1;
		} else {
			connectingUser = req.user.id;
		}
		const response = await getFriendships(connectingUser);
		res.send(response);
	});

	app.get("/api/friends/:friendshipId", checkAuthed, async (req, res) => {
		let connectingUser;
		if (!req.user) {
			connectingUser = 1;
		} else {
			connectingUser = req.user.id;
		}

		const response = await getFriendships(
			connectingUser,
			req.params.friendshipId
		);
		res.send(response);
	});

	app.post("/api/activities", checkAuthed, async (req, res) => {
		// case 1:
		// 	return "started reading";
		// case 2:
		// 	return "read";
		// case 3:
		// 	return "added";
		// case 4:
		// 	return "removed";
		// case 5:
		// 	return "loaned";
		// default:
		// 	break;

		try {
			const activity = await addActivity(
				req.user.id,
				req.body.objectId,
				req.body.action
			);
			res.send(activity);
		} catch (error) {
			res.status(500).send(error);
		}
	});

	app.get("/api/activities", checkAuthed, async (req, res) => {
		//should maybe return these separately so we render activities sooner
		try {
			let activities;
			if (req.query.page && req.query.limit) {
				activities = await getActivitiesPaginated(
					req.user.id,
					req.query.page,
					req.query.limit
				);
			} else {
				activities = await getActivities(req.user.id);
			}

			// const activities = await getActivities(req.user.id);
			const likes = await getLikes(req.user.id);
			const activitiesWithLike = activities.map((activity) => {
				let likesAdded = [];

				for (let index = 0; index < likes.length; index++) {
					const like = likes[index];

					if (like.activity_id === activity.id) {
						likesAdded = [...likesAdded, like];
					}
				}

				return { ...activity, likes: likesAdded };
			});

			const updatedActivities = activitiesWithLike.map((activity) => {
				let likeContent = {
					color: "lightgray",
					likedByUser: false,
					people: [],
					string: "",
					total: 0,
				};

				if (activity.likes.length > 0) {
					if (
						activity.likes.some(
							(like) => like.liked_by === req.user.id
						)
					) {
						likeContent.color = "newblue";
						likeContent.likedByUser = true;
						likeContent.people = [
							"You",
							...activity.likes
								.map((like) => like.full)
								.filter((person) => person !== req.user.full),
						];
					} else {
						likeContent.people = activity.likes
							.map((like) => like.full)
							.filter((person) => person !== req.user.full);
					}

					likeContent.string = likeContent.people.join(", ");
					likeContent.total = likeContent.people.length;
				}

				return { ...activity, likeContent };
			});

			res.send(updatedActivities);
		} catch (error) {
			console.log(error);
			res.status(500).send(error);
		}
	});

	app.put("/api/activities", checkAuthed, async (req, res) => {
		const { field, value, id, owner_id } = req.body;
		if (owner_id !== req.user.id) {
			res.send(401);
		} else {
			try {
				const updatedRecord = await updateActivity(field, value, id);
				res.send(updatedRecord);
			} catch {
				res.status(500).send(error);
			}
		}
	});

	app.get("/api/activities/book/:globalId", checkAuthed, async (req, res) => {
		const { globalId } = req.params;
		const activities = await getBookActivities(
			req.user.id,
			globalId,
			req.query.page,
			req.query.limit
		);

		res.send(activities);
	});

	app.post("/api/interactions", checkAuthed, async (req, res) => {
		const { type, activityId } = req.body;

		switch (type) {
			case "like":
				const newLike = await updateLike(req.user.id, activityId);
				if (newLike) {
					res.send(newLike);
				}
				break;
			case "unlike":
				const removedLike = await updateLike(
					req.user.id,
					activityId,
					true
				);
				if (removedLike) {
					res.send(removedLike);
				}
				break;
			default:
				break;
		}

		if (type === "like") {
		}
	});

	app.get("/api/users/search/:term", checkAuthed, async (req, res) => {
		const results = await searchUsers(req.params.term);
		res.send(results);
	});

	app.get("/api/users", checkAdmin, async (req, res) => {
		const users = await getUsers();
		res.send(users);
	});

	app.post("/api/loans", checkAuthed, async (req, res) => {
		const { bookId, lenderId, borrowerId, requesting } = req.body;
		if (requesting) {
			const response = await addLoan(
				bookId,
				lenderId,
				borrowerId,
				null,
				requesting
			);

			res.send(response);
		} else {
			const response = await addLoan(
				bookId,
				lenderId,
				borrowerId,
				Date.now()
			);
			await addActivity(lenderId, bookId, 5, borrowerId);
			res.send(response);
		}
	});

	app.get("/api/loans", checkAuthed, async (req, res) => {
		const response = await getLoans(req.user.id);
		res.send(response);
	});

	app.put("/api/loans", checkAuthed, async (req, res) => {
		console.log(req.body.action);
		switch (req.body.action) {
			case "hide":
				const hide = await updateLoan(
					"hide",
					req.body.id,
					req.body.user_books_id
				);
				res.send(hide);
				break
			case "grant":
				const grantResponse = await updateLoan(
					"grant",
					req.body.id,
					req.body.user_books_id
				);
				const grantActivity = await addActivity(
					grantResponse[0].lender_id,
					grantResponse[0].global_id,
					5,
					grantResponse[0].borrower_id
				);
				res.send(grantActivity);
				break;
			case "end":
				const endResponse = await updateLoan(
					"end",
					req.body.id,
					req.body.user_books_id
				);
				const endActivity = await addActivity(
					endResponse[0].lender_id,
					endResponse[0].global_id,
					6,
					endResponse[0].borrower_id
				);
				res.send(endActivity);
				break;
			case "cancel":
				const cancelResponse = await updateLoan(
					"cancel",
					req.body.id,
				);
				res.send(cancelResponse);
				break;
			default:
				break;
		}
	});

	app.get("/api/connections", checkAuthed, async (req, res) => {
		const response = await getConnections(req?.user?.id || undefined);

		const dupesRemoved = _.uniqBy(response, "user_id");

		res.send(dupesRemoved);
	});

	app.get("/api/friendwithbook/:bookId", checkAuthed, async (req, res) => {
		const response = await getFriendsWithBook(
			req?.user?.id,
			req.params.bookId
		);
		res.send(response);
	});

	app.put("/api/users", checkAuthed, async (req, res) => {
		if (!req.body.field || req.body.field === "admin") {
			res.status(400);
		}
		const response = await updateUser(
			req.user.id,
			req.body.field,
			req.body.value
		);
		res.send(response);
	});
};
