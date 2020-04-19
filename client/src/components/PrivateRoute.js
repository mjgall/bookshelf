import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';

const PrivateRoute = (props) => {
  console.log(props.children);

  return (
    <>
      {props.user ? (
        // props.load
        React.createElement(() => {
          return {
            ...props.children,
            props: { ...props.children.props, ...props },
          };
        })
      ) : (
        <Redirect
          to={{ pathname: '/', state: { referrer: window.location.pathname } }}
        />
      )}
    </>
  );
};

export default withRouter(PrivateRoute);
