import React from 'react';

// import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css';
import './styles/tailwind.css';
import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './components/Home';
import Book from './components/Book';
import BookTable from './components/BookTable2';

export default class App extends React.Component {
  state = {
    books: [],
    manualISBN: '',
    user: null,
    loaded: false,
    scrollPosition: '0',
    windowWidth: null
  };
  updateFunction = book => {
    this.setState({ books: [...this.state.books, book] });
  };

  updateUser = user => {
    this.setState({ user });
  };

  componentDidMount = async () => {
    window.addEventListener('scroll', this.listenToScroll);
    window.addEventListener('resize', this.listenToResize);
    const userResponse = await axios.get('/api/current_user');
    const booksResponse = await axios.get('/api/books');
    this.setState({
      user: userResponse.data,
      books: booksResponse.data.books || [],
      loaded: true
    });
  };

  componentWillUnmount() {
    window.removeEventListener('scroll', this.listenToScroll);
    window.removeEventListener('resize', this.listenToResize);
  }

  listenToResize = e => {
    this.setState({ windowWidth: e.srcElement.innerWidth });
  };

  listenToScroll = () => {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const scrolled = winScroll / height;

    this.setState({
      scrollPosition: scrolled * 100
    });
  };

  render = () => {
    return (
      <>
        {this.state.loaded ? (
          <>
            <Router>
              <NavBar
                windowWidth={this.state.windowWidth}
                scrollPosition={this.state.scrollPosition}
                books={this.state?.books}
                user={this.state.user}></NavBar>
              <Switch>
                <Route exact path="/">
                  <Home
                    updateFunction={this.updateUser}
                    {...this.state}></Home>
                </Route>
                <Route
                  exact
                  path="/book/:id"
                  render={props => {
                    return (
                      <Book
                        updateGlobal={this.updateUser}
                        isbn10={props.match.params.id}
                        books={this.state?.books}></Book>
                    );
                  }}></Route>
                <Route
                  path="/table"
                  exact
                  render={props => {
                    return (
                      <BookTable
                        history={props.history}
                        books={this.state?.user?.books}></BookTable>
                    );
                  }}></Route>
              </Switch>
            </Router>
          </>
        ) : null}
      </>
    );
  };
}
