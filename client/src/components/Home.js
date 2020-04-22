import React from 'react';
import Scanner from './Scanner';
import BookTable from './BookTable2';
import MarketingHome from './MarketingHome';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import Select from 'react-select';

class Home extends React.Component {
  state = {
    selfOnly: false,
    redirect: queryString.parse(window.location.search).redirect,
    householdSelect: { value: null, label: null },
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

  filterPersonalBooks = (books) => {
    if (this.state.selfOnly) {
      return books.filter((book) => book.user_id == this.props.user.id);
    } else return books;
  };

  filterHouseholdBooks = (books) => {
    if (
      this.state.householdSelect.value == 'all' ||
      this.state.householdSelect.value == null
    ) {
      return books;
    }

    const newBooks = books.filter((book) => {
      return (
        book.household_id == null ||
        book.household_id == this.state.householdSelect.value
      );
    });

    return newBooks;
  };

  filterBooks = (books) => {
    return this.state.selfOnly
      ? this.filterPersonalBooks(books)
      : this.filterHouseholdBooks(books);
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
              <input
                checked={this.state.selfOnly}
                onChange={(e) => this.selfOnly(e.target.checked)}
                className="mr-2 leading-tight"
                type="checkbox"></input>
              <label className="md:w-2/3 block text-gray-500">
                <span className="text-sm"></span>
                Only show my books (not the household's)
              </label>

              {this.state.selfOnly ? null : (
                <>
                  <Select
                    placeholder='Household...'
                    blurInputOnSelect
                    isSearchable={false}
                    className="w-full"
                    defaultValue={{ value: 'all', label: 'All' }}
                    options={[
                      { value: 'all', label: 'All' },
                      ...this.props.households.map((household) => ({
                        value: household.household_id,
                        label: household.name,
                      })),
                    ]}
                    value={this.state.householdSelect}
                    onChange={(selected) => {
                      this.setState({ householdSelect: selected });
                    }}></Select>
                  {/* <select
                      onChange={(e) => {
                        this.setState({ householdSelect: e.target.value });
                      }}
                      id="households">
                      <option value="all">All</option>
                      {this.props.households.map((household) => (
                        <option value={Number(household.household_id)}>
                          {household.name}
                        </option>
                      ))}
                    </select> */}
                </>
              )}
            </div>
            <BookTable
              householdSelect={this.state.householdSelect}
              selfOnly={this.state.selfOnly}
              householdSelect={this.state.householdSelect}
              members={this.props.members}
              user={this.props.user}
              history={this.props.history}
              books={this.filterBooks(this.props.books)}
              // books={
              //   this.state.selfOnly
              //     ? this.props.books.filter((book) => {
              //         if (book.user_id == this.props.user.id) {
              //           return book;
              //         }
              //       })
              //     : this.props.books
              // }
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
