const axios = require('axios');
const getBooks = require('../queries/getBooks');
const addBook = require('../queries/addBook.js');
const getAnalytics = require('../queries/getAnalytics');
const updateBook = require('../queries/updateBook');

module.exports = app => {
  //lookup book information by isbn10
  app.get('/api/book/lookup/:isbn', async (req, res) => {
    const response = await axios.get(
      `https://api2.isbndb.com/book/${req.params.isbn}`,
      {
        headers: { Authorization: '43911_8b18bf16825dc5f4f5c3bfe3b0cea146' }
      }
    );

    res.send({ ...response.data.book });
  });

  //get information about the number of users and the number of books in total
  app.get('/api/data', async (req, res) => {
    const response = await getAnalytics();
    res.send(response);
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
      cover
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
    if (!book.id || !book.title || !book.author || !book.notes || !book.read) {
      res.send({ success: false, message: 'Missing fields' });
    } else {
      const response = await updateBook(book);
      res.send({ success: true, book: response });
    }
  });
};
