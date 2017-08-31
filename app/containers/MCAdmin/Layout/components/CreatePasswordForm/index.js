import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form/immutable';
import { Row, Col } from 'react-flexbox-grid';

import styles from './styles.css';
import Input from '../../../../../components/Input';
import ErrorBox from '../../../../../components/ErrorBox';
import Loading from '../../../../../components/Loading';
import Button from '../../../../../components/Button';
import Message from '../../../../../Message';

import validate from '../../../../../utils/validate';

export const validateCreatePassword = (valuesBefore) => {
  const values = valuesBefore;
  const errors = {};

  const requiredFields = {
    password: 'Please enter password',
    repassword: 'Please enter confirm password',
  };

  for (const [field, message] of Object.entries(requiredFields)) { // eslint-disable-line
    if (!values.get(field)) {
      errors[field] = message;
    }
  }

  if (!validate.isPassword(values.get('password'))) {
    errors.password = Message.error.PASSWORD_INCORRECT_FORMAT;
  }

  if (values.get('password') !== values.get('repassword')) {
    errors.repassword = Message.error.PASSWORD_NOT_MATCH;
  }

  return errors;
};

export class CreatePasswordForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: props.email,
    };
  }

  componentDidMount() {
  }

  submit(values) {
    this.setState({ isLoading: true });
    this.props.onSuccess(values.get('password'), values.get('repassword'));
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <form data-automation-id="form-merchant-createpassword" onSubmit={handleSubmit((values) => this.submit(values))}>
        <div className={styles.background}>
          <div className={styles.box}>
            <Row center="xs">
              { this.state.error &&
                <Col xs={12}>
                  <ErrorBox data-automation-id="error-merchant-password" error={this.state.error} onClose={() => { this.setState({ error: false }); }} />
                </Col>
              }
              <Col xs={12}>
                <Field
                  data-automation-id="input-merchant-createpassword-email"
                  label="Email"
                  name="email" type="text" component={Input}
                  defaultValue={this.state.email}
                  disabled={Boolean(true)}
                />
              </Col>
              <Col xs={12}>
                <Field
                  data-automation-id="input-merchant-createpassword-password"
                  label="Please enter password"
                  name="password" type="password"
                  component={Input}
                />
              </Col>
              <Col xs={12}>
                <Field
                  data-automation-id="input-merchant-createpassword-password-confirm"
                  label="Confirm the password"
                  name="repassword" type="password"
                  component={Input}
                />
              </Col>
              <Col xs={12}>
                <div className={styles.buttonFooter}>
                  <Button data-automation-id="btn-merchant-createpassword-submit" type="submit" className={styles.submitButton}>submit</Button>
                </div>
              </Col>
            </Row>
            { this.state.isLoading && <Loading /> }
          </div>
        </div>
      </form>
    );
  }
}

CreatePasswordForm.propTypes = {
  email: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'CreatePasswordForm',
  validate: validateCreatePassword,
})(CreatePasswordForm);
