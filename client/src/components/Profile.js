import React from 'react';
import axios from 'axios';
import { CheckSquare, XSquare } from '@styled-icons/boxicons-solid';

export default class Profile extends React.Component {
  state = {
    inviteValue: '',
    households: [],
    members: [],
    householdNameValue: '',
    flash: false,
    flashMessage: '',
  };

  componentDidMount = async () => {
    this.setState({
      households: this.props.households,
      members: this.props.members,
    });
  };

  handleInviteChange = (e) => {
    this.setState({ inviteValue: e.target.value });
  };

  handleInviteSubmit = async (householdId) => {
    const response = await axios.post('/api/invitations', {
      invitedEmail: this.state.inviteValue,
      householdId,
    });
    this.setState({ members: [...this.state.members, response.data] });
  };

  handleHouseholdSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post('/api/households', {
      name: this.state.householdNameValue,
      userId: this.props.user.id,
    });
    this.setState({ members: [...this.state.members, response.data] });
    this.setState({ households: [...this.state.households, response.data] });
  };

  handleHouseholdNameChange = async (e) => {
    this.setState({ householdNameValue: e.target.value });
  };

  acceptInvitation = async (id) => {
    const response = await axios.put('/api/invitations', {
      accept: true,
      decline: false,
      id,
    });
    if (response.data) {
      this.moveMembership({ id, membership: response.data, accepted: true });
    }
  };

  declineInvitation = async (id) => {
    const response = await axios.put('/api/invitations', {
      accept: false,
      decline: true,
      id,
    });
    if (response.data) {
      this.moveMembership({ id, membership: response.data, accepted: false });
    }
  };

  moveMembership = (status) => {
    const indexOfMembership = this.state.members.findIndex((membership) => {
      return membership.id == status.id;
    });

    const newMembers = [...this.state.members];
    newMembers.splice(indexOfMembership, 1, status.membership);

    this.setState({
      members: newMembers,
      flash: true,
      flashMessage: status.accepted ? (
        <div
          class="shadow text-sm bg-green-100 border border-green-400 text-green-700 my-2 px-4 py-3 rounded relative"
          role="alert">
          <strong class="font-bold">🏠 </strong>
          <span class="block sm:inline">Accepted!</span>
          <span class="absolute top-0 bottom-0 right-0 px-4 py-2 "></span>
        </div>
      ) : (
        <div
          class="shadow text-sm bg-red-100 border border-red-400 text-red-700 my-2 px-4 py-3 rounded relative"
          role="alert">
          <strong class="font-bold">🏠 </strong>
          <span class="block sm:inline">Declined!</span>
          <span class="absolute top-0 bottom-0 right-0 px-4 py-2 "></span>
        </div>
      ),
    });

    setTimeout(() => this.setState({ flashMessage: false }), 1000);
  };

  deleteHousehold = async (householdId, index) => {
    const response = await axios.delete(`/api/households/${householdId}`);
    if (response.data.affectedRows > 1) {
      const newMembers = [...this.state.members];
      newMembers.splice(index, 1);
      this.setState({ members: newMembers });
    }
  };

  render = () => {
    return (
      <div className="max-w-screen-md container my-4 ">
        {this.state.members.map((member) => {
          if (
            !member.invite_declined &&
            !member.invite_accepted &&
            member.user_id == this.props.user.id
          ) {
            return (
              <div
                class="shadow text-sm bg-blue-100 border border-blue-400 text-blue-700 my-2 px-4 py-3 rounded"
                role="alert">
                <strong class="font-bold">🏠 </strong>
                <span class="block sm:inline">
                  {member.inviter_full} ({member.inviter_email}) invited you to
                  their {member.household_name} household.
                </span>

                <span class="float-right">
                  <CheckSquare
                    size="2em"
                    className="  cursor-pointer text-green-400"
                    onClick={() =>
                      this.acceptInvitation(member.id)
                    }></CheckSquare>
                  <XSquare
                    size="2em"
                    className="cursor-pointer text-red-400"
                    onClick={() => this.declineInvitation(member.id)}></XSquare>
                </span>
              </div>
            );
          }
        })}
        {this.state.flash ? <div>{this.state.flashMessage}</div> : null}
        <div className="w-5/6 md:w-full container">
          <div className="text-3xl font-bold">Households</div>
          <form
            onSubmit={this.handleHouseholdSubmit}
            class="w-full md:max-w-md">
            <div class="flex items-center border-b border-b-1 border-blue-500 ">
              <input
                class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 pr-2 leading-tight focus:outline-none"
                type="text"
                placeholder="New household name"
                value={this.state.householdNameValue}
                onChange={this.handleHouseholdNameChange}
                aria-label="Household Name"></input>
              <button
                class="bg-blue-500 hover:bg-blue-700 text-white my-1 mx-1 py-1 px-4 rounded focus:outline-none focus:shadow-outlineundefined"
                type="submit">
                Create
              </button>
            </div>
          </form>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 my-2 md:w-full w-5/6 container">
          {this.state.members.map((membership, index) => {
            if (
              membership.invite_accepted &&
              membership.user_id == this.props.user.id
            ) {
              return (
                <div className="border border-gray-400 shadow rounded-lg p-4">
                  <div className="text-2xl font-bold mb-3 flex justify-between items-center">
                    <span>{membership.household_name}</span>
                    {membership.is_owner ? (
                      <XSquare
                        size="1em"
                        className="cursor-pointer text-red-600"
                        onClick={async () =>
                          this.deleteHousehold(membership.household_id, index)
                        }></XSquare>
                    ) : null}
                  </div>
                  <form
                    onSubmit={(e) => e.preventDefault()}
                    class="w-full max-w-md">
                    {membership.is_owner ? (
                      <div class="flex items-center border-b border-b-2 border-blue-500 ">
                        <input
                          class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 pr-2 leading-tight focus:outline-none"
                          type="text"
                          placeholder="User email to invite"
                          value={this.state.inviteValue}
                          onChange={this.handleInviteChange}
                          aria-label="Email"></input>
                        <button
                          onClick={() =>
                            this.handleInviteSubmit(membership.household_id)
                          }
                          class="bg-blue-500 hover:bg-blue-700 text-white my-1 mx-1 py-1 px-4 rounded focus:outline-none focus:shadow-outlineundefined"
                          type="submit">
                          Invite
                        </button>
                      </div>
                    ) : null}
                  </form>
                  <ul>
                    {this.state.members.map((member) => {
                      if (
                        member.household_id == membership.household_id &&
                        member.invite_accepted
                      ) {
                        return (
                          <li className="flex my-2">
                            <img
                              class="h-12 w-12 rounded-full"
                              src={member.picture}
                            />
                            <span className="ml-5 mt-3">
                              {' '}
                              {member.member_email}
                            </span>
                          </li>
                        );
                      }
                    })}
                  </ul>
                  {membership.is_owner ? (
                    <>
                      {this.state.members.some(
                        (members) =>
                          members.invite_accepted &&
                          members.household_id == membership.household_id
                      ) ? (
                        <div>Awaiting Response</div>
                      ) : null}

                      <ul>
                        {this.state.members.map((member) => {
                          if (
                            !member.invite_accepted &&
                            !member.invite_declined &&
                            member.household_id == membership.household_id
                          )
                            return (
                              <li className="flex my-2">
                                <img
                                  class="h-12 w-12 rounded-full"
                                  src={member.picture}
                                />
                                <span className="ml-5 mt-3">
                                  {' '}
                                  {member.member_email}
                                </span>
                              </li>
                            );
                        })}
                      </ul>
                    </>
                  ) : null}
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  };
}
