import React, { useContext } from 'react';
import Scanner from './Scanner';
import BookTable from './BookTable';
import MarketingHome from './MarketingHome';
import { withRouter } from 'react-router-dom';

import { Context } from '../globalContext';

const Home = (props) => {
  const global = useContext(Context);

  const addBookToGlobalState = (book) => {
    global.setGlobal({
      ...global,
      books: {
        ...global.books,
        userBooks: { ...global.books.userBooks, book },
      },
    });
  };

  return (
    <>
      {global.currentUser ? (
        <div className='max-w-screen-lg container my-4'>
          <Scanner
            user={global.currentUser}
            className='max-w-screen-lg container mx-auto mt-5'
            addBookToGlobalState={addBookToGlobalState}></Scanner>

          <BookTable
            books={global.books.userBooks.concat(
              global.books.householdBooks
            )}></BookTable>
        </div>
      ) : (
        <MarketingHome></MarketingHome>
      )}
    </>
  );
};

export default withRouter(Home);
