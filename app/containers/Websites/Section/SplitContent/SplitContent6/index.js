import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextBox from '../../../Components/TextBox';

class SplitContent6 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { id, editMode, colum } = this.props;

    const sectionCoulum = colum.map((x) => (
      <div
        key={`split-content-6-colum-${x.id}`}
        className="col-lg-12 col-md-12 col-sm-12 col-xs-12"
      >
        <TextBox
          key={`split-content-6-colum-${id}-${x.id}`}
          id={`split-content-6-colum-${id}-${x.id}`}
          editMode={editMode}
          sectionID={id}
          type={`${x.id}`}
        >{ x.content }</TextBox>
      </div>
    ));

    return (
      <div
        className="split-content-6"
        data-automation-id="section-split-content"
        data-automation-design="split-content-6"
        data-automation-section-id={id}
      >
        <div className="row-spacial">
          { sectionCoulum }
        </div>
      </div>
    );
  }
}

SplitContent6.propTypes = {
  id: PropTypes.number.isRequired,
  editMode: PropTypes.bool,
  colum: PropTypes.array,
};

SplitContent6.defaultProps = {
  editMode: false,
  colum: [],
};

export default SplitContent6;
