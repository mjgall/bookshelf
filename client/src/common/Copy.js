import React, { useRef, useState } from 'react';
import { Copy as CopyIcon, CheckCircle } from '@styled-icons/boxicons-solid';

const Copy = (props) => {
  const [copySuccess, setCopySuccess] = useState('');
  const textAreaRef = useRef(null);

  function copyToClipboard(e) {
    textAreaRef.current.select();
    document.execCommand('copy');
    // This is just personal preference.
    // I prefer to not show the the whole text area selected.
    e.target.focus();
    setCopySuccess('Copied!');
    setTimeout(() => setCopySuccess(''), 750);
  }

  return (
    <div className='flex justify-center text-sm items-center'>
      <input
        onClick={() => textAreaRef.current.select()}
        readOnly
        className='w-9/12 px-3 py-1 rounded-sm border border-gray-400 mr-3'
        ref={textAreaRef}
        value={props.value}
      />
      {copySuccess ? (
        <CheckCircle size='1.5em' color='green'></CheckCircle>
      ) : (
        <CopyIcon
          className='cursor-pointer'
          size='1.5em'
          onClick={copyToClipboard}></CopyIcon>
      )}
    </div>
  );
};

export default Copy;
