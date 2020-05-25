import React from 'react';
import InlineEdit from '@atlaskit/inline-edit';
import TextareaAutosize from 'react-textarea-autosize';
import Tip from '../common/Tip';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { XSquare } from '@styled-icons/boxicons-solid';

import Tippy from '@tippyjs/react/headless';

class Book extends React.Component {
  state = {
    isLoaded: false,
    confirmDelete: false,
  };

  componentDidMount = async () => {
    console.log(this.props);

    let currentBook;

    if (this.props.globalBook) {
      const globalBook = await axios
        .get(`/api/book/${this.props.match.params.id}`)
        .then((response) => response.data);
      this.setState({ bookType: 'global', ...globalBook, isLoaded: true });
    } else {
      const params = this.props.computedMatch.params;
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
          isLoaded: true,
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
          isLoaded: true,
        });
      }
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
    } else if (this.state.bookType === 'household') {
      const householdAsRead = await axios
        .post('/api/households/books', {
          bookId: this.state.id,
          action: 'read',
          usersGlobalBooksId: this.state.users_globalbooks_id,
        })
        .then((response) => response.data);

      this.props.updateBook(
        'read',
        !this.state.read,
        this.state.bookType === 'personal'
          ? this.state.user_book_id
          : Number(this.state.id),
        true
      );

      this.setState({
        read: true,
      });
    } else {
      const householdAsRead = await axios
        .post('/api/households/books', {
          bookId: this.state.id,
          action: 'read',
          usersGlobalBooksId: this.state.users_globalbooks_id,
        })
        .then((response) => response.data);

      this.setState({
        read: true,
      });
    }
  };

  handlePersonalNotesChange = async (notes) => {
    const addHouseholdNotes = await axios
      .post('/api/households/books', {
        bookId: this.state.id,
        action: 'notes',
        notes,
        usersGlobalBooksId: this.state.users_globalbooks_id,
      })
      .then((response) => response.data);

    this.setState({
      personalNotes: notes,
    });
  };

  togglePrivate = async () => {
    const response = await axios
      .put('/api/books', {
        bookType: 'personal',
        field: 'private',
        value: !this.state.private,
        id: this.state.user_book_id,
      })
      .then((response) => response.data);

    this.setState({ private: response.private });
  };

  deleteBook = async () => {
    const response = await axios
      .delete(`/api/books/${this.state.user_book_id}`)
      .then((response) => {
        if (response.data.affectedRows > 0) {
          this.props.history.replace('/');
        } else {
          this.props.history.replace('/');
          throw Error('Error deleting book');
        }
      });

    this.props.updateBook('delete', null, this.state.user_book_id);
  };

  render = () => {
    return (
      <div className='container mx-auto mt-12'>
        <div
          className='md:grid md:grid-cols-2'
          style={{ gridTemplateColumns: `25% 70% 5%` }}>
          <div>
            <div className='border-gray-400 border rounded-md shadow-md p-4 md:mr-3 mx-6'>
              {this.state.isLoaded ? (
                <div id='book-details'>
                  <div className='mx-0'>
                    <img
                      className='w-2/5 block ml-auto mr-auto'
                      src={this.state?.cover}></img>
                  </div>
                  {this.state.bookType === 'household' ||
                  this.state.bookType === 'global' ? (
                    <div className='mt-2'>{this.state?.title}</div>
                  ) : (
                    <InlineEdit
                      readViewFitContainerWidth
                      defaultValue={this.state?.title}
                      editView={(fieldProps) => (
                        <input
                          className='w-full py-2 px-1'
                          type='text'
                          {...fieldProps}
                          autoFocus
                        />
                      )}
                      readView={() => (
                        <div className='text-center'>
                          {this.state?.title ||
                            'No notes, click to enter some!'}
                        </div>
                      )}
                      onConfirm={this.handleTitleChange}
                    />
                  )}
                  {this.state.bookType === 'household' ||
                  this.state.bookType === 'global' ? (
                    <div className='mt-2'>{this.state?.author}</div>
                  ) : (
                    <InlineEdit
                      readViewFitContainerWidth
                      defaultValue={this.state?.author}
                      editView={(fieldProps) => (
                        <input
                          className='w-full py-2 px-1'
                          type='text'
                          {...fieldProps}
                          autoFocus
                        />
                      )}
                      readView={() => (
                        <div className='text-center'>
                          {this.state?.author || 'No author'}
                        </div>
                      )}
                      onConfirm={this.handleAuthorChange}
                    />
                  )}
                  {this.state?.read ? (
                    <div className='bg-green-500  text-white my-1 mx-2 mt-6 py-2 px-3 rounded text-center'>
                      Already read!
                    </div>
                  ) : (
                    <div
                      onClick={this.handleMarkAsRead}
                      className='bg-blue-500 hover:bg-blue-700 text-white my-1 mx-2 mt-6 py-2 px-3 rounded focus:outline-none focus:shadow-outline text-center cursor-pointer'>
                      Mark as read
                    </div>
                  )}
                  {this.state.bookType === 'personal' ? (
                    this.state?.private ? (
                      <Tip renderChildren content='Click to make public.'>
                        <div
                          className='bg-red-500 hover:bg-red-700 text-white my-1 mx-2 mt-6 py-2 px-3 rounded focus:outline-none focus:shadow-outline text-center cursor-pointer'
                          onClick={this.togglePrivate}>
                          Private
                        </div>
                      </Tip>
                    ) : (
                      <Tip renderChildren content='Click to make private.'>
                        <div
                          onClick={this.togglePrivate}
                          className='bg-blue-500 hover:bg-blue-700 text-white my-1 mx-2 mt-6 py-2 px-3 rounded focus:outline-none focus:shadow-outline text-center cursor-pointer'>
                          Public
                        </div>
                      </Tip>
                    )
                  ) : null}
                </div>
              ) : (
                <div class='loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16 mx-auto'></div>
              )}
            </div>
          </div>
          <div className='md:mx-0 mx-6'>
            {this.state.bookType === 'household' ||
            this.state.bookType === 'global' ? (
              <InlineEdit
                defaultValue={this.state?.personalNotes}
                label='Personal Notes'
                editView={(fieldProps, ref) => (
                  // @ts-ignore - textarea does not currently correctly pass through ref as a prop
                  <TextareaAutosize
                    type='text'
                    className='w-full'
                    {...fieldProps}
                  />
                )}
                readView={() => {
                  if (this.state.personalNotes) {
                    return (
                      <div className='multiline'>
                        {this.state?.personalNotes}
                      </div>
                    );
                  } else {
                    return (
                      <div className='text-gray-500'>
                        No notes yet - click to add some!
                      </div>
                    );
                  }
                }}
                onConfirm={this.handlePersonalNotesChange}
                autoFocus
                readViewFitContainerWidth
              />
            ) : (
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
                    type='text'
                    className='w-full'
                    {...fieldProps}
                  />
                )}
                readView={() => (
                  <div className='multiline'>
                    {this.state?.notes || 'No notes, click to enter some!'}
                  </div>
                )}
                onConfirm={this.handleNotesChange}
                autoFocus
                readViewFitContainerWidth
              />
            )}
            {this.props.globalBook ? null : (
              <div>
                <div className='text-lg mt-6'>🏠 Households</div>
                {this.state?.householdNotes?.map((householdNotes) => {
                  return (
                    <InlineEdit
                      keepEditViewOpenOnBlur={true}
                      defaultValue={householdNotes.notes}
                      label={`Notes from ${householdNotes.household_name}`}
                      editView={(fieldProps, ref) => (
                        <TextareaAutosize
                          type='text'
                          className='w-full'
                          {...fieldProps}
                        />
                      )}
                      readView={() => {
                        if (householdNotes.notes) {
                          return (
                            <div className='multiline'>
                              {householdNotes.notes}
                            </div>
                          );
                        } else {
                          return (
                            <div className='text-gray-500'>
                              No notes yet - click to add some!
                            </div>
                          );
                        }
                      }}
                      onConfirm={(value) =>
                        this.handleHouseholdNotesChange(
                          householdNotes.id,
                          value
                        )
                      }
                      autoFocus
                      readViewFitContainerWidth
                    />
                  );
                })}
              </div>
            )}
          </div>
          <div className='md:mx-0 mx-6' id='actions-bar'>
            {this.state.bookType === 'personal' ? (
              <Tip renderChildren content="Delete book">
                <Tippy
                  interactive={true}
                  placement='left'
                  visible={this.state.confirmDelete}
                  onClickOutside={() => this.setState({ confirmDelete: false })}
                  render={(attrs) => {
                    console.log(attrs);
                    return (
                      <div className='flex border border-gray-200 shadow-md rounded-sm px-4 py-2 justify-between space-x-4 bg-white text-sm'>
                        <div
                          style={{ zIndex: 9999999 }}
                          className='w-full shadow-inner bg-green-500 text-white py-1 px-2 rounded text-center cursor-pointer'
                          onClick={this.deleteBook}>
                          Delete
                        </div>
                        <div
                          className='w-full shadow-inner bg-red-500 text-white py-1 px-2 rounded text-center cursor-pointer'
                          onClick={() =>
                            this.setState({ confirmDelete: false })
                          }>
                          Cancel
                        </div>
                      </div>
                    );
                  }}>
                  <XSquare
                    onClick={() =>
                      this.setState({
                        confirmDelete: !this.state.confirmDelete,
                      })
                    }
                    color='red'
                    size='2rem'
                    className='cursor-pointer'></XSquare>
                </Tippy>
              </Tip>
            ) : null}
          </div>
        </div>
      </div>
    );
  };
}

export default withRouter(Book);
