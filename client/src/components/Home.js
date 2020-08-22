import React, { useContext, useEffect } from "react";
import Scanner from "./Scanner";
import BookTable from "./BookTable";
import MarketingHome from "./MarketingHome";
import { withRouter } from "react-router-dom";

import { Context } from "../globalContext";

const Home = (props) => {
  const global = useContext(Context);

  const addRedirect = toLocation => {

    global.setGlobal({ ...global, redirect: toLocation })
  }

  useEffect(() => {
    if (props.location.state?.redirect) {
      addRedirect(props.location.state.from)
    }
  }, []);

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
        <div className="max-w-screen-lg container my-4">
          <Scanner
            user={global.currentUser}
            className="max-w-screen-lg container mx-auto mt-5"
            addBookToGlobalState={addBookToGlobalState}
          ></Scanner>

          <BookTable
            books={global.books.userBooks.concat(global.books.householdBooks)}
          ></BookTable>
        </div>
      ) : (
          <MarketingHome redirect={global.redirect}></MarketingHome>
        )}
    </>
  );
};

export default withRouter(Home);
