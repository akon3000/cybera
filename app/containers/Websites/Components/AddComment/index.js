import React from 'react';
import PropTypes from 'prop-types';

import { Field, reduxForm } from 'redux-form/immutable';
import request from '../../../../utils/request';
import { apiUrl } from '../../../../config';
import validate from '../../../../utils/validate';

import Input from '../../../../components/Input';
import TextArea from '../../../../components/TextArea';
import Loading from '../../../../components/LoadingBox';

import ErrorBox from '../../../../components/ErrorBox';

import './styles.css';

export const FormValidate = (values) => {
  const errors = {};
  console.log('FormValidat');

  if (!values.get('name')) {
    errors.name = 'Please enter name';
  } else {
    const isValidLength = validate.isValidLength(values.get('name'), 50, 'Name');
    if (isValidLength !== true) {
      errors.name = isValidLength;
    }
    const isValidCharacters = validate.isValidCharacters(values.get('name'), "-'.", 'Name');
    if (isValidCharacters !== true) {
      errors.name = isValidCharacters;
    }
  }

  if (!values.get('email')) {
    errors.email = 'Please enter email address';
  } else {
    const isValidLength = validate.isValidLength(values.get('email'), 100, 'Email address');
    if (isValidLength !== true) {
      errors.email = isValidLength;
    } else if (!validate.isEmail(values.get('email'))) {
      errors.email = 'Please enter valid email address';
    }
  }

  if (!values.get('comment')) {
    errors.comment = 'Please enter comment';
  } else {
    const isValidLength = validate.isValidLength(values.get('comment'), 250, 'Comment text');
    if (isValidLength !== true) {
      errors.comment = isValidLength;
    }
  }

  return errors;
};

class AddComment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  submit(values) {
    this.setState({ loading: true, success: false, error: false });
    let bodyParams = {
      Name: values.get('name'),
      Email: values.get('email'),
      Text: values.get('comment'),
      BlogId: this.props.blogID,
    };

    if (this.props.replyToID) {
      bodyParams = { ...bodyParams, ReplyToId: this.props.replyToID };
    }

    request.post(
      `${apiUrl}/Websites/${localStorage.getItem('subDomain')}/BlogComment`, bodyParams,
      (response) => {
        if (!response.error) {
          this.setState({ loading: false, success: true, error: false });
          this.props.reset();
        } else {
          this.setState({ loading: false, error: response.error, success: false });
        }
      }
    );
  }

  render() {
    const { handleSubmit, form } = this.props;
    const { loading, error, success } = this.state;
    return (
      <div className="row component-add-comment">
        {(success) && <div className="success">
          Thank you for your comment. As soon as your comment get admin verification, it will be published.
        </div>}
        {error && <div className="center"><ErrorBox error={error} /></div>}
        <form
          data-automation-id="add-comment"
          onSubmit={handleSubmit((values) => this.submit(values))}
          form={form}
        >
          <div className="col-md-6">
            <Field
              data-automation-id="input-email"
              label="Email address"
              name="email"
              component={Input}
            />
          </div>
          <div className="col-md-6">
            <Field
              data-automation-id="input-name"
              label="Name"
              name="name"
              component={Input}
            />
          </div>
          <div className="col-xs-12">
            <Field
              data-automation-id="input-text"
              label="Comment"
              name="comment"
              component={TextArea}
            />
          </div>
          <div className="col-xs-12">
            <button type="submit">submit</button>
          </div>
        </form>
        {loading && <Loading />}
      </div>
    );
  }
}

AddComment.propTypes = {
  blogID: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  replyToID: PropTypes.number,
  reset: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
};

AddComment.defaultProps = {
  replyToID: null,
};

export default reduxForm({
  form: 'AddComment',
  validate: FormValidate,
})(AddComment);
