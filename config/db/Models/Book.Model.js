const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  publisher: {
    type: String,
    required: false
  },
  language: {
    type: String,
    required: false
  },
  image: {
    type: String,
    required: false
  },
  title_long: {
    type: String,
    required: false
  },
  edition: {
    type: String,
    required: false
  },
  pages: {
    type: String,
    required: false
  },
  date_published: {
    type: String,
    required: false
  },
  authors: {
    type: Array,
    required: false
  },
  title: {
    type: String,
    required: false
  },
  isbn13: {
    type: String,
    required: false
  },
  msrp: {
    type: String,
    required: false
  },
  binding: {
    type: String,
    required: false
  },
  publish_date: {
    type: String,
    required: false
  },
  isbn: {
    type: String,
    required: false
  },
  read: {
    type: Boolean,
    required: false,
    default: false
  }
});

mongoose.model('Book', bookSchema);