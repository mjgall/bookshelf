import React from 'react';

// import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css';
import './styles/tailwind.css';
import './App.css';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  withRouter,
} from 'react-router-dom';

import NavBar from './components/NavBar';
import Home from './components/Home';
import Book from './components/Book';
import Profile from './components/Profile';

import SharedShelf from './pages/SharedShelf';
import PrivateRoute from './components/PrivateRoute';

import { userContext } from './userContext';

export default class App extends React.Component {
  state = {
    books: [],
    manualISBN: '',
    user: null,
    loaded: false,
    scrollPosition: '0',
    windowWidth: null,
  };

  updateBook = (field, value, id, household) => {
    let index;
    if (household) {
      index = this.state.books.findIndex(
        (existingBook) => existingBook.id == id
      );
    } else {
      index = this.state.books.findIndex(
        (existingBook) => existingBook.user_book_id == id
      );
    }

    const newBooks = [...this.state.books];
    const book = this.state.books[index];
    book[field] = value;
    newBooks.splice(index, 1, book);
    this.setState({ books: newBooks });
  };

  addBookToGlobalState = (book) => {
    this.setState({ books: [...this.state.books, book] });
  };

  updateUser = (user) => {
    this.setState({ user });
  };

  componentDidMount = async () => {
    // window.addEventListener('scroll', this.listenToScroll);
    // window.addEventListener('resize', this.listenToResize);

    const bootstrap = await axios.get('/api/bootstrap');
    const fresh = bootstrap.data;

    const books = fresh.books.userBooks.concat(fresh.books.householdBooks);

    this.setState({
      user: fresh.currentUser,
      books: books || [],
      householdMembers: fresh.householdMembers,
      households: fresh.households,
      loaded: true,
    });
  };

  componentWillUnmount() {
    window.removeEventListener('scroll', this.listenToScroll);
    window.removeEventListener('resize', this.listenToResize);
  }

  // listenToResize = (e) => {
  //   this.setState({ windowWidth: e.srcElement.innerWidth });
  // };

  // listenToScroll = () => {
  //   const winScroll =
  //     document.body.scrollTop || document.documentElement.scrollTop;

  //   const height =
  //     document.documentElement.scrollHeight -
  //     document.documentElement.clientHeight;

  //   const scrolled = winScroll / height;

  //   this.setState({
  //     scrollPosition: scrolled * 100,
  //   });
  // };

  updateNavReferrer = (referrer) => {
    this.setState({ referrer });
  };

  clearReferrer = () => {
    this.setState({ referrer: null });
  };

  render = () => {
    return (
      <>
        {this.state.loaded ? (
          <userContext.Provider value={this.state.user}>
            <Router>
              <NavBar
                referrer={this.state.referrer}
                windowWidth={this.state.windowWidth}
                scrollPosition={this.state.scrollPosition}
                books={this.state?.books}
                user={this.state.user}
                members={this.state.householdMembers}
                Profile></NavBar>
              <Switch>
                <Route exact path='/'>
                  <Home
                    households={this.state.households}
                    clearReferrer={this.clearReferrer}
                    updateNavReferrer={this.updateNavReferrer}
                    loaded={this.state.loaded}
                    user={this.state.user}
                    addBookToGlobalState={this.addBookToGlobalState}
                    books={this.state?.books}
                    members={this.state.householdMembers}></Home>
                </Route>
                <PrivateRoute path='/profile' user={this.state.user} exact>
                  <Profile
                    books={this.state.books}
                    members={this.state.householdMembers}
                    households={this.state.households}
                    user={this.state.user}></Profile>
                </PrivateRoute>
                <Route exact path='/book/:id'>
                  <Book
                    user={this.state.user}
                    globalBook={true}
                    updateBook={this.updateBook}
                    books={this.state?.books}></Book>
                </Route>
                <PrivateRoute
                  user={this.state.user}
                  exact
                  path='/book/owned/:userBookId'>
                  <Book
                    updateBook={this.updateBook}
                    books={this.state?.books}></Book>
                </PrivateRoute>
                <PrivateRoute
                  user={this.state.user}
                  exact
                  path='/book/household/:globalBookId'>
                  <Book
                    updateBook={this.updateBook}
                    books={this.state?.books}></Book>
                </PrivateRoute>
                <Route path='/shelf/:shelfId'>
                  <SharedShelf
                  members={this.state.householdMembers}
                  ></SharedShelf>
                </Route>
                <Route path='/shelf/:shelfId/book/IbookId'></Route>
                <Route path='/*'>
                  <Home
                    households={this.state.households}
                    clearReferrer={this.clearReferrer}
                    updateNavReferrer={this.updateNavReferrer}
                    loaded={this.state.loaded}
                    user={this.state.user}
                    addBookToGlobalState={this.addBookToGlobalState}
                    books={this.state?.books}
                    members={this.state.householdMembers}></Home>
                </Route>
              </Switch>
            </Router>
          </userContext.Provider>
        ) : null}
      </>
    );
  };
}
