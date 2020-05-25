import React, { useState, useEffect } from 'react';
import Tip from '../common/Tip';
import Tippy from '@tippyjs/react';
import { XSquare } from '@styled-icons/boxicons-solid';

const Confirm = ({ tipContent, onConfirm }) => {
  return (
    <Tip renderChildren content={props.tipContent}>
      <Tippy
        interactive={true}
        placement='left'
        visible={props.visible}
        onClickOutside={props.toggleVisibility}
        render={(attrs) => {
          return (
            <div className='flex border border-gray-200 shadow-md rounded-sm px-4 py-2 justify-between bg-white text-sm'>
              <div
                className='w-full shadow-inner bg-green-500 text-white py-1 px-2 rounded text-center mr-4 cursor-pointer'
                onClick={props.onConfirm}>
                Delete
              </div>
              <div
                className='w-full shadow-inner bg-red-500 text-white py-1 px-2 rounded text-center cursor-pointer'
                onClick={props.toggleVisibility}>
                Cancel
              </div>
            </div>
          );
        }}>
        <XSquare
          onClick={props.toggleVisibility}
          color='red'
          size='2rem'
          className='cursor-pointer'></XSquare>
      </Tippy>
    </Tip>
  );
};

export default Confirm;
