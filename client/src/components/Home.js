import React from 'react';
import Scanner from './Scanner';
import BookTable from './BookTable2';
import MarketingHome from './MarketingHome';
import { withRouter } from 'react-router-dom';

class Home extends React.Component {
  render = () => {
    return (
      <>
        {this.props.user && this.props.loaded ? (
          <div className="max-w-screen-md container my-4">
            <Scanner
              user={this.props.user}
              className="max-w-screen-md container mx-auto mt-5"
              addBookToGlobalState={this.props.addBookToGlobalState}></Scanner>
            <BookTable
              user={this.props.user}
              history={this.props.history}
              books={this.props.books}></BookTable>
          </div>
        ) : this.props.loaded && !this.props.user ? (
          <MarketingHome></MarketingHome>
        ) : null}
      </>
    );
  };
}

export default withRouter(Home);
