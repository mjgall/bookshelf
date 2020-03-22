import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css';
import './styles/tailwind.css';
import './App.css';
import axios from 'axios';

import Scanner from './components/Scanner';
import BookTable from './components/BookTable';

export default class App extends React.Component {
  state = { books: [], manualISBN: '', user: null };

  componentDidMount = async () => {
    const userResponse = await axios.get('/api/current_user');

    this.setState({
      user: userResponse.data,
      books: userResponse.data.books || []
    });
  };

  updateFunction = book => {
    this.setState({ books: [...this.state.books, book] });
  };

  render = () => {
    return (
      <>
        <nav class="flex items-center justify-between flex-wrap bg-blue-500 py-2 px-8">
          <div class="flex items-center flex-shrink-0 text-white mr-6">
            <svg width="150" height="100" viewBox="0 0 50 100">
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
            </svg>
            <span class="font-semibold text-xl tracking-tight">Bookshelf</span>
          </div>
          <div class="block lg:hidden">
            <button class="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
              <svg
                class="fill-current h-3 w-3"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <title>Menu</title>
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
              </svg>
            </button>
          </div>
          <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
            <div class="text-sm lg:flex-grow">
              <span class="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-white mr-4">
                {this.state?.user?.full}
              </span>
            </div>
            <div>
              {!this.state.user ? (
                <a
                  href="/auth/google"
                  class="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">
                  Login
                </a>
              ) : (
                <a
                  href="/api/logout"
                  class="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">
                  Logout
                </a>
              )}
            </div>
          </div>
        </nav>
        <div className="w-5/6 container mx-auto my-4">
          {this.state.user ? (
            <>
              <Scanner
                className="max-w-screen-md container mx-auto"
                onChange={this.updateFunction}></Scanner>
              <BookTable books={this.state.books}></BookTable>
            </>
          ) : (
            <span className="text-3xl">Log in to start adding books!</span>
          )}
        </div>
      </>
    );
  };
}
