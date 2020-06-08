import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Context } from '../globalContext';
import { withRouter } from 'react-router-dom';
import BookTable from '../components/BookTable';

const SharedShelf = (props) => {
  const user = useContext(Context).currentUser;
  const members = useContext(Context).householdMembers;

  const [books, setBooks] = useState([]);
  const [loaded, setLoaed] = useState(false);

  useEffect(() => {
    const getBooks = async () => {
      const books = await axios
        .get(`/api/shelves/${props.match.params.shelfId}`)
        .then((response) => response.data);

      setBooks(books);
      setLoaed(true);
    };

    getBooks();
  }, [props.match.params.shelfId]);

  const findRelation = () => {
    if (user.id === Number(props.match.params.shelfId)) {
      return 'self';
    } else if (
      members.filter(
        (member) =>
          Number(member.user_id) === Number(props.match.params.shelfId) &&
          member.invite_accepted
      ).length > 0
    ) {
      return 'household';
    } else return 'none';
  };

  if (loaded) {
    if (books.length > 0) {
      return (
        <div className='my-6'>
          <div className='text-3xl text-center my-6'>
            {books[0].full}'s shared books
          </div>
          <BookTable
            relation={user ? findRelation() : null}
            sharedShelf={true}
            householdSelect={{ value: 'none' }}
            user={user}
            history={props.history}
            books={books || []}></BookTable>
        </div>
      );
    } else {
      return (
        <div className='w-1/2 mt-16 m-auto text-center'>
          Either this user does not exist or they don't have any books on their
          shared shelf!
        </div>
      );
    }
  } else {
    return null;
  }
};

export default withRouter(SharedShelf);
