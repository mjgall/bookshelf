import React from 'react';
import Copy from '../common/Copy'

export default class ProfileInfoCard extends React.Component {
  render = () => {
    return (
      <div>
        <div class="rounded-lg overflow-hidden shadow w-5/6 mx-auto md:mx-0 md:w-64 md:max-w-md my-3">
          <div class="h-24 w-full bg-blue-400"></div>
          <div class="flex justify-center -mt-16">
            <img
              src={this.props.user.picture}
              class="rounded-full h-32 w-32 border-solid border-white border-2 -mt-3"></img>
          </div>
          <div class="text-center px-3 pb-6 pt-2">
            <h3 class="text-black text-lg bold font-sans">
              {this.props.user.full}
            </h3>
            <p class="mt-1 text-sm font-sans font-light text-grey-dark">
              {this.props.user.email}
            </p>
          </div>
          <div class="flex justify-center pb-3 text-grey-dark">
            <div class="text-center mr-3 border-r pr-3">
              <h2>
                {
                  this.props.books.filter(
                    (book) => book.user_id == this.props.user.id
                  ).length
                }
              </h2>
              <span>Books saved</span>
            </div>
            <div class="text-center">
              {/* <h2>
                      {this.props.members.filter(
                        (membership) =>
                          membership.user_id == this.props.user.id &&
                          membership.invite_accepted
                      ).length}
                    </h2> */}
              <h2>{this.props.books.filter((book) => book.read).length}</h2>
              <span>Books read</span>
            </div>
          </div>
          <div className="mb-3">
          <div className="text-center">Your public shelf link:</div>
            <Copy value={ `${window.location.protocol}//${window.location.host}/shelf/${this.props.user.id}` }></Copy>
            </div>
        </div>
      </div>
    );
  };
}
