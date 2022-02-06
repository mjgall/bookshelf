import React, { useContext } from "react";
import { Context } from "../globalContext";
import { Redirect, Route } from "react-router-dom";

//TODO redo the redirect logic when a private route is hit by a not logged in user
const PrivateRoute = (props) => {
  const global = useContext(Context);

  if (props.children.length) {
    throw Error("PrivateRoute must receive only on child component");
  } else {
    return (
      <>
        {global.currentUser ? (
          <Route path={props.path} exact={props.exact}>
            {React.createElement(() => {
              return {
                ...props.children,
                props: { ...props.children.props, ...props },
              };
            })}
          </Route>
        ) : (
          <Redirect
            to={{
              pathname: `/?redirect=${window.location.pathname}`,
              state: { redirect: true, from: window.location.pathname },
            }}
          />
        )}
      </>
    );
  }
};

export default PrivateRoute;
