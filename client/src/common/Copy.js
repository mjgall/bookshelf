import React, { useRef, useState } from 'react';
import { Copy as CopyIcon, CheckCircle } from '@styled-icons/boxicons-solid';
import Tip from './Tip';

const Copy = (props) => {
  const [copySuccess, setCopySuccess] = useState('');
  const textAreaRef = useRef(null);

  const copyToClipboard = (e) => {
    textAreaRef.current.select();
    document.execCommand('copy');
    e.target.focus();
    setCopySuccess('Copied!');
    setTimeout(() => setCopySuccess(''), 750);
  };

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
        <Tip placement={props.placement} renderChildren content='Copied!'>
          <CheckCircle size='1.5em' color='green'></CheckCircle>
        </Tip>
      ) : (
        <Tip placement={props.placement} renderChildren content='Click to copy'>
          <CopyIcon
            className='cursor-pointer'
            size='1.5em'
            onClick={copyToClipboard}></CopyIcon>
        </Tip>
      )}
    </div>
  );
};

export default Copy;
