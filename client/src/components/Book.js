import React from 'react';
import InlineEdit from '@atlaskit/inline-edit';
import TextareaAutosize from 'react-textarea-autosize';
import axios from 'axios';

export default class Book extends React.Component {
  state = {
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
        .get(`/api/notes/households/${currentBook.id}/${currentBook.user_id}`)
        .then((response) => response.data);

      this.setState({
        bookType: 'personal',
        ...currentBook,
        notes: currentBook.user_notes,
        householdNotes,
      });
    } else if (params.globalBookId) {
      const currentBooksArray = this.props?.books?.filter((book) => {
        return book.id == params.globalBookId;
      });
      currentBook = currentBooksArray[0];

      const householdNotes = await axios
        .get(`/api/notes/households/${currentBook.id}/${currentBook.user_id}`)
        .then((response) => response.data);

      this.setState({
        bookType: 'household',

        ...currentBook,
        notes: currentBook.household_notes,

        householdNotes,
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
          ? this.state.user_book_id
          : Number(this.state.id),
    });

    this.props.updateBook(
      'title',
      value,
      this.state.bookType === 'personal'
        ? this.state.user_book_id
        : Number(this.state.id)
    );

    this.setState({
 
        title: response.data.title,

    });
  };

  handleAuthorChange = async (value) => {
    const response = await axios.put('/api/books', {
      bookType: this.state.bookType,
      field: 'author',
      value,
      id:
        this.state.bookType === 'personal'
          ? this.state.user_book_id
          : Number(this.state.id),
    });

    this.props.updateBook(
      'author',
      value,
      this.state.bookType === 'personal'
        ? this.state.user_book_id
        : Number(this.state.id)
    );

    this.setState({
   
      
        author: response.data.author,
 
    });
  };

  handleNotesChange = async (value) => {
    if (this.state.bookType === 'personal') {
      const response = await axios.put('/api/books', {
        field: 'notes',
        value,
        bookType: this.state.bookType,
        householdsBooksId: null,
        userBookId: this.state.user_book_id,
      });
      console.log(response.data);
    } else {
      const response = await axios.put('/api/books', {
        field: 'notes',
        value,
        bookType: this.state.bookType,
        householdsBooksId: this.state.households_book_id,
        userBookId: null,
      });
      console.log(response.data);
    }

    this.setState({
      
    
        notes: value,
      
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

  handleMarkAsRead = async () => {
    if (this.state.bookType === 'personal') {
      const read = await axios
        .put('/api/books', {
          field: 'read',
          value: !this.state.read,
          bookType: 'personal',
          householdsBooksId: null,
          userBookId: this.state.user_book_id,
        })
        .then((response) => response.data);

      this.props.updateBook(
        'read',
        !this.state.read,
        this.state.bookType === 'personal'
          ? this.state.user_book_id
          : Number(this.state.id)
      );

      this.setState({
    
        
          read: read.read,
       
      });
    } else {
      const householdAsRead = await axios
        .post('/api/households/books', { bookId: this.state.id })
        .then((response) => response.data);

      console.log(householdAsRead);
    }
  };

  render = () => {
    return (
      <div className="container mx-auto mt-12">
        <div
          className="md:grid md:grid-cols-2"
          style={{ gridTemplateColumns: `25% 75%` }}>
          <div>
            <div className="border-gray-400 border rounded-md shadow-md p-4 md:mr-3 mx-6">
              <div className="mx-0">
                <img
                  className="w-2/5 block ml-auto mr-auto"
                  src={this.state?.cover}></img>
              </div>
              {this.state.bookType === 'household' ? (
                <div className="mt-2">{this.state?.title}</div>
              ) : (
                <InlineEdit
                  readViewFitContainerWidth
                  defaultValue={this.state?.title}
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
                      {this.state?.title || 'Click to enter value'}
                    </div>
                  )}
                  onConfirm={this.handleTitleChange}
                />
              )}
              {this.state.bookType === 'household' ? (
                <div className="mt-2">{this.state?.author}</div>
              ) : (
                <InlineEdit
                  readViewFitContainerWidth
                  defaultValue={this.state?.author}
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
                      {this.state?.author ||
                        'Click to enter value'}
                    </div>
                  )}
                  onConfirm={this.handleAuthorChange}
                />
              )}
              {this.state?.read ? (
                <div className="bg-green-500  text-white my-1 mx-2 mt-6 py-2 px-3 rounded  text-center">
                  Already read!
                </div>
              ) : (
                <div
                  onClick={this.handleMarkAsRead}
                  className="bg-blue-500 hover:bg-blue-700 text-white my-1 mx-2 mt-6 py-2 px-3 rounded focus:outline-none focus:shadow-outline text-center cursor-pointer">
                  Mark as read
                </div>
              )}
            </div>
          </div>
          <div className="md:mx-0 mx-6">
            {this.state.bookType === 'household' ? null : (
              <InlineEdit
                defaultValue={this.state?.notes}
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
                    {this.state?.notes || 'Click to enter value'}
                  </div>
                )}
                onConfirm={this.handleNotesChange}
                autoFocus
                readViewFitContainerWidth
              />
            )}

            <div>
              <div className="text-lg mt-6">🏠 Households</div>
              {this.state?.householdNotes?.map((householdNotes) => {
                return (
                  <InlineEdit
                    keepEditViewOpenOnBlur={true}
                    defaultValue={householdNotes.notes}
                    label={`Notes from ${householdNotes.household_name}`}
                    editView={(fieldProps, ref) => (
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
