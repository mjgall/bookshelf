import React from 'react';
import Scanner from './Scanner';
import BookTable from './BookTable2';
import { withRouter } from 'react-router-dom';

class Home extends React.Component {
  updateFunction = book => {
    this.props.updateFunction(book);
  };

  render = () => {
    return (
      <div className="w-5/6 container mx-auto my-4">
        {this.props.user && this.props.loaded ? (
          <>
            <Scanner
              className="max-w-screen-md container mx-auto"
              onChange={this.updateFunction}></Scanner>
            <BookTable
              history={this.props.history}
              books={this.props.books}></BookTable>
          </>
        ) : this.props.loaded && !this.props.user ? (
          <span className="text-3xl">Log in to start adding books!</span>
        ) : null}
      </div>
    );
  };
}

export default withRouter(Home);
