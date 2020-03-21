const axios = require('axios');

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
};
