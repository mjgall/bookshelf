import React, { useState } from 'react';
import ReactModal from 'react-modal';

const Modal = ({ isShowing, hide, confirmAction, header, children }) => {
  return (
    <ReactModal
      onRequestClose={hide}
      style={{ content: { outline: 'none' } }}
      className='custom-modal bg-white w-11/12 h-full mx-auto rounded shadow-lg z-50 overflow-y-auto'
      shouldCloseOnEsc
      shouldCloseOnOverlayClick
      isOpen={isShowing}>
      <div className='modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50'>
        <svg
          className='fill-current text-white'
          xmlns='http://www.w3.org/2000/svg'
          width='18'
          height='18'
          viewBox='0 0 18 18'>
          <path d='M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z'></path>
        </svg>
        <span className='text-sm'>(Esc)</span>
      </div>

      <div className='modal-content py-4 text-left px-6'>
        <div className='flex justify-between items-center pb-3'>
          {header ? (
            <p className='text-2xl font-bold'>{header}</p>
          ) : (
            <div></div>
          )}

          <div onClick={hide} className='cursor-pointer z-50'>
            <svg
              className='fill-current text-black'
              xmlns='http://www.w3.org/2000/svg'
              width='18'
              height='18'
              viewBox='0 0 18 18'>
              <path d='M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z'></path>
            </svg>
          </div>
        </div>

        {children}

        <div className='flex justify-end pt-2'>
          <button
            onClick={hide}
            className='bg-transparent py-1 px-4 rounded hover:bg-gray-100  mr-2'>
            Close
          </button>
          <button
            onClick={() => {
              confirmAction();
              hide();
            }}
            className='bg-royalblue hover:bg-blue-700 py-1 px-4 rounded text-white'>
            Confirm
          </button>
        </div>
      </div>
    </ReactModal>
  );
};

const useModal = () => {
  const [isShowing, setIsShowing] = useState(false);

  function toggle() {
    setIsShowing(!isShowing);
  }

  return {
    isShowing,
    toggle,
  };
};

export { useModal, Modal };
