const mongoose = require('mongoose');
const userSchema = require('./Models/User.Model');
const keys = require('../keys');
mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('MongoDB connected');
});

module.exports = db;
