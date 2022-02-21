import React, { useContext, useEffect } from "react";
import Feed from "../components/Feed";
import Subnav from "../components/Subnav";
import MarketingHome from "./MarketingHome";

import { withRouter, Switch, Route, useRouteMatch } from "react-router-dom";

import { Context } from "../globalContext";
import Library from "../components/Library";
import Account from "./Account";
import Loans from "./Loans";
import Cancellation from "./Cancellation";
import Clubs from "./Clubs";
import Club from "./Club";

const Home = (props) => {
  const global = useContext(Context);
  const match = useRouteMatch();

  useEffect(() => {
    if (props.location.state?.redirect) {
      // addRedirect(props.location.state.from)
      global.setGlobal({
        redirect: props.location.state.from,
      });
    }

    if (global.currentUser?.id) {
      localStorage.setItem("existingUser", true);
    }
  }, [props, global]);

  return (
    <>
      {global.currentUser ? (
        <div className="w-full max-w-screen-xl mx-auto my-4">
          <div
            className="md:grid"
            style={{
              gridTemplateColumns: "10% 88%",
              gridColumnGap: "2%",
            }}
          >
            <div className="md:bg-transparent">
              <Subnav currentPage={match.url}></Subnav>
            </div>
            <div className="border-gray-400 border rounded py-3 px-3 shadow-lg md:mx-0 mx-2 bg-white">
              <Switch>
                <Route path="/library">
                  <Library></Library>
                </Route>
                <Route path="/feed">
                  <Feed></Feed>
                </Route>
                <Route path="/account">
                  <Account></Account>
                </Route>
                <Route path="/loans">
                  <Loans></Loans>
                </Route>
                <Route path="/clubs/:id">
                  <Club></Club>
                </Route>
                <Route path="/clubs">
                  <Clubs></Clubs>
                </Route>
                <Route path="/cancel">
                  <Cancellation></Cancellation>
                </Route>
                <Route path="/*">
                  <Library></Library>
                </Route>
              </Switch>
            </div>
          </div>
        </div>
      ) : (
        <MarketingHome redirect={global.redirect}></MarketingHome>
      )}
    </>
  );
};

export default withRouter(Home);
