import React from 'react';
import Scanner from './Scanner';
import BookTable from './BookTable2';
import MarketingHome from './MarketingHome';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import Select from 'react-select';
import _ from 'lodash';

class Home extends React.Component {
  state = {
    selfOnly: false,
    redirect: queryString.parse(window.location.search).redirect,
    householdSelect: { value: 'none', label: 'Select household...' },
    books: this.props.books,
    ownerSelect: 'all',
  };

  componentDidMount = () => {
    this.getOwners(this.props.members);
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
    if (this.state.householdSelect.value == null) {
      return books;
    } else if (this.state.householdSelect.value == 'none') {
      return books.filter((book) => book.user_id == this.props.user.id);
    } else if (this.state.householdSelect.value == 'all') {
      return books;
    } else if (this.state.householdSelect.value == 'all' && this.state.ownerSelect.value == 'all') {
      return books
    } else {
      const newBooks = books.filter((book) => {
        return (
          book.household_id == this.state.householdSelect.value ||
          book.household_id == null
        );
      });
      return newBooks;
    }
  };

  filterBooks = (books) => {
    if (this.state.selfOnly) {
      return this.filterPersonalBooks(books);
    } else {
      return this.filterHouseholdBooks(books);
    }
  };

  handleHouseholdChange = (selected) => {
    this.getOwners(this.props.members, selected.value);
    this.setState({ householdSelect: selected, ownerSelect: 'all' });
  };

  handleOwnerChange = (selected) => {
    this.setState({ ownerSelect: selected });
  };

  getOwners = (members, householdId = null) => {
    if (!householdId || householdId == 'all' || householdId == 'none') {
      this.setState({
        owners: [
          { value: 'all', label: 'All' },

          ..._.uniqBy(members, 'user_id').map((owner) => {
            return { value: owner.user_id, label: owner.member_first };
          }),
        ],
      });
    } else {
      this.setState({
        owners: [
          { value: 'all', label: 'All' },
          ...[...new Set(members)]
            .filter((owner) => owner.household_id == householdId)
            .map((owner) => {
              return { value: owner.user_id, label: owner.member_first };
            }),
        ],
      });
    }
  };

  //1. We need to get all of the possible owners in a format where the name of the owner is available by the id
  //2. We need to update the available options list every time the <Select> input changes ( in handleHouseholdChange() )

  render = () => {
    return (
      <>
        {this.props.user && this.props.loaded ? (
          <div className="max-w-screen-lg container my-4">
            <Scanner
              user={this.props.user}
              className="max-w-screen-lg container mx-auto mt-5"
              addBookToGlobalState={this.props.addBookToGlobalState}></Scanner>
            <div className="max-w-screen-lg mx-auto mb-6 grid md:grid-cols-2 md:gap-2 grid-cols-1 row-gap-2">
              <Select
                isOptionDisabled={(option) => option.value == 'no-households'}
                placeholder="Household..."
                blurInputOnSelect
                isSearchable={false}
                className="w-full container"
                options={[
                  { value: 'none', label: `⛔ None (Only your own books)` },
                  this.props.households.length == 0
                    ? {
                        value: 'no-households',
                        label: `🏠 You don't have any households! Add one from Profile`,
                      }
                    : this.props.households.length == 1
                    ? this.props.households.map((household) => {
                        return {
                          value: household.household_id,
                          label: `🏠 ${household.name}`,
                        };
                      })
                    : { value: 'all', label: `🏠 All households` },
                  ...this.props.households.map((household) => ({
                    value: household.household_id,
                    label: `🏠 ${household.name}`,
                  })),
                ]}
                value={this.state.householdSelect}
                onChange={this.handleHouseholdChange}></Select>
              {this.state.householdSelect.value == 'none' ? null : (
                <Select
                  isOptionDisabled={(option) => option.value == 'no-households'}
                  placeholder="Owner..."
                  blurInputOnSelect
                  isSearchable={false}
                  className="w-full container"
                  options={this.state.owners}
                  value={this.state.ownerSelect}
                  onChange={this.handleOwnerChange}></Select>
              )}
            </div>
            <BookTable
              ownerFilterValue={this.state?.ownerSelect?.label}
              householdSelect={this.state.householdSelect}
              selfOnly={this.state.selfOnly}
              householdSelect={this.state.householdSelect}
              members={this.props.members}
              user={this.props.user}
              history={this.props.history}
              books={this.filterBooks(this.state.books)}
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
