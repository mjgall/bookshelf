const axios = require('axios');
const mongoose = require('mongoose');
const Book = mongoose.model('Book');
const User = mongoose.model('User');

module.exports = app => {
  app.get('/api/book/lookup/:isbn', async (req, res) => {
    const response = await axios.get(
      `https://api2.isbndb.com/book/${req.params.isbn}`,
      {
        headers: { Authorization: '43911_8b18bf16825dc5f4f5c3bfe3b0cea146' }
      }
    );

    res.send({ ...response.data.book });
  });

  app.post('/api/books/', async (req, res) => {
    User.findOne({ googleId: req.user.googleId }, (err, User) => {
      if (err) {
        res.send({ error: true, success: false });
      }
      if (User) {
        if (
          User.books.find(book => {
            if (book.isbn === req.body.isbn) return true;
          })
        ) {
          res.send('Already exists');
        } else {
          User.books = [...User.books, req.body];
          User.save(err => {
            if (err) {
              res.send({ err });
            } else {
              res.send({ success: true, books: User.books });
            }
          });
        }
      }
    });
  });
};
