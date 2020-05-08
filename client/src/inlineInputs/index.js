import React, { useState, useEffect } from 'react';
import InlineEdit from '@atlaskit/inline-edit';

const TextAreaReadView = (props) => {
  return (
    <textarea
      {...props}
      className="resize border rounded focus:outline-none focus:shadow-outline"></textarea>
  );
};

export class Textarea extends React.Component {

  state = { value: '' };

  componentDidMount = () => {
    console.log(this.props)
    this.setState({ value: this.props.value });
  };

  render = () => {
    console.log(this.state)
    return (
      <InlineEdit
        {...this.props}
        defaultValue={this.state.value}
        editView={(fieldProps, ref) => (
          <TextAreaReadView
            {...fieldProps}
            value={this.state.value}
            onChange={(e) =>
              this.setState({ value: e.target.value })
            }></TextAreaReadView>
        )}
        readView={() => <div>{this.state.value}</div>}></InlineEdit>
    );
  };
}
