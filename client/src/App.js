import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css';
import './styles/tailwind.css';
import './App.css';
import axios from 'axios';

import NavBar from './components/NavBar';
import Scanner from './components/Scanner';
import BookTable from './components/BookTable';

export default class App extends React.Component {
  state = { books: [], manualISBN: '', user: null, loaded: false };

  componentDidMount = async () => {
    const userResponse = await axios.get('/api/current_user');

    this.setState({
      user: userResponse.data,
      books: userResponse.data.books || [],
      loaded: true
    });
  };

  updateFunction = book => {
    this.setState({ books: [...this.state.books, book] });
  };

  render = () => {
    return (
      <>
        <NavBar user={this.state.user}></NavBar>
        <div className="w-5/6 container mx-auto my-4">
          {this.state.user && this.state.loaded ? (
            <>
              <Scanner
                className="max-w-screen-md container mx-auto"
                onChange={this.updateFunction}></Scanner>
              <BookTable books={this.state.books}></BookTable>
            </>
          ) : this.state.loaded && !this.state.user ? (
            <span className="text-3xl">Log in to start adding books!</span>
          ) : null}
        </div>
        <div className="w-full fixed bottom-0 p-2">&copy; MJG 2020</div>
      </>
    );
  };
}
