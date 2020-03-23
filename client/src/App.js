import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css';
import './styles/tailwind.css';
import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import NavBar from './components/NavBar';

import Home from './components/Home';
import Book from './components/Book';

export default class App extends React.Component {
  state = {
    books: [],
    manualISBN: '',
    user: null,
    loaded: false,
    scrollPosition: '0'
  };
  updateFunction = book => {
    this.setState({ books: [...this.state.books, book] });
  };

  componentDidMount = async () => {
    window.addEventListener('scroll', this.listenToScroll);
    const userResponse = await axios.get('/api/current_user');

    this.setState({
      user: userResponse.data,
      books: userResponse.data.books || [],
      loaded: true
    });
  };

  componentWillUnmount() {
    window.removeEventListener('scroll', this.listenToScroll);
  }

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
                scrollPosition={this.state.scrollPosition}
                books={this.state?.user?.books}
                user={this.state.user}></NavBar>
              <Switch>
                <Route exact path="/">
                  <Home
                    updateFunction={this.updateFunction}
                    {...this.state}></Home>
                </Route>
                <Route
                  exact
                  path="/book/:id"
                  render={props => {
                    return (
                      <Book
                        isbn={props.match.params.id}
                        books={this.state?.user?.books}></Book>
                    );
                  }}></Route>
              </Switch>
            </Router>
            <div className="w-full fixed bottom-0 p-2">&copy; MJG 2020</div>
          </>
        ) : null}
      </>
    );
  };
}
