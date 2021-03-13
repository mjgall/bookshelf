const axios = require("axios");

const keys = require("../config/keys");

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
	app.get("/api/book/search/title/:term", async (req, res) => {
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

	app.get("/api/book/search/title/:term/author/:author", async (req, res) => {
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
	});

	app.post("/api/global_book", async (req, res) => {
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

	app.get("/api/book/lookup/:isbn", async (req, res) => {
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

	app.get("/api/users/:id", async (req, res) => {
		const response = await getUserById(req.params.id);
		res.send(response.data);
	});

	//add a book
	app.post("/api/books", async (req, res) => {
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
				cover: image,
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
	app.get("/api/books", async (req, res) => {
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
	app.put("/api/books", async (req, res) => {
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
	app.delete("/api/households/:householdId", async (req, res) => {
		const { householdId } = req.params;
		const householdDeleted = await deleteHousehold(householdId);
		res.send(householdDeleted);
	});

	//add a household
	app.post("/api/households", async (req, res) => {
		const { name, userId } = req.body;
		const newHousehold = await addHousehold(name, userId);
		res.send(newHousehold);
	});

	//get members of a household
	app.get("/api/user/households/members", async (req, res) => {
		const householdMembers = await getHouseholdMembersByUserId(req.user.id);
		res.send(householdMembers);
	});

	//get households that a user is a part of
	app.get("/api/households", async (req, res) => {
		const households = await getHouseholds(req.user.id);
		res.send(households);
	});

	//get household notes on any book by global id
	app.get("/api/notes/households/:globalBookId", async (req, res) => {
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
	});

	//send invitation
	app.post("/api/invitations", async (req, res) => {
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
	app.get("/api/invitations", async (req, res) => {
		const households = await getHouseholdInvitations(req.user.id);
		res.send(households);
	});

	//accept, decline, delete a membership
	app.put("/api/invitations", async (req, res) => {
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
	app.post("/api/households/books", async (req, res) => {
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
	app.post("/api/email", async (req, res) => {
		const { recipientAddress, subject, body } = req.body;
		const email = await sendEmail(recipientAddress, subject, body);
		res.send({
			success: true,
			email,
		});
	});

	//get a users public books
	app.get("/api/shelves/:shelfId", async (req, res) => {
		const books = await getBooks(req.params.shelfId);
		res.send(books);
	});

	//get single book by globalId
	app.get("/api/book/:bookId", async (req, res) => {
		const book = await getBook(req.params.bookId, req.user.id);
		res.send(book);
	});

	//delete book
	app.delete("/api/books/:globalBookId/", async (req, res) => {
		//you should only be able to delete a user_book from your own bookshelf. user.id needs to be checked when this comes in
		const deletion = await deleteBook(req.params.globalBookId, req.user.id);

		await addActivity(req.user.id, req.params.globalBookId, 4);
		res.send(deletion);
	});

	//SOCIAL ASPECT ROUTES

	app.post("/api/friends", async (req, res) => {
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

	app.put("/api/friends", async (req, res) => {
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

	app.get("/api/friends", async (req, res) => {
		let connectingUser;
		if (!req.user) {
			connectingUser = 1;
		} else {
			connectingUser = req.user.id;
		}
		const response = await getFriendships(connectingUser);
		res.send(response);
	});

	app.get("/api/friends/:friendshipId", async (req, res) => {
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

	app.post("/api/activities", async (req, res) => {
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

	app.get("/api/activities", async (req, res) => {
		//should maybe return these separately so we render activities sooner
		try {
			const activities = await getActivities(req.user.id);
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
			
			const updatedActivities = activitiesWithLike.map(activity => {
				let likeContent = {
					color: 'lightgray',
					likedByUser: false,
					people: [],
					string: '',
					total: 0
				}
	
				if (activity.likes.length > 0) {
	
					if (activity.likes.some(like => like.liked_by === req.user.id)) {
						likeContent.color = 'royalblue'
						likeContent.likedByUser = true
						likeContent.people = ['You', ...activity.likes.map(like => like.full).filter(person => person !== req.user.full)]
				
					} else {
						likeContent.people = activity.likes.map(like => like.full).filter(person => person !== req.user.full)
					}
	
					likeContent.string = likeContent.people.join(', ')
					likeContent.total = likeContent.people.length
				}
	
				return {...activity, likeContent}
			})

			res.send(updatedActivities);
		} catch (error) {
			console.log(error);
			res.status(500).send(error);
		}
	});

	app.put("/api/activities", async (req, res) => {
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

	app.get("/api/activities/book/:globalId", async (req, res) => {
		const { globalId } = req.params;
		const activities = await getBookActivities(req.user.id, globalId)

		res.send(activities);
	});

	app.post("/api/interactions", async (req, res) => {
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

	app.get("/api/users/search/:term", async (req, res) => {
		const results = await searchUsers(req.params.term);
		res.send(results);
	});

	app.get("/api/users", async (req, res) => {
		const users = await getUsers()
		res.send(users)
	}) 
};
