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
const addUserBooksToHousehold = require('../queries/addUserBooksToHousehold');
const removeHouseholdMember = require('../queries/removeHouseholdMember');
const getUserBooks = require('../queries/getUserBooks');
const getHouseholdBooks = require('../queries/getHouseholdBooks');
const updateNotes = require('../queries/updateNotes');
const getHouseholdNotes = require('../queries/getHouseholdNotes');
const addBookToHouseholdsBooks = require('../queries/addBookToHouseholdsBooks');
const updateUserGlobalBooks = require('../queries/updateUsersGlobalBooks');
const markHouseholdBookAsRead = require('../queries/markHouseholdBookAsRead');
const addPersonalNotesToHouseholdBook = require('../queries/addPersonalNotesToHouseholdBook');
const updateHouseholdBookAsRead = require('../queries/updateHouseholdBookAsRead');
const updatePersonalNotesOnHouseholdBook = require('../queries/updatePersonalNotesOnHouseholdBook');
const getBook = require('../queries/getBook');

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

    const households = await getHouseholds(req.user.id);
    if (households.length > 0) {
      const response = await addBookToHouseholdsBooks(
        req.user.id,
        userBookRow.global_id
      );
    }

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
        const updatedBook = await updateBook(
          book.field,
          book.value,
          book.userBookId
        );
        res.send(updatedBook);
      } else {
        //update the read column in users_globalbooks
      }
    } else if (req.body.field === 'notes') {
      if (book.bookType === 'personal') {
        const updatedBook = await updateNotes(
          book.field,
          book.value,
          book.bookType,
          null,
          book.userBookId
        );
        res.send(updatedBook);
      } else {
        const updatedBook = await updateNotes(
          book.field,
          book.value,
          book.bookType,
          book.householdsBooksId
        );
        res.send(updatedBook);
      }
    } else {
      if (book.bookType === 'personal') {
        const updatedBook = await updateBook(book.field, book.value, book.id);
        res.send(updatedBook);
      } else {
        console.log(book);
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

    const booksAdded = await addUserBooksToHousehold(
      userId,
      newHousehold.household_id
    );

    //sends new households_user data
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

  app.get('/api/notes/households/:globalBookId/:userId', async (req, res) => {
    try {
      const householdNotes = await getHouseholdNotes(
        req.params.globalBookId,
        req.params.userId,
        req.user.id
      );
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

  app.get('/api/invitations', async (req, res) => {
    const households = await getHouseholdInvitations(req.user.id);
    res.send(households);
  });

  // app.post('/api/invitations', async (req, res) => {

  // })

  //accept, decline, delete a membership
  app.put('/api/invitations', async (req, res) => {
    if (req.body.accept) {
      //update households_users to invite_accepted = true, should return the id of the user accepting (accepted.user_id)

      const accepted = await acceptPendingHousehold(req.body.id);

      //add all of the users' books to the households_books table
      const booksAdded = await addUserBooksToHousehold(
        accepted.user_id,
        accepted.household_id
      );

      res.send(booksAdded);
    } else if (req.body.decline) {
      const declined = await declinePendingHousehold(req.body.id);
      res.send(declined);
    } else if (req.body.remove) {
      console.log(req.body);
      const response = await removeHouseholdMember(
        req.body.householdId,
        req.body.userId
      );
      res.send(response);
    } else {
      res.status(400).send('No status');
    }
  });

  app.post('/api/households/books', async (req, res) => {
    console.log(req.body);
    if (req.body.action === 'read') {
      if (req.body.usersGlobalBooksId) {
        const updatedHouseholdBookAsRead = await updateHouseholdBookAsRead(
          req.body.usersGlobalBooksId
        );
        res.send(updatedHouseholdBookAsRead);
      } else {
        const householdAsRead = await markHouseholdBookAsRead(
          req.user.id,
          req.body.bookId
        );
        console.log(householdAsRead);
        res.send(householdAsRead);
      }
    } else {
      if (req.body.usersGlobalBooksId) {
        const updatedNotes = await updatePersonalNotesOnHouseholdBook(
          req.body.usersGlobalBooksId,
          req.body.notes
        );
        res.send(updatedNotes);
      } else {
        const addNotes = await addPersonalNotesToHouseholdBook(
          req.user.id,
          req.body.bookId,
          req.body.notes
        );
        console.log(addNotes);
        res.send(addNotes);
      }
    }
  });

  app.post('/api/email', async (req, res) => {
    const { recipientAddress, subject, body } = req.body;
    const email = await sendEmail(recipientAddress, subject, body);
    res.send({ success: true, email });
  });

  app.get('/api/shelves/:shelfId', async (req, res) => {
    const books = await getBooks(req.params.shelfId);
    res.send(books);
  });

  app.get('/api/book/:bookId', async (req, res) => {
    const book = await getBook(req.params.bookId, req.user.id);

    res.send(book);
  });
};
