import React, { useContext, useEffect } from "react";
import Scanner from "../components/Scanner";
import BookTable from "../components/BookTable";
import Feed from "../components/Feed"
import Subnav from "../components/Subnav"
import MarketingHome from "./MarketingHome";
import Cancellation from "./Cancellation"
import moment from "moment";
import {
  withRouter, BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";

import { Context } from "../globalContext";

const Home = (props) => {
  const global = useContext(Context);

  const addRedirect = toLocation => {

  }

  useEffect(() => {
    if (props.location.state?.redirect) {
      // addRedirect(props.location.state.from)
      global.setGlobal({ ...global, redirect: props.location.state.from })
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

  let match = useRouteMatch();

  return (
    <>
      {global.currentUser ? (
        <div className="md:container my-4">
          <div className="md:grid" style={{ gridTemplateColumns: '10% 88%', gridColumnGap: '2%' }}>
            <div className="top-stickyMobile sticky md:bg-transparent bg-white z-50">
            <Subnav currentPage={match.url}></Subnav>
            </div>
            <Switch>
              <Route path="/library">
                <div>
                  <div className='text-2xl font-bold'>Your Library</div>
                  <Scanner
                    user={global.currentUser}
                    addBookToGlobalState={addBookToGlobalState}
                  ></Scanner>
                  <BookTable books={global.books.userBooks.concat(global.books.householdBooks)}>
                  </BookTable>
                </div>
              </Route>
              <Route path="/feed">
                <Feed></Feed>
              </Route>
              <Route path="/account">
                <div>
                  <div className='text-2xl font-bold'>Account</div>
                  <div>Joined {moment(global.currentUser.create_date).format("MMMM Do YYYY - h:mm a")}</div>
                  <Cancellation></Cancellation>
                </div>
              </Route>
              <Route path="/*">
                <Feed></Feed>
              </Route>
            </Switch>
          </div>

        </div>
      ) : (
          <MarketingHome redirect={global.redirect}></MarketingHome>
        )}
    </>
  );
};

export default withRouter(Home);
