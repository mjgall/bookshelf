import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Context } from '../globalContext';
import { withRouter } from 'react-router-dom';
import BookTable from '../components/BookTable';

const SharedShelf = (props) => {
  const user = useContext(Context).currentUser;
  const members = useContext(Context).householdMembers;

  const [books, setBooks] = useState([]);

  useEffect(() => {
    const getBooks = async () => {
      const books = await axios
        .get(`/api/shelves/${props.match.params.shelfId}`)
        .then((response) => response.data);
      setBooks(books);
    };

    getBooks();
  }, [props.match.params.shelfId]);

  const findRelation = () => {
    if (user.id === Number(props.match.params.shelfId)) {
      return { relation: 'self' };
    } else if (
      members.filter(
        (member) =>
          member.user_id === Number(props.match.params.shelfId) &&
          member.invite_accepted
      ).length > 0
    ) {
      return 'household';
    } else return 'relation';
  };

  if (books.length > 0) {
    return (
      <div className='my-6'>
        <div className='text-3xl text-center my-6'>
          {books[0].full}'s shared books
        </div>
        <BookTable
          relation={user ? findRelation() : null}
          sharedShelf={true}
          // ownerFilterValue={this.state?.ownerSelect?.label}
          // householdSelect={this.state.householdSelect}
          // selfOnly={this.state.selfOnly}
          householdSelect={{ value: 'none' }}
          // members={this.members}
          user={user}
          history={props.history}
          books={books || []}
          // userOnly={this.state.selfOnly}
        ></BookTable>
      </div>
    );
  } else {
    return null;
  }
};

export default withRouter(SharedShelf);
