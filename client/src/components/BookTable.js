import React from 'react';

export default class BookTable extends React.Component {
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
                <tr key={index}>
                  <td className="border px-4 py-2">{book.title}</td>
                  <td className="border px-4 py-2">{book.authors[0]}</td>
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
