import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './styles.css';

import TextBox from '../../../Components/TextBox';

class Faq1 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { id, editMode, title, faqList, setting } = this.props;

    const sectionTitle = setting.title.show ? (
      <div style={{ backgroundColor: setting.title.backgroundColor }}>
        <TextBox
          id={`faq-1-title-${id}`}
          editMode={editMode}
          sectionID={id}
          type="title"
        >{title}</TextBox>
      </div>
    ) : null;

    const sectionFaqList = (
      <div className="row-spacial faq-content">
        {
          faqList.map((x) => (
            <div
              key={`faq-1-faq-list-col-${id}-${x.id}`}
              className="col-md-12 padding-top padding-bottom"
            >
              <TextBox
                key={`faq-1-faq-list-${id}-${x.id}`}
                id={`faq-1-faq-list-${id}-${x.id}`}
                editMode={editMode}
                sectionID={id}
                type="faqList"
              >{x.content}</TextBox>
            </div>
          ))
        }
      </div>
    );

    return (
      <div
        className="faq-1"
        data-automation-id="section-faq"
        data-automation-design="faq-1"
        data-automation-section-id={id} // eslint-disable-line
      >
        { sectionTitle }
        { sectionFaqList }
      </div>
    );
  }
}

Faq1.propTypes = {
  id: PropTypes.number.isRequired,
  editMode: PropTypes.bool,
  title: PropTypes.string,
  faqList: PropTypes.array,
  setting: PropTypes.object,
};

Faq1.defaultProps = {
  editMode: false,
  title: '',
  faqList: [],
  setting: {},
};

export default Faq1;
