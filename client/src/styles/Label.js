import React from "react";

const Input = (props) => {
  return (
    <label {...props} className="block text-gray-700 text-sm font-bold mb-2">
      {props.children}
    </label>
  );
};

export default Input;
