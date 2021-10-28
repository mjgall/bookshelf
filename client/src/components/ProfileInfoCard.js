import React, { useContext } from 'react';
import Copy from '../common/Copy';
import Tip from '../common/Tip';
import { Context } from '../globalContext';


const ProfileInfoCard = (props) => {
  const global = useContext(Context);
  return (
    <div>
      <div className='rounded-lg overflow-hidden shadow w-5/6 mx-auto md:mx-0 md:w-64 md:max-w-md my-3'>
        <div className='h-24 w-full bg-newblue'></div>
        <div className='flex justify-center -mt-16'>
          <img
            alt='user'
            src={global.currentUser.picture}
            className='rounded-full h-32 w-32 border-solid border-white border-2 -mt-3'></img>
        </div>
        <div className='text-center px-3 pb-6 pt-2'>
          <h3 className='text-black text-lg bold font-sans'>
            {global.currentUser.full}
          </h3>
          <p className='mt-1 text-sm font-sans font-light text-grey-dark'>
            {global.currentUser.email}
          </p>
        </div>
        <div className='flex justify-center pb-3 text-grey-dark'>
          <div className='text-center mr-3 border-r pr-3'>
            <h2>
              {
                global.books.userBooks.filter(
                  (book) => book.user_id === global.currentUser.id
                ).length
              }
            </h2>
            <span>Books saved</span>
          </div>
          <div className='text-center'>
            <h2>{global.allBooks.filter((book) => book.read).length}</h2>
            <span>Books read</span>
          </div>
        </div>
        <div className='mb-3'>
          <div className='flex items-center justify-center'>
            <span>Your public shelf link:</span>
            <Tip
              placement='top'
              className='ml-2'
              size='1rem'
              content='Any books marked as "Public" are visible for users and non-users of Bookshelf at this page.'></Tip>
          </div>
          <Copy
            placement='top'
            value={`${window.location.protocol}//${window.location.host}/shelf/${global.currentUser.shelf_id}`}></Copy>
        </div>
      </div>
    </div>
  );
};
export default ProfileInfoCard;
