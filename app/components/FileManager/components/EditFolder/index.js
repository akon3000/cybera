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
    FolderName(value) {
      if (!value) return message.format('require_enter', 'Folder name');
      const maxLength = Validate.isValidLength(value, 50, 'Folder name');
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

class EditFolder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    this.initData();
  }

  onSubmit(value) {
    this.setState({ loading: true });
    const { folder } = this.props;
    if (folder) {
      request.put(
        `${apiUrl}/${this.props.websiteID}/File/Folder`,
        {
          Id: folder.Id,
          FileName: value.get('FolderName'),
          FilePath: this.props.path,
        },
        (response) => {
          if (response.data) {
            this.props.onSuccess();
          } else {
            this.props.onError(response.error);
          }
        });
    } else {
      request.post(
        `${apiUrl}/${this.props.websiteID}/File/Folder`,
        {
          FileName: value.get('FolderName'),
          FilePath: this.props.path,
        },
        (response) => {
          if (response.data) {
            this.props.onSuccess();
          } else {
            this.props.onError(response.error);
          }
        });
    }
  }

  initData() {
    const { folder } = this.props;
    if (folder) {
      this.props.initialize({ FolderName: folder.FileName });
    }
  }


  render() {
    const { loading } = this.state;
    const { folder } = this.props;
    return (
      <Dialog
        data-automation-id="popup-edit-folder"
        title={folder ? 'Rename folder' : 'Add new folder'}
        onClose={this.props.onClose}
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
          >Cancel</Button>,
        ]}
      >
        <div className={styles.container}>
          <form
            ref={(c) => { this.EditFolderForm = c; }}
            onSubmit={this.props.handleSubmit((value) => this.onSubmit(value))} data-automation-id="form-new-folder"
          >
            <Row className={styles.row}>
              <Col xs={12}>
                <Field data-automation-id="input-folder-name" label="Folder Name" name="FolderName" type="text" component={input} />
              </Col>
            </Row>
          </form>
        </div>
        {loading && <Loading />}
      </Dialog>
    );
  }
}

EditFolder.propTypes = {
  folder: PropTypes.object,
  path: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  initialize: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  websiteID: PropTypes.number.isRequired,
};

EditFolder.defaultProps = {
  folder: null,
  onClose: undefined,
};

export default reduxForm({
  form: 'EditFolder',
  validate,
})(EditFolder);

