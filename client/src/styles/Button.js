import React from 'react';

const Button = props => {
  return (
    <button
      {...props}
      className={
        'bg-blue-500 hover:bg-blue-700 text-white font-bold my-2 mx-1 py-2 px-4 rounded focus:outline-none focus:shadow-outline' +
        props.className
      }
      type="button">
      {props.children}
    </button>
  );
};

export default Button;
