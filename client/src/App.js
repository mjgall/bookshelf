import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css';
import './styles/tailwind.css';
import './App.css';

import Scanner from './components/Scanner';

export default class App extends React.Component {
  state = { books: [], manualISBN: '' };

  updateFunction = book => {
    this.setState({ books: [...this.state.books, book] });
  };

  render = () => {
    return (
      <div className="w-full max-w-screen-md container mx-auto my-4">
        <Scanner className="container mx-auto" onChange={this.updateFunction}></Scanner>
        <ul
          style={{
            listStyle: 'none',
            display: 'grid',
            gridTemplateColumns: 'auto auto auto'
          }}>
          {this.state.books.map((book, index) => {
            return (
              <li key={index}>
                <div>{book.title}</div>
                <img alt={book.title} src={book.image}></img>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };
}
