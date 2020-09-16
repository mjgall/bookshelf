import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import InlineEdit from '@atlaskit/inline-edit';
import TextArea from '@atlaskit/textarea';
import Textfield from '@atlaskit/textfield';
import {
  XSquare,
  Lock,
  LockOpen,
  Book as BookIcon,
  BookOpen,
} from '@styled-icons/boxicons-solid';
import Tip from '../common/Tip';
import Confirm from '../common/Confirm';
import NotesFromHouseholds from '../components/NotesFromHouseholds';
import { useParams } from 'react-router-dom';
import { Context } from '../globalContext';
import { withRouter } from 'react-router-dom'

const Book = (props) => {
  const global = useContext(Context);
  const params = useParams();

  const [book, setBook] = useState(undefined);
  const [loaded, setLoaded] = useState(false);

  const fetchGlobalBook = useCallback(async (id) => {
    const globalBookDetails = await axios
      .get(`/api/book/${id}`)
      .then((response) => response.data);
    setBook(globalBookDetails);
    setLoaded(true);
  }, []);

  useEffect(() => {
    switch (props.bookType) {
      case 'global':
        fetchGlobalBook(params.id);
        break;
      case 'personal':
        const personalBook = global.allBooks.filter(
          (book) => book.user_book_id === Number(params.userBookId)
        )[0];
        const personalIndex = global.allBooks.findIndex((globalBook) => {
          if (props.bookType === 'personal') {
            return globalBook.user_book_id === personalBook.user_book_id;
          } else {
            return undefined;
          }
        });
        setBook({ ...personalBook, index: personalIndex });
        setLoaded(true);
        break;
      case 'household':
        const householdBook = global.allBooks.filter(
          (book) => book.id === Number(params.globalBookId)
        )[0];
        const householdIndex = global.allBooks.findIndex((globalBook) => {
          if (props.bookType === 'household') {
            return globalBook.id === householdBook.id;
          } else {
            return undefined;
          }
        });
        setBook({ ...householdBook, index: householdIndex });
        setLoaded(true);
        break;
      default:
        break;
    }
  }, [
    fetchGlobalBook,
    global.allBooks,
    props.bookType,
    params.globalBookId,
    params.userBookId,
    params.id,
    params
  ]);

  const updateBookField = async (field, value) => {
    let options = { bookType: props.bookType, field, value, id: undefined };

    switch (field) {
      case 'title':
      case 'author':
      case 'private':
        if (props.bookType === 'personal') {
          options.id = book.user_book_id;
          options.globalId = book.id
        }
        break;
      case 'read':
        if (props.bookType === 'personal') {
          options.id = book.user_book_id;
          options.globalId = book.id
        } else if (
          props.bookType === 'household' ||
          props.bookType === 'global'
        ) {
          options.id = book.id;
        }
        break;
      case 'notes':
        //updating personal notes
        if (props.bookType === 'personal') {
          options.id = book.user_book_id;
          options.globalId = book.id
        } else if (
          props.bookType === 'global' ||
          props.bookType === 'household'
        ) {
          options.id = book.id;
          options.usersGlobalBooksId = book.users_globalbooks_id;
        }
        break;
      default:
        break;
    }

    axios.put('/api/books', options).then((response) => {
      if (props.bookType !== 'global') {
        global.allBooks[book.index][field] = response.data[field];
      }
      setBook({ ...book, [field]: response.data[field] });
    });
  };

  const deleteBook = async () => {
    axios.delete(`/api/books/${book.user_book_id}`).then((response) => {
      if (response.data.affectedRows > 0) {
        global.userBooks.splice(book.index, 1);
        props.history.replace('/');
      } else {
        props.history.replace('/');
        throw Error('Error deleting book');
      }
    });
  };

  return (
    <div className='container mx-auto mt-12'>
      {loaded ? (
        <div
          className='md:grid md:grid-cols-2'
          style={{ gridTemplateColumns: `25% 70% 5%` }}>
          <div>
            <div className='border-gray-400 border rounded-md shadow-md p-4 md:mr-3 mx-6'>
              <div id='book-details'>
                <div className='mx-0'>
                  <img
                    alt='book cover'
                    className='w-2/5 block ml-auto mr-auto'
                    src={book.cover}></img>
                </div>
                {props.bookType === 'household' ||
                  props.bookType === 'global' ? (
                    <div className='mt-2'>{book.title}</div>
                  ) : (
                    <InlineEdit
                      readViewFitContainerWidth
                      defaultValue={book.title}
                      editView={(fieldProps) => (
                        <Textfield {...fieldProps} autoFocus />
                      )}
                      readView={() => (
                        <div className='text-center'>
                          {book.title || 'No notes, click to enter some!'}
                        </div>
                      )}
                      onConfirm={(value) => updateBookField('title', value)}
                    />
                  )}
                {props.bookType === 'household' ||
                  props.bookType === 'global' ? (
                    <div className='mt-2'>{book.author}</div>
                  ) : (
                    <InlineEdit
                      readViewFitContainerWidth
                      defaultValue={book.author}
                      editView={(fieldProps) => (
                        <Textfield {...fieldProps} autoFocus />
                      )}
                      readView={() => (
                        <div className='text-center'>
                          {book.author || 'No author'}
                        </div>
                      )}
                      onConfirm={(value) => updateBookField('author', value)}
                    />
                  )}
                {book.read ? (
                  <Tip
                    renderChildren
                    content='Mark as unread'
                    placement='right'>
                    <div
                      onClick={() => updateBookField('read', !book.read)}
                      className='bg-green-500 hover:bg-green-700 text-white my-1 mx-2 mt-6 py-2 px-3 rounded focus:outline-none focus:shadow-outline text-center cursor-pointer'>
                      <div className='flex justify-center'>
                        <BookIcon size='1.5rem'></BookIcon>
                        <span className='ml-2'>You've read this book</span>
                      </div>
                    </div>
                  </Tip>
                ) : (
                    <Tip renderChildren content='Mark as read' placement='right'>
                      <div
                        onClick={() => updateBookField('read', !book.read)}
                        className='bg-blue-500 hover:bg-blue-700 text-white my-1 mx-2 mt-6 py-2 px-3 rounded focus:outline-none focus:shadow-outline text-center cursor-pointer'>
                        <div className='flex justify-center'>
                          <BookOpen size='1.5rem'></BookOpen>
                          <span className='ml-2'>Not read yet</span>
                        </div>
                      </div>
                    </Tip>
                  )}
                {props.bookType === 'personal' ? (
                  book.private ? (
                    <Tip
                      renderChildren
                      content='Click to make public.'
                      placement='right'>
                      <div
                        className='bg-red-500 hover:bg-red-700 text-white my-1 mx-2 mt-6 py-2 px-3 rounded focus:outline-none focus:shadow-outline text-center cursor-pointer'
                        onClick={() =>
                          updateBookField('private', !book.private)
                        }>
                        <div className='flex justify-center'>
                          <Lock size='1.5rem'></Lock>
                          <span className='ml-2'>Private</span>
                        </div>
                      </div>
                    </Tip>
                  ) : (
                      <Tip
                        renderChildren
                        content='Click to make private.'
                        placement='right'>
                        <div
                          onClick={() =>
                            updateBookField('private', !book.private)
                          }
                          className='bg-blue-500 hover:bg-blue-700 text-white my-1 mx-2 mt-6 py-2 px-3 rounded focus:outline-none focus:shadow-outline text-center cursor-pointer'>
                          <div className='flex justify-center'>
                            <LockOpen size='1.5rem'></LockOpen>
                            <span className='ml-2'>Public</span>
                          </div>
                        </div>
                      </Tip>
                    )
                ) : null}
              </div>
            </div>
          </div>
          <div className='md:mx-0 mx-6'>
            {props.bookType === 'household' || props.bookType === 'global' ? (
              <InlineEdit
                defaultValue={book.notes}
                label='Personal Notes'
                editView={(fieldProps, ref) => (
                  // textarea does not currently correctly pass through ref as a prop
                  <TextArea type='text' className='w-full' {...fieldProps} />
                )}
                readView={() => {
                  if (book.notes) {
                    return <div className='multiline'>{book.notes}</div>;
                  } else {
                    return (
                      <div className='text-gray-500'>
                        No notes yet - click to add some!
                      </div>
                    );
                  }
                }}
                onConfirm={(value) => updateBookField('notes', value)}
                autoFocus
                readViewFitContainerWidth
              />
            ) : (
                <InlineEdit
                  defaultValue={book.notes}
                  label={'Personal Notes'}
                  editView={(fieldProps, ref) => (
                    <TextArea {...fieldProps} ref={ref}></TextArea>
                  )}
                  readView={() => (
                    <div className='multiline'>
                      {book.notes || 'No notes, click to enter some!'}
                    </div>
                  )}
                  onConfirm={(value) => updateBookField('notes', value)}
                  autoFocus
                  readViewFitContainerWidth
                />
              )}
            {props.bookType === 'global' ? null : (
              <div>
                <div className='text-lg mt-6'>
                  <span role='img' aria-label='house'>
                    🏠
                  </span>
                  Notes from households
                </div>
                <NotesFromHouseholds bookId={book.id}></NotesFromHouseholds>
              </div>
            )}
          </div>
          <div className='md:mx-0 mx-6' id='actions-bar'>
            {props.bookType === 'personal' ? (
              <Confirm
                position='left'
                tipContent='Delete book'
                onConfirm={() => deleteBook()}>
                <XSquare color='red' size='2rem'></XSquare>
              </Confirm>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default withRouter(Book);
