import React from 'react';
import InlineEdit from '@atlaskit/inline-edit';
import TextareaAutosize from 'react-textarea-autosize';
import axios from 'axios'

export default class Book extends React.Component {
  state = {
    currentBook: null,
    editValue: '',
  };

  componentDidMount = () => {
    const params = this.props.computedMatch.params;
    let currentBook;

    if (params.userBookId) {
      const currentBooksArray = this.props?.books?.filter((book) => {
        return book.user_book_id == params.userBookId;
      });
      currentBook = currentBooksArray[0];
      this.setState({
        bookType: 'personal',
        currentBook: {
          ...currentBook,
          notes: currentBook.user_notes,
        },
      });
    } else if (params.globalBookId) {
      const currentBooksArray = this.props?.books?.filter((book) => {
        return book.id == params.globalBookId;
      });
      currentBook = currentBooksArray[0];
      this.setState({
        bookType: 'household',
        currentBook: {
          ...currentBook,
          notes: currentBook.household_notes,
        },
      });
    }

    window.scroll(0, 0);
  };

  handleTitleChange = async (value) => {

    const response = await axios.put('/api/books', {bookType: this.state.bookType, field: 'title', value })

    this.setState({
      currentBook: {
        ...this.state.currentBook,
        title: response.data.value,
      },
    });
  };

  handleAuthorChange = (value) => {
    this.setState({
      currentBook: {
        ...this.state.currentBook,
        author: value,
      },
    });
  };

  handleNotesChange = (value) => {
    console.log(value);
    this.setState({
      currentBook: {
        ...this.state.currentBook,
        notes: value,
      },
    });
  };

  render = () => {
    return (
      <div className="container mx-auto mt-12">
        <div className="md:flex">
          <div className="md:w-2/5 border-gray-400 border rounded-md shadow-md p-4 md:mr-3">
            <div className="mx-0">
              <img
                className="w-2/5 block ml-auto mr-auto"
                src={this.state?.currentBook?.cover}></img>
            </div>
            <InlineEdit
              readViewFitContainerWidth
              defaultValue={this.state?.currentBook?.title}
              label="Title"
              editView={(fieldProps) => (
                <input
                  className="w-full"
                  type="text"
                  {...fieldProps}
                  autoFocus
                />
              )}
              readView={() => (
                <div>
                  {this.state?.currentBook?.title || 'Click to enter value'}
                </div>
              )}
              onConfirm={this.handleTitleChange}
            />
            <InlineEdit
              readViewFitContainerWidth
              defaultValue={this.state?.currentBook?.author}
              label="Author"
              editView={(fieldProps) => (
                <input
                  className="w-full"
                  type="text"
                  {...fieldProps}
                  autoFocus
                />
              )}
              readView={() => (
                <div>
                  {this.state?.currentBook?.author || 'Click to enter value'}
                </div>
              )}
              onConfirm={this.handleAuthorChange}
            />
          </div>
          <div className="md:w-3/5">
            <InlineEdit
              defaultValue={this.state?.currentBook?.notes}
              label={
                this.state.bookType === 'household'
                  ? 'Household Notes'
                  : 'Personal Notes'
              }
              editView={(fieldProps, ref) => (
                // @ts-ignore - textarea does not currently correctly pass through ref as a prop
                <TextareaAutosize
                  type="text"
                  className="w-full"
                  {...fieldProps}
                />
              )}
              readView={() => (
                <div className="multiline">
                  {this.state?.currentBook?.notes || 'Click to enter value'}
                </div>
              )}
              onConfirm={this.handleNotesChange}
              autoFocus
              readViewFitContainerWidth
            />
          </div>
        </div>
      </div>
    );
  };
}
