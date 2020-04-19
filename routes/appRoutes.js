const axios = require('axios');
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

const sendEmail = require('../services/aws-ses');

module.exports = (app) => {
  //lookup book information by isbn10

  app.get('/api/bootstrap', async (req, res) => {
    if (!req.user) {
      res.send(null);
    } else {
      const currentUser = req.user;
      const books = await getBooks(req.user.id);
      const households = await getHouseholds(req.user.id);
      const householdMembers = await getHouseholdMembersByUserId(req.user.id);

      res.send({ currentUser, books, households, householdMembers });
    }
  });

  app.get('/api/book/lookup/:isbn', async (req, res) => {
    const response = await axios.get(
      `https://api2.isbndb.com/book/${req.params.isbn}`,
      {
        headers: { Authorization: '43911_8b18bf16825dc5f4f5c3bfe3b0cea146' },
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

    const response = await addBook({
      userId: req.user.id,
      title,
      author,
      isbn10,
      isbn13,
      cover,
    });
    res.send(response);
  });

  //get a users books
  app.get('/api/books', async (req, res) => {
    if (req.user) {
      const response = await getBooks(req.user.id);
      res.send({ success: true, books: response });
    } else {
      res.send({ success: false, books: [] });
    }
  });

  //update the information about a book
  app.put('/api/books', async (req, res) => {
    const book = { ...req.body };
    console.log(book);
    if (!book.id || !book.title || !book.author) {
      res.send({ success: false, message: 'Missing fields' });
    } else {
      const response = await updateBook(book);
      res.send({ success: true, book: response });
    }
  });

  app.delete('/api/households/:householdId', async (req, res) => {
    const { householdId } = req.params;
    const householdDeleted = await deleteHousehold(householdId);
    res.send(householdDeleted);
  });

  app.post('/api/households', async (req, res) => {
    const { name, userId } = req.body;
    const newHousehold = await addHousehold(name, userId);
    //sends new households_user data
    res.send(newHousehold);
  });

  app.get('/api/user/households/members', async (req, res) => {
    const householdMembers = await getHouseholdMembersByUserId(req.user.id);
    res.send(householdMembers);
  });

  app.get('/api/households', async (req, res) => {
    const households = await getHouseholds(req.user.id);
    res.send(households);
  });

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
      res.send({ ...household, invited_email: correspondingUser.email, invited_photo: correspondingUser.picture });
    }
  });

  app.get('/api/invitations', async (req, res) => {
    const households = await getHouseholdInvitations(req.user.id);
    res.send(households);
  });

  app.put('/api/invitations', async (req, res) => {
    if (req.body.accept) {
      const accepted = await acceptPendingHousehold(req.body.id);
      res.send(accepted);
    } else if (req.body.decline) {
      const declined = await declinePendingHousehold(req.body.id);
      res.send(declined);
    }
  });

  app.post('/api/email', async (req, res) => {
    const { recipientAddress, subject, body } = req.body;
    const email = await sendEmail(recipientAddress, subject, body);
    res.send({ success: true, email });
  });
};
