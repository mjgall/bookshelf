import React from 'react';
import Scanner from './Scanner';
import BookTable from './BookTable2';
import MarketingHome from './MarketingHome';
import { withRouter } from 'react-router-dom';

class Home extends React.Component {
  updateFunction = book => {
    this.props.updateFunction(book);
  };

  render = () => {
    return (
      <>
        {this.props.user && this.props.loaded ? (
          <div className="max-w-screen-md container my-4">
            <Scanner
              className="max-w-screen-md container mx-auto mt-5"
              onChange={this.updateFunction}></Scanner>
            <BookTable
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
