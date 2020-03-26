import React from 'react';

export default class Footer extends React.Component {
  render = () => {
    return (
      <div className="py-8 bg-blue-500 w-full bottom-0">
        {this.props.children}
      </div>
    )
  }
}