import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';

class BookTable extends React.Component {

  viewBook = id => {
    this.props.history.push(`/book/${id}`);
  };

  render = () => {

    return (
      <>
        <table className="table-auto max-w-screen-md container mx-auto shadow-md">
          <thead>
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Author</th>
              <th className="px-4 py-2">Cover</th>
            </tr>
          </thead>
          <tbody>
            {this.props.books.map((book, index) => {
              return (
                <tr className="hover:bg-gray-100 cursor-pointer" key={index} onClick={() => this.viewBook(book.isbn10)}>
                  <td className="border px-4 py-2">{book.title}</td>
                  <td className="border px-4 py-2">{book.author}</td>
                  <td className="border px-4 py-2">
                    <img
                      style={{ maxHeight: '5rem' }}
                      src={book.image}
                      alt="cover"></img>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
  };
}

export default withRouter(BookTable);
