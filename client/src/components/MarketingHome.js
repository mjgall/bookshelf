import React from 'react';
// import scanning from '../images/scanning.gif';
// import searching from '../images/searching.gif';
import banner3 from '../images/banner3.jpg';
import screenshot1 from '../images/screenshot1.png';
import screenshot2 from '../images/screenshot2.png';

export default class MarketingHome extends React.Component {
  render = () => {
    return (
      <div>
        <div
          className="h-32 lg:h-64 bg-cover bg-local bg-center shadow-inner"
          style={{
            backgroundImage: `url(${banner3})`,
            filter: 'grayscale(75%)'
          }}></div>
        <div className="w-5/6 container mx-auto my-4">
          <div className="md:my-4 p-4 grid grid-cols-2 md:border md:rounded md:shadow-sm">
            <img className=" shadow-lg" src={screenshot1}></img>
            <div className="text-3xl pl-10">Scan books</div>
          </div>
          <div className="md:my-4 p-4 grid grid-cols-2 md:border md:rounded md:shadow-sm">
            <div className="text-3xl pr-10">Search for books</div>
            <img className="shadow-lg" src={screenshot2}></img>
          </div>
        </div>
      </div>
    );
  };
}
