import React, { useContext } from 'react';
import { Context } from '../globalContext';
import { Redirect, withRouter } from 'react-router-dom';

const PrivateRoute = (props) => {
  const global = useContext(Context);

  if (props.children.length) {
    throw Error('PrivateRoute must receive only on child component');
  } else {
    return (
      <>
        {global.currentUser ? (
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
