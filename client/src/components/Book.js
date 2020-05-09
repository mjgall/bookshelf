import React from 'react';
import InlineEdit from '@atlaskit/inline-edit';
import TextareaAutosize from 'react-textarea-autosize';
import axios from 'axios';

export default class Book extends React.Component {
  state = {
    currentBook: null,
    editValue: '',
  };

  componentDidMount = async () => {
    const params = this.props.computedMatch.params;

    let currentBook;

    if (params.userBookId) {
      const currentBooksArray = this.props?.books?.filter((book) => {
        return book.user_book_id == params.userBookId;
      });
      currentBook = currentBooksArray[0];

      const householdNotes = await axios
        .get(`/api/notes/households/${currentBook.id}`)
        .then((response) => response.data);

      this.setState({
        bookType: 'personal',
        currentBook: {
          ...currentBook,
          notes: currentBook.user_notes,
        },
        householdNotes,
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
    const response = await axios.put('/api/books', {
      bookType: this.state.bookType,
      field: 'title',
      value,
      id:
        this.state.bookType === 'personal'
          ? this.state.currentBook.user_book_id
          : Number(this.state.currentBook.id),
    });

    this.props.updateBook(
      'title',
      value,
      this.state.bookType === 'personal'
        ? this.state.currentBook.user_book_id
        : Number(this.state.currentBook.id)
    );

    this.setState({
      currentBook: {
        ...this.state.currentBook,
        title: response.data.title,
      },
    });
  };

  handleAuthorChange = async (value) => {
    const response = await axios.put('/api/books', {
      bookType: this.state.bookType,
      field: 'author',
      value,
      id:
        this.state.bookType === 'personal'
          ? this.state.currentBook.user_book_id
          : Number(this.state.currentBook.id),
    });

    this.props.updateBook(
      'author',
      value,
      this.state.bookType === 'personal'
        ? this.state.currentBook.user_book_id
        : Number(this.state.currentBook.id)
    );

    this.setState({
      currentBook: {
        ...this.state.currentBook,
        author: response.data.author,
      },
    });
  };

  handleNotesChange = async (value) => {
    if (this.state.bookType === 'personal') {
      const response = await axios.put('/api/books', {
        field: 'notes',
        value,
        bookType: this.state.bookType,
        householdsBooksId: null,
        userBookId: this.state.currentBook.user_book_id,
      });
      console.log(response.data);
    } else {
      const response = await axios.put('/api/books', {
        field: 'notes',
        value,
        bookType: this.state.bookType,
        householdsBooksId: this.state.currentBook.households_book_id,
        userBookId: null,
      });
      console.log(response.data);
    }

    this.setState({
      currentBook: {
        ...this.state.currentBook,
        notes: value,
      },
    });
  };

  handleHouseholdNotesChange = async (householdsBooksId, value) => {
    const response = await axios.put('/api/books', {
      field: 'notes',
      value,
      bookType: 'household',
      householdsBooksId: householdsBooksId,
      userBookId: null,
    });

    const newNotes = this.state.householdNotes.map((householdNotes) => {
      if (householdNotes.id == householdsBooksId) {
        return { ...householdNotes, notes: response.data.notes };
      } else {
        return { ...householdNotes };
      }
    });
    this.setState({ householdNotes: newNotes });
  };

  render = () => {
    return (
      <div className="container mx-auto mt-12">
        <div className="md:flex">
          <div className="md:w-1/4 border-gray-400 border rounded-md shadow-md p-4 md:mr-3 mx-6" >
            <div className="mx-0">
              <img
                className="w-2/5 block ml-auto mr-auto"
                src={this.state?.currentBook?.cover}></img>
            </div>
            {this.state.bookType === 'household' ? (
              <div className="mt-2">{this.state?.currentBook?.title}</div>
            ) : (
              <InlineEdit
                readViewFitContainerWidth
                defaultValue={this.state?.currentBook?.title}
                editView={(fieldProps) => (
                  <input
                    className="w-full py-2 px-1"
                    type="text"
                    {...fieldProps}
                    autoFocus
                  />
                )}
                readView={() => (
                  <div className="text-center">
                    {this.state?.currentBook?.title || 'Click to enter value'}
                  </div>
                )}
                onConfirm={this.handleTitleChange}
              />
            )}
            {this.state.bookType === 'household' ? (
              <div className="mt-2">{this.state?.currentBook?.author}</div>
            ) : (
              <InlineEdit
                readViewFitContainerWidth
                defaultValue={this.state?.currentBook?.author}
                editView={(fieldProps) => (
                  <input
                    className="w-full py-2 px-1"
                    type="text"
                    {...fieldProps}
                    autoFocus
                  />
                )}
                readView={() => (
                  <div className="text-center">
                    {this.state?.currentBook?.author || 'Click to enter value'}
                  </div>
                )}
                onConfirm={this.handleAuthorChange}
              />
            )}
          </div>
          <div className="md:w-3/4 md:mx-0 mx-6">
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
            <div>
              <div className="text-lg mt-6">🏠 Households</div>
              {this.state?.householdNotes?.map((householdNotes) => {
                return (
                  <InlineEdit
                    keepEditViewOpenOnBlur={true}
                    defaultValue={householdNotes.notes}
                    label={`Notes from ${householdNotes.household_name}`}
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
                        {householdNotes.notes || 'Click to enter value'}
                      </div>
                    )}
                    onConfirm={(value) =>
                      this.handleHouseholdNotesChange(householdNotes.id, value)
                    }
                    autoFocus
                    readViewFitContainerWidth
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };
}
