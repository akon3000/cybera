import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextBox from '../../../Components/TextBox';

class SplitContent3 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { id, editMode, colum } = this.props;

    const sectionColum = colum.map((x) => (
      <div
        key={`split-content-6-colum-${x.id}`}
        className="col-lg-4 col-md-4 col-sm-12 col-xs-12"
      >
        <TextBox
          key={`split-content-3-colum-${id}-${x.id}`}
          id={`split-content-3-colum-${id}-${x.id}`}
          editMode={editMode}
          sectionID={id}
          type={`${x.id}`}
        >{ x.content }</TextBox>
      </div>
    ));

    return (
      <div
        className="split-content-3"
        data-automation-id="section-split-content"
        data-automation-design="split-content-3"
        data-automation-section-id={id}
      >
        <div className="row-spacial">
          { sectionColum }
        </div>
      </div>
    );
  }
}

SplitContent3.propTypes = {
  id: PropTypes.number.isRequired,
  editMode: PropTypes.bool,
  colum: PropTypes.array,
};

SplitContent3.defaultProps = {
  editMode: false,
  colum: [],
};

export default SplitContent3;
