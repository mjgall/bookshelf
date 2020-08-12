const axios = require('axios');

const keys = require('../config/keys');

const getBooks = require('../queries/getBooks');
const addBook = require('../queries/addBook.js');
const getAnalytics = require('../queries/getAnalytics');
const updateBook = require('../queries/updateBook');
const addHouseholdInvitation = require('../queries/addHouseholdInvitation');
const getUserByEmail = require('../queries/getUserByEmail');
const getHouseholds = require('../queries/getHouseholds');
const getHouseholdInvitations = require('../queries/getHouseholdInvitations');
const acceptPendingHousehold = require('../queries/acceptPendingHousehold');
const getUserById = require('../queries/getUserById');
const addHousehold = require('../queries/addHousehold');
const getHouseholdMembersByUserId = require('../queries/getHouseholdMembersByUserId');
const declinePendingHousehold = require('../queries/declinePendingHousehold');
const deleteHousehold = require('../queries/deleteHousehold');
const removeHouseholdMember = require('../queries/removeHouseholdMember');
const getUserBooks = require('../queries/getUserBooks');
const getHouseholdBooks = require('../queries/getHouseholdBooks');
const getHouseholdNotes = require('../queries/getHouseholdNotes');
const updateUsersGlobalBooks = require('../queries/updateUsersGlobalBooks');
const getBook = require('../queries/getBook');
const deleteBook = require('../queries/deleteBook');
const updateHouseholdsBooks = require('../queries/updateHouseholdsBooks');
const sendEmail = require('../services/aws-ses');

module.exports = (app) => {
  //lookup book information by isbn10

  app.get('/api/bootstrap', async (req, res) => {
    if (!req.user) {
      res.send({
        currentUser: null,
        books: { userBooks: [], householdBooks: [] },
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
      const householdMembers = await getHouseholdMembersByUserId(req.user.id);

      res.send({
        currentUser,
        books: { userBooks, householdBooks },
        households,
        householdMembers,
      });
    }
  });

  app.get('/api/book/lookup/:isbn', async (req, res) => {
    const response = await axios.get(
      `https://api2.isbndb.com/book/${req.params.isbn}`,
      {
        headers: { Authorization: keys.ISBN_AUTH_API },
      }
    );

    res.send({ ...response.data.book });
  });

  //get information about the number of users and the number of books in total
  app.get('/api/data', async (req, res) => {
    const response = await getAnalytics();
    res.send(response);
  });

  app.get('/api/users/:id', async (req, res) => {
    const response = await getUserById(req.params.id);
    res.send(response.data);
  });

  //add a book
  app.post('/api/books', async (req, res) => {
    const { title, author, isbn10, isbn13, cover } = req.body;

    const userBookRow = await addBook({
      userId: req.user.id,
      title,
      author,
      isbn10,
      isbn13,
      cover,
    });

    //need to check if the user adding the book is a member of any households, if they are
    //we need to also add the book to households_books

    res.send(userBookRow);
  });

  //get a users books
  app.get('/api/books', async (req, res) => {
    if (req.user) {
      // const response = await getBooks(req.user.id);

      const userBooks = await getUserBooks(req.body.id);
      const householdBooks = await getHouseholdBooks(req.body.id);

      res.send({
        success: true,
        books: { user: userBooks, household: householdBooks },
      });
    } else {
      res.send({ success: false, books: [] });
    }
  });

  //update the information about a book
  app.put('/api/books', async (req, res) => {
    const book = { ...req.body };

    if (req.body.field === 'read') {
      if (book.bookType === 'personal') {
        const updatedBook = await updateBook(book.field, book.value, book.id);
        res.send(updatedBook);
      } else {
        const updatedBook = await updateUsersGlobalBooks(
          req.user.id,
          req.body.id,
          req.body.field,
          req.body.value
        );
        res.send(updatedBook);
      }
    } else if (req.body.field === 'notes') {
      if (book.bookType === 'personal') {
        const updatedBook = await updateBook(book.field, book.value, book.id);
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
      if (book.bookType === 'personal') {
        const updatedBook = await updateBook(book.field, book.value, book.id);
        res.send(updatedBook);
      } else {
        res.send(book);
      }
    }
  });

  //delete a household
  app.delete('/api/households/:householdId', async (req, res) => {
    const { householdId } = req.params;
    const householdDeleted = await deleteHousehold(householdId);
    res.send(householdDeleted);
  });

  //add a household
  app.post('/api/households', async (req, res) => {
    const { name, userId } = req.body;
    const newHousehold = await addHousehold(name, userId);
    res.send(newHousehold);
  });

  //get members of a household
  app.get('/api/user/households/members', async (req, res) => {
    const householdMembers = await getHouseholdMembersByUserId(req.user.id);
    res.send(householdMembers);
  });

  //get households that a user is a part of
  app.get('/api/households', async (req, res) => {
    const households = await getHouseholds(req.user.id);
    res.send(households);
  });

  //get household notes on any book by global id
  app.get('/api/notes/households/:globalBookId', async (req, res) => {
    try {
      const householdNotes = await getHouseholdNotes(
        req.params.globalBookId,
        req.user.id
      );
      console.log(householdNotes)
      res.send(householdNotes);
    } catch (error) {
      res.send({ error: true });
      throw Error(error);
    }
  });

  //send invitation
  app.post('/api/invitations', async (req, res) => {
    const correspondingUser = await getUserByEmail(req.body.invitedEmail);
    if (!correspondingUser) {
      res.send({ success: false, message: 'No user found with that email' });
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
  app.get('/api/invitations', async (req, res) => {
    const households = await getHouseholdInvitations(req.user.id);
    res.send(households);
  });

  //accept, decline, delete a membership
  app.put('/api/invitations', async (req, res) => {
    if (req.body.accept) {
      //update households_users to invite_accepted = true, should return the id of the user accepting (accepted.user_id)

      const accepted = await acceptPendingHousehold(req.body.id);

      res.send(accepted);
    } else if (req.body.decline) {
      const declined = await declinePendingHousehold(req.body.id);
      res.send(declined);
    } else if (req.body.remove) {
      const response = await removeHouseholdMember(
        req.body.householdId,
        req.body.userId
      );
      res.send(response);
    } else {
      res.status(400).send('No status');
    }
  });

  //update the households_books information (notes)
  app.post('/api/households/books', async (req, res) => {
    const updatedNotes = await updateHouseholdsBooks(
      req.body.householdId,
      req.body.globalBookId,
      req.body.field,
      req.body.value
    );
    res.send(updatedNotes);
  });

  //send an email
  //TODO put this somewhere else
  app.post('/api/email', async (req, res) => {
    const { recipientAddress, subject, body } = req.body;
    const email = await sendEmail(recipientAddress, subject, body);
    res.send({ success: true, email });
  });

  //get a users public books
  app.get('/api/shelves/:shelfId', async (req, res) => {
    const books = await getBooks(req.params.shelfId);
    res.send(books);
  });

  //get single book by globalId
  app.get('/api/book/:bookId', async (req, res) => {
    const book = await getBook(req.params.bookId, req.user.id);
    res.send(book);
  });

  //delete book
  app.delete('/api/books/:userBookId', async (req, res) => {
    const deletion = await deleteBook(req.params.userBookId);
    res.send(deletion);
  });
};
