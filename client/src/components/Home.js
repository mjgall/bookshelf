import React from 'react';
import Scanner from './Scanner';
import BookTable from './BookTable2';
import MarketingHome from './MarketingHome';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

class Home extends React.Component {
  state = {
    selfOnly: false,
    redirect: queryString.parse(window.location.search).redirect,
  };

  componentDidMount = () => {
    const enabled =
      window.localStorage.getItem('selfOnly') === 'enabled' ? true : false;

    this.setState({ selfOnly: enabled });
  };

  selfOnly = (value) => {
    window.localStorage.setItem('selfOnly', value ? 'enabled' : 'disabled');
    this.setState({ selfOnly: !this.state.selfOnly });
  };
  updateNavReferrer = (i) => {
    this.props.updateNavReferrer(i);
  };

  render = () => {
    return (
      <>
        {this.props.user && this.props.loaded ? (
          <div className="max-w-screen-lg container my-4">
            <Scanner
              user={this.props.user}
              className="max-w-screen-md container mx-auto mt-5"
              addBookToGlobalState={this.props.addBookToGlobalState}></Scanner>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3"></div>
              <label className="md:w-2/3 block text-gray-500">
                <input
                  checked={this.state.selfOnly}
                  onChange={(e) => this.selfOnly(e.target.checked)}
                  className="mr-2 leading-tight"
                  type="checkbox"></input>
                <span className="text-sm"></span>
                Only show my books (not the household's)
              </label>
            </div>
            <BookTable
              selfOnly={this.state.selfOnly}
              members={this.props.members}
              user={this.props.user}
              history={this.props.history}
              // books={this.props.books}
              books={
                this.state.selfOnly
                  ? this.props.books.filter((book) => {
                      if (book.user_id == this.props.user.id) {
                        return book;
                      }
                    })
                  : this.props.books
              }
              userOnly={this.state.selfOnly}></BookTable>
          </div>
        ) : this.props.loaded && !this.props.user ? (
          <MarketingHome
            updateNavReferrer={this.updateNavReferrer}
            redirect={this.state.redirect}
            referrer={this.props?.location?.state?.referrer}
            clearReferrer={this.props.clearReferrer}></MarketingHome>
        ) : null}
      </>
    );
  };
}

export default withRouter(Home);
