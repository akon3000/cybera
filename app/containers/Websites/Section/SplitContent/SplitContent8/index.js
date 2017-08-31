import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextBox from '../../../Components/TextBox';

class SplitContent8 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { id, colum, editMode } = this.props;

    const sectionColum = colum.map((x) => (
      <div
        key={`split-content-8-colum-${id}-${x.id}`}
        className="col-lg-6 col-md-6 col-sm-12 col-xs-12"
      >
        <TextBox
          key={`split-content-8-colum-${id}-${x.id}`}
          id={`split-content-8-colum-${id}-${x.id}`}
          editMode={editMode}
          sectionID={id}
          type={`${x.id}`}
        >{ x.content }</TextBox>
      </div>
    ));

    return (
      <div
        className="split-content-8"
        data-automation-id="section-split-content"
        data-automation-design="split-content-8"
        data-automation-section-id={id}
      >
        <div className="row-spacial">
          { sectionColum }
        </div>
      </div>
    );
  }
}

SplitContent8.propTypes = {
  id: PropTypes.number.isRequired,
  editMode: PropTypes.bool,
  colum: PropTypes.array,
};

SplitContent8.defaultProps = {
  editMode: false,
  colum: [],
};

export default SplitContent8;
