import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form/immutable';
import { Row, Col } from 'react-flexbox-grid';
import Validate from '../../../../utils/validate';
import message from '../../../../Message';
import input from '../../../../components/Input';
import Dialog from '../../../../components/Dialog';
import Loading from '../../../../components/Loading';
import Button from '../../../../components/Button';

import { apiUrl } from '../../../../config';
import request from '../../../../utils/request';

import styles from './style.css';

const validate = (values) => {
  const errors = {};
  const requiredFields = {
    FileName(value) {
      if (!value) return message.format('require_enter', 'File name');
      const maxLength = Validate.isValidLength(value, 50, 'File name');
      if (maxLength !== true) return maxLength;

      const isValidFormant = Validate.isNameWithNumbers(value, '-_', true);
      if (isValidFormant !== true) return isValidFormant;
      return true;
    },
  };

  Object.keys(requiredFields).forEach((key) => {
    const msg = requiredFields[key](values.get(key));
    if (msg !== true) errors[key] = msg;
  });


  return errors;
};

class EditFile extends React.Component {
  constructor(props) {
    super(props);
    const fileNames = props.file.FileName.split('.');
    this.state = {
      loading: false,
      fileName: fileNames[0],
      fileExtension: fileNames[1],
    };
  }

  componentDidMount() {
    this.initData();
  }

  onSubmit(value) {
    this.setState({ loading: true });
    const { file } = this.props;
    request.put(
    `${apiUrl}/${this.props.websiteID}/File`,
      {
        Id: file.Id,
        FileName: `${value.get('FileName')}.${this.state.fileExtension}`,
      },
      (response) => {
        if (response.data) {
          this.props.onSuccess();
        } else {
          this.props.onError(response.error);
        }
      });
  }

  initData() {
    this.props.initialize({ FileName: this.state.fileName });
  }

  render() {
    const { loading } = this.state;
    return (
      <Dialog
        data-automation-id="popup-edit-file"
        title="Rename file"
        onClose={() => this.props.onClose()}
        height={190}
        actions={[
          <Button
            type="submit"
            data-automation-id="btn-save"
            onClick={this.props.handleSubmit((value) => this.onSubmit(value))}
          >Save</Button>,
          <Button
            type="button"
            data-automation-id="btn-cancel"
            btnStyle="negative"
            onClick={() => this.props.onClose()}
          >Cancels</Button>,
        ]}
      >
        <div className={styles.container}>
          <form
            ref={(c) => { this.EditFileForm = c; }}
            onSubmit={this.props.handleSubmit((value) => this.onSubmit(value))} data-automation-id="form-new-folder"
          >
            <Row className={styles.row}>
              <Col xs={12}>
                <Field data-automation-id="input-file-name" label="File Name" name="FileName" type="text" component={input} />
              </Col>
            </Row>
          </form>
        </div>
        {loading && <Loading />}
      </Dialog>
    );
  }
}

EditFile.propTypes = {
  file: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  initialize: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  websiteID: PropTypes.number.isRequired,
};

EditFile.defaultProps = {
  onClose: undefined,
};

export default reduxForm({
  form: 'EditFile',
  validate,
})(EditFile);

