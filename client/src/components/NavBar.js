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
      <nav className="flex items-center justify-between flex-wrap bg-blue-500 px-8 py-3 sticky top-0">
        <div className="flex">
          <div
            className="flex items-center flex-shrink-0 text-white mr-6 cursor-pointer"
            onClick={this.goHome}>
            <img className="mr-4" src={logo} style={{ width: this.calcLogoSize() }}></img>
            {/* <svg
            width={this.props.scrollPosition > 0 || this.props.location.pathname.indexOf('/book/') >= 0 ? '75' : '150'}
            height={this.props.scrollPosition > 0 || this.props.location.pathname.indexOf('/book/') >= 0 ? '50' : '100'}
            viewBox="0 0 50 100">
            <g fill="#e4ceb2">
              <g xmlns="http://www.w3.org/2000/svg">
                <g>
                  <path d="M32.458,48.731c-1.78-0.538-3.291-1.305-4.506-2.287V79.9c1.157,1.094,2.671,1.938,4.506,2.522V48.731z"></path>
                  <path d="M24.98,84.014v2.163c1.029,7.89,10.092,8.733,12.17,8.823v-4.682C35.262,90.234,27.665,89.544,24.98,84.014z"></path>
                  <path d="M24.98,36.424v44.602c0.99,7.492,10.09,8.343,12.169,8.438V42.726C35.263,42.641,27.665,41.952,24.98,36.424z     M27.094,44.466l0.729,0.717c1.279,1.258,3.022,2.205,5.179,2.815l0.312,0.088v35.48l-0.544-0.152    c-2.295-0.643-4.161-1.661-5.549-3.025l-0.128-0.127L27.094,44.466L27.094,44.466z"></path>
                  <polygon points="68.691,27.391 43.909,42.404 43.909,81.457 68.691,66.441   "></polygon>
                  <path d="M71.584,15.919l-9.162-6.426V5L24.98,27.684v5.752c0.992,7.509,10.092,8.346,12.169,8.435v-5.36    c-1.815-0.08-8.927-0.738-11.404-6.131L60.357,9.403l10.188,7.145L38.007,36.262v58.49L75.02,72.326V13.837L71.584,15.919z     M69.549,66.924L43.051,82.979V41.921L69.549,25.87V66.924z"></path>
                </g>
              </g>
            </g>
          </svg> */}
            <span className="font-semibold text-lg tracking-tight">
              Bookshelf
            </span>
          </div>

          <div className="w-full block flex-grow flex-auto lg:flex lg:items-center lg:w-auto">
            {/* <div className="text-sm lg:flex-grow">
              <span className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-white mr-4">
                {this.props.user
                  ? `${this.props?.user?.full} has ${this.props.books.length} books!`
                  : null}
              </span>
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
          </div>
        </div>
      </nav>
    );
  };
}

export default withRouter(NavBar);
