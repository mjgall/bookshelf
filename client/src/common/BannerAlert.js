import React from 'react';

const BannerAlert = (props) => {
  return (
    <div
      className='w-5/6 md:w-full container bg-red-100 border border-red-600 text-red-700 px-4 py-3 rounded relative'
      role='alert'>
      <span className='block sm:inline'>{this.state.alertMessage}</span>
    </div>
  );
};

export default BannerAlert;
