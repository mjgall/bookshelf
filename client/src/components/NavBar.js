import React from 'react';
import { withRouter } from 'react-router-dom';
import logo from '../images/logo.png';

class NavBar extends React.Component {
  goHome = () => {
    this.props.history.push('');
  };
  calcLogoSize = () => {
    if (this.props.windowWidth < 1025 || this.props.scrollPosition > 0) {
      return '1.5rem';
    } else {
      return '3rem';
    }
  };

  render = () => {
    return (
      <nav className="flex items-center justify-between flex-wrap bg-blue-500 px-8 py-1 md:py-3 sticky top-0">
        <div className="flex items-center">
          <div
            className="flex items-center flex-shrink-0 text-white mr-6 cursor-pointer"
            onClick={this.goHome}>
            <img
              className="mr-4"
              src={logo}
              style={{ width: this.calcLogoSize() }}></img>
            <span className="font-semibold text-lg tracking-tight">
              Bookshelf
            </span>
          </div>
          <span className="hidden md:inline-block text-sm  text-white hover:text-white">
            {this.props.user
              ? `${this.props?.user?.full} has ${this.props.books.length} books!`
              : null}
          </span>
        </div>

        {/* <div className="text-sm lg:flex-grow">
              
            </div> */}

        <div>
          {!this.props.user ? (
            <a
              href="/auth/google"
              className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white lg:mt-0">
              Login 📚
            </a>
          ) : (
            <a
              href="/api/logout"
              className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white lg:mt-0">
              Logout
            </a>
          )}
        </div>
      </nav>
    );
  };
}

export default withRouter(NavBar);
