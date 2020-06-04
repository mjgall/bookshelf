import React, { useContext, useState } from 'react';

// import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css';
import './styles/tailwind.css';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import NavBar from './components/NavBar';
import Home from './components/Home';
import Book from './components/Book';
import Profile from './components/Profile';

import SharedShelf from './pages/SharedShelf';
import PrivateRoute from './components/PrivateRoute';

import { Context } from './globalContext';

const App = () => {
  const global = useContext(Context);
  const { loading } = global;
  const [referrer, setReferrer] = useState('');

  const updateNavReferrer = (referrer) => {
    setReferrer(referrer);
  };

  const clearReferrer = () => {
    setReferrer(null);
  };

  return (
    <Router>
      {loading ? null : (
        <>
          <NavBar referrer={referrer}></NavBar>
          <Switch>
            <Route exact path='/'>
              <Home
                clearReferrer={clearReferrer}
                updateNavReferrer={updateNavReferrer}></Home>
            </Route>
            <PrivateRoute path='/profile' exact>
              <Profile
              books={global.books}
              members={global.householdMembers}
              households={global.households}
              user={global.currentUser}
              ></Profile>
            </PrivateRoute>
            <Route exact path='/book/:id'>
              <Book bookType='global'></Book>
            </Route>
            <PrivateRoute exact path='/book/owned/:userBookId'>
              <Book bookType='personal'></Book>
            </PrivateRoute>
            <PrivateRoute exact path='/book/household/:globalBookId'>
              <Book
                bookType='household'
              ></Book>
            </PrivateRoute>
            <Route path='/shelf/:shelfId'>
              <SharedShelf></SharedShelf>
            </Route>
            <Route path='/*'>
              <Home
                clearReferrer={clearReferrer}
                updateNavReferrer={updateNavReferrer}></Home>
            </Route>
          </Switch>
        </>
      )}
    </Router>
  );
};

// class AppClass extends React.Component {
//   state = {
//     books: [],
//     manualISBN: '',
//     user: null,
//     loaded: false,
//     scrollPosition: '0',
//     windowWidth: null,
//   };

//   updateBook = (field, value, id, household) => {
//     let index;

//     if (field === 'delete') {
//       const newBooks = this.state.books.filter((books) => {
//         return books.user_book_id != id;
//       });

//       this.setState({ books: newBooks });
//     } else {
//       if (household) {
//         index = this.state.books.findIndex(
//           (existingBook) => existingBook.id == id
//         );
//       } else {
//         index = this.state.books.findIndex(
//           (existingBook) => existingBook.user_book_id == id
//         );
//       }

//       const newBooks = [...this.state.books];
//       const book = this.state.books[index];
//       book[field] = value;
//       newBooks.splice(index, 1, book);
//       this.setState({ books: newBooks });
//     }
//   };

//   addBookToGlobalState = (book) => {
//     this.setState({ books: [...this.state.books, book] });
//   };

//   componentDidMount = async () => {
//     const bootstrap = await axios
//       .get('/api/bootstrap')
//       .then((response) => response.data);

//     const books = bootstrap.books.userBooks.concat(
//       bootstrap.books.householdBooks
//     );

//     this.setState({
//       user: bootstrap.currentUser,
//       books: books || [],
//       householdMembers: bootstrap.householdMembers,
//       households: bootstrap.households,
//       loaded: true,
//     });
//   };

//   updateNavReferrer = (referrer) => {
//     this.setState({ referrer });
//   };

//   clearReferrer = () => {
//     this.setState({ referrer: null });
//   };

//   render = () => {
//     return (
//       <>
//         {this.state.loaded ? (
//           <userContext.Provider value={this.state.user}>
//             <Router>
//               <NavBar
//                 referrer={this.state.referrer}
//                 windowWidth={this.state.windowWidth}
//                 scrollPosition={this.state.scrollPosition}></NavBar>
//               <Switch>
//                 <Route exact path='/'>
//                   <Home
//                     households={this.state.households}
//                     clearReferrer={this.clearReferrer}
//                     updateNavReferrer={this.updateNavReferrer}
//                     loaded={this.state.loaded}
//                     user={this.state.user}
//                     addBookToGlobalState={this.addBookToGlobalState}
//                     books={this.state?.books}
//                     members={this.state.householdMembers}></Home>
//                 </Route>
//                 <PrivateRoute path='/profile' user={this.state.user} exact>
//                   <Profile
//                     books={this.state.books}
//                     members={this.state.householdMembers}
//                     households={this.state.households}
//                     user={this.state.user}></Profile>
//                 </PrivateRoute>
//                 <Route exact path='/book/:id'>
//                   <Book
//                     user={this.state.user}
//                     globalBook={true}
//                     updateBook={this.updateBook}
//                     books={this.state?.books}></Book>
//                 </Route>
//                 <PrivateRoute
//                   user={this.state.user}
//                   exact
//                   path='/book/owned/:userBookId'>
//                   <Book
//                     updateBook={this.updateBook}
//                     books={this.state?.books}></Book>
//                 </PrivateRoute>
//                 <PrivateRoute
//                   user={this.state.user}
//                   exact
//                   path='/book/household/:globalBookId'>
//                   <Book
//                     updateBook={this.updateBook}
//                     books={this.state?.books}></Book>
//                 </PrivateRoute>
//                 <Route path='/shelf/:shelfId'>
//                   <SharedShelf
//                     members={this.state.householdMembers}></SharedShelf>
//                 </Route>
//                 <Route path='/shelf/:shelfId/book/IbookId'></Route>
//                 <Route path='/*'>
//                   <Home
//                     households={this.state.households}
//                     clearReferrer={this.clearReferrer}
//                     updateNavReferrer={this.updateNavReferrer}
//                     loaded={this.state.loaded}
//                     user={this.state.user}
//                     addBookToGlobalState={this.addBookToGlobalState}
//                     books={this.state?.books}
//                     members={this.state.householdMembers}></Home>
//                 </Route>
//               </Switch>
//             </Router>
//           </userContext.Provider>
//         ) : null}
//       </>
//     );
//   };
// }

export default App;
