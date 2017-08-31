import React from 'react';
import PropTypes from 'prop-types';

import { decode } from '../../../../utils/html';

import Editor from '../../../PageEditor/Components/ComponentEditors/TextBox';

class TextBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { id, editMode, sectionID, sectionGroup, type } = this.props;
    if (editMode) {
      return (<Editor
        id={id}
        sectionID={sectionID}
        sectionGroup={sectionGroup}
        className="component-text-box"
        style={this.props.style}
        type={type}
      >{this.props.children}</Editor>);
    }
    return (
      <div
        className="component-text-box"
        dangerouslySetInnerHTML={{ __html: decode(this.props.children) }}  // eslint-disable-line
        style={this.props.style}
      />
    );
  }
}

TextBox.propTypes = {
  id: PropTypes.string.isRequired,
  editMode: PropTypes.bool.isRequired,
  children: PropTypes.string.isRequired,
  style: PropTypes.object,
  sectionID: PropTypes.number,
  sectionGroup: PropTypes.string,
  type: PropTypes.string,
};

TextBox.defaultProps = {
  style: {},
  sectionID: 0,
  sectionGroup: 'Body',
  type: '',
};

export default TextBox;
