import React from 'react';
import editable from './Editable';
import axios from 'axios';

const EditDiv = editable('div');
const EditP = editable('p');

export default class Book extends React.Component {
  state = {
    currentBook: null
  };

  componentDidMount = () => {
    window.scroll(0, 0);
    console.log('CDM called');
    const currentBooksArray = this.props?.books?.filter(book => {
      return book.isbn10 === this.props.isbn10;
    });

    const currentBook = currentBooksArray[0];

    this.setState({
      currentBook: {
        ...currentBook,
        notes: currentBook.notes ? currentBook.notes : 'Click to add notes.'
      }
    });
  };

  update = async (value, fieldName) => {
    console.log(value, fieldName);
    switch (fieldName) {
      case 'title':
        await this.setState({
          currentBook: { ...this.state.currentBook, title: value }
        });
        this.saveToDb(this.state);
        break;
      case 'author':
        console.log('in author');
        await this.setState({
          currentBook: { ...this.state.currentBook, author: [value] }
        });
        await this.saveToDb(this.state);
        break;
      case 'notes':
        await this.setState({
          currentBook: { ...this.state.currentBook, notes: value }
        });
        await this.saveToDb(this.state);
        break;
      case 'read':
        console.log('doing the read one');
        await this.setState({
          currentBook: { ...this.state.currentBook, read: true }
        });
        await this.saveToDb(this.state);
        break;
      default:
        console.log('defautl');
        break;
    }
  };

  saveToDb = async state => {
    const response = await axios.put('/api/books', state.currentBook);
    console.log(response);
    // const user = response.data;
    this.props.updateBook(state.currentBook);
  };

  render = () => {
    return (
      <div className="container mx-auto mt-12">
        <div className="px-6">
          <div className="flex flex-wrap justify-center">
            <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
              <div className="">
                <img
                  className="w-1/2 mx-auto"
                  src={this.state?.currentBook?.cover}
                  alt="cover"></img>
              </div>
            </div>
            <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center"></div>
            <div className="w-full lg:w-4/12 px-4 lg:order-1">
              <div className="flex justify-center py-4 lg:pt-4 pt-8">
                <div className="mr-4 p-3 text-center">
                  <div className="`text-md text-gray-500 cursor-pointer">
                    {this.state?.currentBook?.read ? (
                      `You've read this book!`
                    ) : (
                      <div
                        onClick={() => {
                          this.update(true, 'read');
                        }}
                        className="bg-blue-500 rounded text-white text-center p-4">
                        Mark as read!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-12">
            <EditDiv
              name="title"
              value={this.state?.currentBook?.title}
              update={this.update}
              className="text-4xl font-semibold leading-normal mb-2 text-gray-800 mb-2"></EditDiv>

            <EditDiv
              name="author"
              value={this.state?.currentBook?.author}
              update={this.update}
              className="text-sm leading-normal mt-0 mb-2 text-gray-500 font-bold"></EditDiv>
          </div>
          <div className="mt-10 py-10 border-t border-gray-300 text-center">
            <div className="flex flex-wrap justify-center">
              <div className="w-full lg:w-9/12 px-4">
                <div className="text-lg font-semibold">Notes:</div>
                <EditP
                  name="notes"
                  update={this.update}
                  value={this.state.currentBook?.notes}
                  className="mb-4 text-lg leading-relaxed text-gray-800"></EditP>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
}
