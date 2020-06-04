import React, { useEffect } from 'react';
import axios from 'axios';

import {
  CheckSquare,
  XSquare,
  PlusSquare,
  ChevronDownSquare,
} from '@styled-icons/boxicons-solid';

import ProfleInfoCard from './ProfileInfoCard';
import Confirm from '../common/Confirm';
import { Context } from '../globalContext';

const Profile = (props) => {
  const state = {
    inviteValues: [],
    households: [],
    members: [],
    householdNameValue: '',
    flash: false,
    flashMessage: '',
    alert: false,
    alertMessage: '',
    alertNoAction: false,
  };

  useEffect(() => {}, []);

  const componentDidMount = async () => {
    this.setState({
      households: this.props.households,
      members: this.props.members,
      inviteValues: this.props.members.map((member) => {
        return '';
      }),
    });
  };

  const handleInviteChange = (e, index) => {
    this.setState({
      inviteValues: this.state.inviteValues.map((inviteValue, i) => {
        if (i == index) {
          return e.target.value;
        } else {
          return inviteValue;
        }
      }),
    });
  };

  const handleInviteSubmit = async (householdId, index) => {
    const response = await axios.post('/api/invitations', {
      invitedEmail: this.state.inviteValues[index],
      householdId,
    });
    if (response.data.success == false) {
      this.setState({
        alert: true,
        alertMessage:
          'No user with that email found - would you like to invite them to Bookself?',
        affectedHouseholdIndex: index,
      });
    } else {
      //invite user to household
      const emailResponse = await axios.post('/api/email', {
        recipientAddress: this.state.inviteValues[index],
        // recipientAddress: 'mike.gallagh@gmail.com',
        subject: `🏠 You've been invited to join a household!`,
        body: `<p>${this.props.user.first} (${this.props.user.email}) invited you to their household to share your books at bookshelf.mikegallagher.app.</p><a href="https://bookshelf.mikegallagher.app/profile">Accept here</a>`,
      });

      this.setState({
        members: [...this.state.members, response.data],
        invitedUserPhoto: response.data.invited_photo,
        invitedUserEmail: response.data.invited_email,
      });
    }
  };
  const handleBookshelfInviteSend = async (invitedEmailAddress, index) => {
    const response = await axios.post('/api/email', {
      recipientAddress: invitedEmailAddress,
      // recipientAddress: 'mike.gallagh@gmail.com',
      subject: `📚 You've been invited to join Bookshelf!`,
      body: `<p>${this.props.user.full} (${this.props.user.email}) invited you to join bookshelf.mikegallagher.app</p><a href="https://bookshelf.mikegallagher.app">bookshelf.mikegallagher.app</a>`,
    });
    if (response.data.success) {
      this.setState({
        alertNoAction: true,
        alert: false,
        alertMessage: `Invitation sent to ${invitedEmailAddress}`,
      });
      setTimeout(() => {
        this.setState({ alertNoAction: false });
      }, 1200);
    }
  };

  const handleHouseholdSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post('/api/households', {
      name: this.state.householdNameValue,
      userId: this.props.user.id,
    });
    this.setState({
      households: [...this.state.households, response.data],
      members: [...this.state.members, response.data],
      inviteValues: [...this.state.inviteValues, ''],
      householdNameValue: '',
      addHousehold: false,
    });
  };

  const handleHouseholdNameChange = async (e) => {
    this.setState({ householdNameValue: e.target.value });
  };

  const acceptInvitation = async (id) => {
    const response = await axios.put('/api/invitations', {
      accept: true,
      decline: false,
      id,
    });
    if (response.data) {
      this.moveMembership({ id, membership: response.data, accepted: true });
    }
  };

  const declineInvitation = async (id) => {
    const response = await axios.put('/api/invitations', {
      accept: false,
      decline: true,
      id,
    });
    if (response.data) {
      this.moveMembership({ id, membership: response.data, accepted: false });
    }
  };

  const moveMembership = (status) => {
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
          className='w-5/6 md:w-full container  shadow text-sm bg-green-100 border border-green-400 text-green-700 my-2 px-4 py-3 rounded relative'
          role='alert'>
          <strong className='font-bold'>🏠 </strong>
          <span className='block sm:inline'>Accepted!</span>
          <span className='absolute top-0 bottom-0 right-0 px-4 py-2 '></span>
        </div>
      ) : (
        <div
          className='w-5/6 md:w-full container shadow text-sm bg-red-100 border border-red-600 text-red-700 my-2 px-4 py-3 rounded relative'
          role='alert'>
          <strong className='font-bold'>🏠 </strong>
          <span className='block sm:inline'>Declined!</span>
          <span className='absolute top-0 bottom-0 right-0 px-4 py-2 '></span>
        </div>
      ),
    });

    setTimeout(() => this.setState({ flashMessage: false }), 1000);
  };

  const deleteHousehold = async (householdId, index) => {
    const response = await axios.delete(`/api/households/${householdId}`);
    if (response.data.affectedRows > 1) {
      const newMembers = [...this.state.members];
      newMembers.splice(index, 1);
      this.setState({ members: newMembers });
    }
  };

  const removeMember = async (householdId, userId, index) => {
    const response = await axios.put('/api/invitations', {
      householdId,
      userId,
      remove: true,
    });
    if (response.data.affectedRows > 0) {
      const newMembers = [...this.state.members];
      newMembers.splice(index, 1);
      this.setState({ members: newMembers });
    }
  };

  const canRemoveMember = (member, membership, index) => {
    return member.user_id == this.props.user.id ? null : membership.is_owner ? (
      <Confirm
        position='left'
        tipContent='Remove member'
        onConfirm={() =>
          this.removeMember(membership.household_id, member.user_id, index)
        }>
        <XSquare className='text-red-600' size='1.5rem'></XSquare>
      </Confirm>
    ) : null;
  };

  return (
    <div className='max-w-screen-lg container my-4 '>
      <div
        className='md:grid grid-cols-2'
        style={{ gridTemplateColumns: '25% 70%', gridColumnGap: '5%' }}>
        <ProfleInfoCard></ProfleInfoCard>
        <div>
          {this.state.alertNoAction ? (
            <div
              className='w-5/6 md:w-full container bg-red-100 border border-red-600 text-red-700 px-4 py-3 rounded relative'
              role='alert'>
              <span className='block sm:inline'>{this.state.alertMessage}</span>
            </div>
          ) : null}
          {this.state.alert ? (
            <div
              className='w-5/6 md:w-full container bg-red-100 border border-red-600 text-red-700 px-4 py-3 rounded relative'
              role='alert'>
              <span className='block sm:inline'>{this.state.alertMessage}</span>
              <span className='float-right'>
                <CheckSquare
                  size='2em'
                  className='cursor-pointer text-green-400'
                  onClick={() =>
                    this.handleBookshelfInviteSend(
                      this.state.inviteValues[this.state.affectedHouseholdIndex]
                    )
                  }></CheckSquare>
                <XSquare
                  size='2em'
                  color='red'
                  onClick={() => this.setState({ alert: false })}></XSquare>
              </span>
            </div>
          ) : null}
          {this.state.members.map((member, index) => {
            if (
              !member.invite_declined &&
              !member.invite_accepted &&
              member.user_id == this.props.user.id
            ) {
              return (
                <div
                  className='w-5/6 md:w-full container shadow text-sm bg-blue-100 border border-blue-400 text-blue-700 my-2 px-4 py-3 rounded md:flex justify-between'
                  role='alert'>
                  <div className='text-center md:text-left'>
                    <strong className='font-bold'>🏠 </strong>
                    {member.inviter_full} ({member.inviter_email}) invited you
                    to their {member.household_name} household.
                  </div>

                  <div className='md:mt-0 mt-2'>
                    <CheckSquare
                      size='2em'
                      className='w-1/2 cursor-pointer text-green-400'
                      onClick={() =>
                        this.acceptInvitation(member.id)
                      }></CheckSquare>
                    <XSquare
                      size='2em'
                      className='w-1/2 cursor-pointer text-red-600'
                      onClick={() =>
                        this.declineInvitation(member.id)
                      }></XSquare>
                  </div>
                </div>
              );
            }
          })}
          {this.state.flash ? <div>{this.state.flashMessage}</div> : null}
          <div className='w-5/6 md:w-full container'>
            <div className='flex items-center w-full justify-between'>
              <div className='text-3xl font-bold'>Households</div>
              {this.state.addHousehold ? (
                <ChevronDownSquare
                  onClick={() => {
                    this.setState({ addHousehold: false });
                  }}
                  size='2em'
                  className='cursor-pointer text-green-400'></ChevronDownSquare>
              ) : (
                <PlusSquare
                  onClick={() => {
                    this.setState({ addHousehold: true });
                  }}
                  size='2em'
                  className='cursor-pointer text-green-400'></PlusSquare>
              )}
            </div>
            {this.state.addHousehold ? (
              <form onSubmit={this.handleHouseholdSubmit} className='w-full'>
                <div className='flex items-center border-b border-b-1 border-blue-500 '>
                  <input
                    className='appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 pr-2 leading-tight focus:outline-none'
                    type='text'
                    placeholder='New household name'
                    value={this.state.householdNameValue}
                    onChange={this.handleHouseholdNameChange}
                    aria-label='Household Name'></input>
                  <button
                    className='bg-blue-500 hover:bg-blue-700 text-white my-1 mx-1 py-1 px-4 rounded focus:outline-none focus:shadow-outlineundefined'
                    type='submit'>
                    Create
                  </button>
                </div>
              </form>
            ) : null}
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-2 my-2 md:w-full w-5/6 container'>
            {this.state.members.map((membership, index) => {
              if (
                membership.invite_accepted &&
                membership.user_id == this.props.user.id
              ) {
                return (
                  <div className='border border-gray-400 shadow rounded-lg p-4'>
                    <div className='text-2xl font-bold mb-3 flex justify-between items-center'>
                      <span className='overflow-x-hidden'>
                        {membership.household_name}
                      </span>
                      {membership.is_owner ? (
                        <Confirm
                          position='left'
                          tipContent='Delete household'
                          onConfirm={() =>
                            this.deleteHousehold(membership.household_id, index)
                          }>
                          <XSquare
                            size='2rem'
                            className='text-red-600'></XSquare>
                        </Confirm>
                      ) : null}
                    </div>
                    <form
                      onSubmit={(e) => e.preventDefault()}
                      className='w-full max-w-md'>
                      {membership.is_owner ? (
                        <div className='flex items-center border-b border-b-2 border-blue-500 '>
                          <input
                            className='appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 pr-2 leading-tight focus:outline-none'
                            type='text'
                            placeholder='User email to invite'
                            value={this.state.inviteValues[index]}
                            onChange={(e) => this.handleInviteChange(e, index)}
                            aria-label='Email'></input>
                          <button
                            onClick={() =>
                              this.handleInviteSubmit(
                                membership.household_id,
                                index
                              )
                            }
                            className='bg-blue-500 hover:bg-blue-700 text-white my-1 mx-1 py-1 px-4 rounded focus:outline-none focus:shadow-outlineundefined'
                            type='submit'>
                            Invite
                          </button>
                        </div>
                      ) : null}
                    </form>
                    <div>
                      {this.state.members.map((member, index) => {
                        if (
                          member.household_id == membership.household_id &&
                          member.invite_accepted
                        ) {
                          return (
                            <div className='flex my-2 items-center '>
                              <img
                                className='h-12 w-12 rounded-full'
                                src={member.picture}
                              />
                              <div className='ml-5 overflow-x-hidden'>
                                {member.user_id == this.props.user.id
                                  ? 'You'
                                  : member.member_email || member.email}
                              </div>
                              <div className='ml-auto'>
                                {this.canRemoveMember(
                                  member,
                                  membership,
                                  index
                                )}
                              </div>
                            </div>
                          );
                        }
                      })}
                    </div>
                    {membership.is_owner ? (
                      <>
                        {this.state.members
                          .filter((member) => {
                            return (
                              member.user_id != this.props.user.id &&
                              member.household_id == membership.household_id
                            );
                          })
                          .some(
                            (members) =>
                              !members.invite_accepted &&
                              !members.invite_declined
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
                                <li className='flex my-2'>
                                  <img
                                    className='h-12 w-12 rounded-full'
                                    src={
                                      member.picture ||
                                      this.state.invitedUserPhoto
                                    }
                                  />
                                  <span className='ml-5 mt-3'>
                                    {member.member_email ||
                                      this.state.invitedUserEmail}
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
      </div>
    </div>
  );
};

export default Profile;
