import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid';

import styles from './styles.css';

import Dialog from '../Dialog';
import { PositiveButton, NegativeButton } from '../Dialog/Buttons';

import {
  hideHyperLink,
  setHyperLink,
} from '../../actions';

class HyperLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      target: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
        nextProps.popup === 'showHyperLink' &&
        nextProps.linkData !== this.props.linkData &&
        nextProps.linkData !== false
    ) {
      this.setState({
        url: nextProps.linkData.link.url,
        target: nextProps.linkData.link.target,
      });
    }
  }

  render() {
    const { popup, onClose, onSetHyperLink } = this.props;
    return (
      <Dialog
        title="Hyper Link"
        open={popup === 'showHyperLink'}
        onClose={() => onClose()}
        contentStyle={{ width: '620px' }}
        actions={[
          <PositiveButton
            className={styles.btnHyperLinkSave}
            onClick={() => onSetHyperLink({
              id: this.props.linkData.id,
              imageType: this.props.linkData.imageType,
              sectionID: this.props.linkData.sectionID,
              link: { url: this.state.url, target: this.state.target },
            })}
          > Save </PositiveButton>,
          <NegativeButton onClick={() => onClose()}>Cancel</NegativeButton>,
        ]}
      >
        <Row middle="md" className="padding-bottom">
          <Col md={2} className="text-center" xsOffset={1}>URL</Col>
          <Col md={7}>
            <TextField
              className={styles.fieldStyles}
              value={this.state.url}
              type="text"
              name="url"
              onChange={(ev) => this.setState({ url: ev.target.value })}
            />
          </Col>
        </Row>

        <Row middle="md">
          <Col md={2} className="text-center" xsOffset={1}>Target</Col>
          <Col md={7}>
            <SelectField
              value={this.state.target}
              className={styles.fieldStyles}
              fullWidth={Boolean(true)}
              onChange={(ev, index, value) => this.setState({ target: value })}
            >
              <MenuItem value="_blank" primaryText="In new window/tab" />
              <MenuItem value="_parent" primaryText="In same window/tab" />
            </SelectField>
          </Col>
        </Row>

        <div className={styles.hr} />

        <Row>
          <Col xs={12} className={styles.note}>
            {
              `
              Note: To add external link, please include "http://" front of the link. For example, "http://external_website.com"
              To add internal link, please add the link part following "/". For example, "/internal_link.com"
              `
            }
          </Col>
        </Row>
      </Dialog>
    );
  }
}

HyperLink.propTypes = {
  popup: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
  onClose: PropTypes.func.isRequired,
  onSetHyperLink: PropTypes.func.isRequired,
  linkData: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
};

HyperLink.defaultProps = {};

const mapStateToProps = (reducer) => {
  const state = reducer.get('pageEditor');
  return {
    popup: state.get('popup'),
    linkData: state.get('hyperLinkData') || false,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onClose: () => dispatch(hideHyperLink()),
  onSetHyperLink: (link) => dispatch(setHyperLink(link)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HyperLink);
