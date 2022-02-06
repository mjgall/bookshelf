import React, { useState } from "react";

import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";

//This needs: tipContent - hover text, onConfirm - the function that should be called when the user confirms, position - where the actions popout should go, 1 child - what should be rendered as the visible item

const Confirm = ({ tipContent, onConfirm, position, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <Tooltip arrow position="right" title={tipContent} disabled={visible}>
      <Tooltip
        theme="clear"
        interactive
        delay={[0, 0]}
        position={position}
        animation="none"
        duration={0}
        trigger="click"
        open={visible}
        html={
          <div className="flex px-4 py-2 justify-between text-sm ml-3">
            <div
              className="w-full shadow-lg bg-green-600 text-white py-1 px-2 rounded text-center mr-4 cursor-pointer"
              onClick={() => {
                onConfirm();
                setVisible(!visible);
              }}
            >
              Confirm
            </div>
            <div
              className="w-full shadow-lg bg-red-600 text-white py-1 px-2 rounded text-center cursor-pointer"
              onClick={() => setVisible(!visible)}
            >
              Cancel
            </div>
          </div>
        }
      ></Tooltip>

      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          ...child.props,
          className: `${child.props.className} cursor-pointer`,

          onClick: () => setVisible(!visible),
        })
      )}
    </Tooltip>
  );
};

export default Confirm;
