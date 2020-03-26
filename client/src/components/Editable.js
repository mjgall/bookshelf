import React from 'react';

export default function contentEditable(WrappedComponent) {
  return class extends React.Component {
    state = {
      editing: false,
      saved: false
    };

    toggleEdit = e => {
      e.stopPropagation();
      if (this.state.editing) {
        this.cancel();
      } else {
        this.edit();
      }
    };

    edit = () => {
      this.setState(
        {
          editing: true
        },
        () => {
          this.domElm.focus();
        }
      );
    };

    save = () => {
      this.setState(
        {
          editing: false,
          saved: true
        },
        () => {
          if (this.props.onSave && this.isValueChanged()) {
            console.log('Value is changed', this.domElm.textContent);
          }
        }
      );
      setTimeout(() => {
        this.setState({ saved: false });
      }, 1000);
      this.props.update(this.domElm.textContent, this.props.name);
    };

    cancel = () => {
      this.setState({
        editing: true
      });
    };

    isValueChanged = () => {
      return this.props.value !== this.domElm.textContent;
    };

    handleKeyDown = e => {
      const { key } = e;
      switch (key) {
        case 'Enter':
          this.save();
          break;
      }
    };

    render() {
      let editOnClick = true;
      const { editing } = this.state;
      if (this.props.editOnClick !== undefined) {
        editOnClick = this.props.editOnClick;
      }

      return (
        <div>
          {this.state.saved ? (
            <div className="text-red-600 text-xl">Saved</div>
          ) : null}

          <WrappedComponent
            className={editing ? 'editing' : { ...this.props.className }}
            onClick={editOnClick ? this.toggleEdit : undefined}
            // onClick={editOnClick ? this.edit : undefined}
            contentEditable={editing}
            ref={domNode => {
              this.domElm = domNode;
            }}
            onBlur={() => {
              this.setState({ editing: false });
            }}
            onKeyDown={this.handleKeyDown}
            {...this.props}>
            {this.props.value}
          </WrappedComponent>
          {editing ? (
            <div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 cursor-pointer mx-1 rounded"
                onClick={this.save}
                onTouchStart={this.save}>
                Save
              </button>
            </div>
          ) : null}
        </div>
      );
    }
  };
}
