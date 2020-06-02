import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { globalContext } from '../globalContext';
import { Redirect, withRouter } from 'react-router-dom';
import BookTable from '../components/BookTable2';

const SharedShelf = (props) => {
  const user = useContext(globalContext).currentUser;
  const members = useContext(globalContext).householdMembers

  const [books, setBooks] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const getBooks = async () => {
      const books = await axios
        .get(`/api/shelves/${props.match.params.shelfId}`)
        .then((response) => response.data);
      setBooks(books);
    };

    getBooks();
    setLoaded(true);
  }, []);

  const findRelation = () => {
    if (user.id == props.match.params.shelfId) {
      return { relation: 'self' };
    } else if (
      members.filter(
        (member) =>
          member.user_id == props.match.params.shelfId && member.invite_accepted
      ).length > 0
    ) {
      return { relation: 'household' };
    } else return { relation: 'none' };
  };

  if (books.length > 0) {
    return (
      <div className='my-6'>
        <div className='text-3xl text-center my-6'>
          {books[0].full}'s shared books
        </div>
        <BookTable
          relation={user ? findRelation().relation : null}
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
