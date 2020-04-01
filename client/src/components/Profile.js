import React from 'react';

export default class Profile extends React.Component {

  render = () => {
    return (
      <div>
        <div className="text-xl">{this.props.user.full}</div>
      </div>
    );
  };
}
