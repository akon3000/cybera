import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MenuItem from 'material-ui/MenuItem';
import { Row, Col } from 'react-flexbox-grid';
import { Field, reduxForm } from 'redux-form/immutable';

import styles from './styles.css';
import { apiUrl } from '../../../../config';
import request from '../../../../utils/request';
import Loading from '../../../../components/Loading';
import Button from '../../../../components/Button';
import Select from '../../../../components/Select';

class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      currency: [],
      WebsiteCurrency: {},
    };
  }

  componentWillMount() {
    let loadA = false;
    let loadB = false;

    request.get(`${apiUrl}/Currency/${localStorage.getItem('websiteID')}`, {}, (response) => {
      if (!response.error) {
        if (response.data) {
          this.setState({ WebsiteCurrency: response.data.WebsiteCurrency }, () => {
            this.props.initialize({
              Country: this.state.WebsiteCurrency.Id,
            });
          });
        }
      }
      loadB = true;
      if (loadA && loadB) this.setState({ loading: false });
    });
    request.get(`${apiUrl}/Currency`, {}, (response) => {
      if (!response.error) {
        if (response.data) {
          this.setState({ currency: response.data.Items });
        }
      }
      loadA = true;
      if (loadA && loadB) this.setState({ loading: false });
    });
  }

  onSubmit(value) {
    this.setState({ loading: true });
    const currencyId = value.get('Country');
    request.post(`${apiUrl}/Websites/${localStorage.getItem('websiteID')}/Currency/${currencyId}`, {}, (response) => {
      if (!response.error) {
        request.get(`${apiUrl}/Currency/${localStorage.getItem('websiteID')}`, {}, (responses) => {
          if (!responses.error) {
            if (responses.data) {
              this.setState({ WebsiteCurrency: responses.data.WebsiteCurrency }, () => {
                this.props.initialize({
                  Country: this.state.WebsiteCurrency.Id,
                });
              });
            }
          }
          this.setState({ loading: false });
        });
      } else {
        this.setState({ loading: false });
      }
    });
  }

  render() {
    const ListCountry = [];
    this.state.currency.forEach((x) => {
      ListCountry.push(<MenuItem key={x.Code} value={x.Id} primaryText={`${x.Code} | ${x.Name}`} />);
    });
    return (
      <div className={styles.containerSetting}>
        <h2>Currency Setting</h2>
        <br />
        <form onSubmit={this.props.handleSubmit((value) => this.onSubmit(value))} data-automation-id="form-setting">
          <Row>
            <Col xs={10} sm={10} md={6} lg={6}>
              <Row>
                <Col xs={12}>
                  <Field label="" name="Country" value={this.state.WebsiteCurrency.Id} component={Select} data-automation-id="select-country">{ListCountry}</Field>
                </Col>
                <Col xs={12} className={styles.action}>
                  <Button type="submit" data-automation-id="btn-save">Save</Button>
                  <Button type="button" data-automation-id="btn-cancel" btnStyle="negative" onClick={() => this.props.initialize({ Country: this.state.WebsiteCurrency.Id })}>Cancel</Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </form>
        { this.state.loading && <Loading inside /> }
      </div>
    );
  }
}

Setting.propTypes = {
  initialize: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'Setting',
  validate(values) {
    const errors = {};
    const requiredFields = {
      Country: 'Please select currency',
    };
    for (const [field, hint] of Object.entries(requiredFields)) { // eslint-disable-line
      if (!values.get(field)) {
        errors[field] = hint;
      }
    }
    return errors;
  },
})(Setting);
