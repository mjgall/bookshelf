import React from 'react';

const booksContext = React.createContext({ books: [] }); // Create a context object

export {
  booksContext,
   // Export it so it can be used by other Components
};
