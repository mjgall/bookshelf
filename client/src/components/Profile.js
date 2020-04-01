import React from 'react';
import axios from 'axios';

export default class Profile extends React.Component {
  state = { inviteValue: '', households: [] };

  componentDidMount = async () => {
    const households = await axios.get('/api/households');
    this.setState({ households: households.data });
  };

  handleInviteChange = e => {
    this.setState({ inviteValue: e.target.value });
  };

  handleInviteSubmit = async e => {
    e.preventDefault();
    const response = await axios.post('/api/households', {
      invitedEmail: this.state.inviteValue
    });
    if (response.data.invited_email) {
      this.setState({households: [...this.state.households, response.data], inviteValue: ''})
    }
  };

  render = () => {
    return (
      <div className="max-w-screen-md container my-4">
        <form onSubmit={this.handleInviteSubmit} class="w-full max-w-md">
          <div class="flex items-center border-b border-b-2 border-blue-500 ">
            <input
              class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text"
              placeholder="Email"
              value={this.state.inviteValue}
              onChange={this.handleInviteChange}
              aria-label="Email"></input>
            <button
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold my-2 mx-1 py-1 px-4 rounded focus:outline-none focus:shadow-outlineundefined"
              type="submit">
              Invite
            </button>
          </div>
        </form>
        <div className="text-lg">
          Waiting for household invitation response from:
        </div>

        <ul>
          {this.state.households.map(household => {
            if (!household.accepted) {
              return <li>{household.invited_email}</li>;
            }
          })}
        </ul>
        <div className="text-lg">
          You're in a household with:
        </div>

        <ul>
          {this.state.households.map(household => {
            if (household.accepted) {
              return <li>{household.invited_email}</li>;
            }
          })}
        </ul>
      </div>
    );
  };
}
