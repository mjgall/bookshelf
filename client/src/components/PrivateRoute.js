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
              pathname: `/?redirect=${window.location.pathname}`,
              state: { redirect: true },
            }}
          />
        )}
      </>
    );
  }
};

export default withRouter(PrivateRoute);
