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
import BookTable from './components/BookTable2';
import Profile from './components/Profile';
import MarketingHome from './components/MarketingHome';
import PrivateRoute from './components/PrivateRoute';

export default class App extends React.Component {
  state = {
    books: [],
    manualISBN: '',
    user: null,
    loaded: false,
    scrollPosition: '0',
    windowWidth: null,
  };

  updateBook = (book) => {
    const index = this.state.books.findIndex(
      (existingBook) => existingBook.id === book.id
    );
    const newBooks = [...this.state.books];
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
    window.addEventListener('scroll', this.listenToScroll);
    window.addEventListener('resize', this.listenToResize);

    const bootstrap = await axios.get('/api/bootstrap');
    const fresh = bootstrap.data;

    // const userResponse = await axios.get('/api/current_user');
    // const booksResponse = await axios.get('/api/books');
    // const householdMembers = await axios.get('/api/user/households/members');
    // const households = await axios.get('/api/households');

    this.setState({
      user: fresh.currentUser,
      books: fresh.books || [],
      householdMembers: fresh.householdMembers,
      households: fresh.households,
      loaded: true,
    });
  };

  componentWillUnmount() {
    window.removeEventListener('scroll', this.listenToScroll);
    window.removeEventListener('resize', this.listenToResize);
  }

  listenToResize = (e) => {
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
      scrollPosition: scrolled * 100,
    });
  };

  updateNavReferrer = (referrer) => {
    this.setState({ referrer });
  };

  render = () => {
    return (
      <>
        {this.state.loaded ? (
          <>
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
                <Route exact path="/">
                  <Home
                    updateNavReferrer={this.updateNavReferrer}
                    loaded={this.state.loaded}
                    user={this.state.user}
                    addBookToGlobalState={this.addBookToGlobalState}
                    books={this.state?.books}
                    members={this.state.householdMembers}></Home>
                </Route>
                <PrivateRoute path="/profile" user={this.state.user} exact>
                  <Profile
                    members={this.state.householdMembers}
                    households={this.state.households}
                    user={this.state.user}></Profile>
                </PrivateRoute>
                <PrivateRoute user={this.state.user} exact path="/book/:id">
                  <Book
                    updateBook={this.updateBook}
                    books={this.state?.books}></Book>
                </PrivateRoute>
                <PrivateRoute path="/protected" user={this.state.user}>
                  <Protected test={'hello'}></Protected>
                </PrivateRoute>
                <Route path="*">
                  <Home
                    updateNavReferrer={this.updateNavReferrer}
                    loaded={this.state.loaded}
                    user={this.state.user}
                    addBookToGlobalState={this.addBookToGlobalState}
                    books={this.state?.books}
                    members={this.state.householdMembers}></Home>
                </Route>
              </Switch>
            </Router>
          </>
        ) : null}
      </>
    );
  };
}

const Protected = (props) => <h3>{props.test}</h3>;
