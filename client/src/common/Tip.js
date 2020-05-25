import React from 'react';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { HelpCircle } from '@styled-icons/boxicons-solid';

const Tip = ({ children, content, size, renderChildren, className }) => {
  return (
    <Tippy content={<span>{content}</span>}>
      {renderChildren ? (
        { ...children }
      ) : (
        <HelpCircle className={className} size={size}></HelpCircle>
      )}
    </Tippy>
  );
};

export default Tip;
