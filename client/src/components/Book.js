import React from 'react';

export default class Book extends React.Component {
  state = {
    currentBook: null
  };

  componentDidMount = () => {
    console.log(this.props);
    const currentBooksArray = this.props?.books?.filter(book => {
      return book.isbn === this.props.isbn;
    });

    const currentBook = currentBooksArray[0];

    this.setState({ currentBook });
  };

  render = () => {
    console.log(this.props);
    return (
      <div className="container mx-auto">
        <div className="max-w-sm rounded overflow-hidden shadow-lg mx-auto">
          <img
            className="w-1/2 mx-auto"
            src={this.state?.currentBook?.image}
            alt="cover"></img>
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2 text-center">
              {this.state?.currentBook?.title}
            </div>
          </div>
        </div>
      </div>
    );
  };
}
