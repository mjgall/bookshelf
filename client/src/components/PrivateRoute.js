import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';

const PrivateRoute = (props) => {
  if (props.children.length) {
    throw Error('PrivateRoute must receive only on child component');
  } else {
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
            to={{
              pathname: '/',
              state: { referrer: window.location.pathname },
            }}
          />
        )}
      </>
    );
  }
};

export default withRouter(PrivateRoute);
