import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';

import PhotoIcon from 'react-icons/lib/md/add-a-photo';
import DeleteIcon from 'react-icons/lib/md/delete';
import EditIcon from 'react-icons/lib/md/create';

import FileManagerPopup from '../FileManagerPopup';
import { allowedFileTypes } from '../../config';

import styles from './styles.css';

class InputImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopup: false,
      value: props.input.value || props.defaultValue || '', // eslint-disable-line
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.input.value || nextProps.defaultValue || '' }); // eslint-disable-line
  }

  dispatch() {
    const {  icon, meta, input } = this.props; // eslint-disable-line
    meta.dispatch({
      type: '@@redux-form/CHANGE',
      meta: {
        form: meta.form,
        field: input.name,
        touch: meta.touched,
        persistentSubmitErrors: false,
      },
      payload: this.state.value,
    });
  }

  render() {
    const { rootFolder, width, height, input, label, disabled, defaultValue, type, hintText, autoComplete, icon, meta } = this.props; // eslint-disable-line
    const { value } = this.state;

    return (
      <div className={`${styles.container}`}>
        <label htmlFor={input.name}>{label}</label>
        <TextField
          data-automation-id={this.props['data-automation-id']}
          className={styles.textField}
          errorText={meta.touched && meta.error && <span data-automation-id="error">{meta.error}</span>}
          {...input}
          value={value}
          disabled={disabled}
          type={type}
          hintText={hintText}
          underlineStyle={{ borderColor: '#D7D7D7' }}
          errorStyle={{ color: '#F44336' }}
          autoComplete={autoComplete}
        />
        {this.state.showPopup &&
        <FileManagerPopup
          onClose={() => this.setState({ showPopup: false })}
          rootFolder={rootFolder}
          selectAbleType={allowedFileTypes.image}
          onSelectFile={(selectedFile) => {
            this.setState({ showPopup: false, value: selectedFile.MediaLink }, () => {
              this.dispatch();
            });
          }}
        />}
        <div
          className={styles.thumb}
          style={{ width: `${width}px`, height: `${height}px`, backgroundImage: `url(${value}?width=${width}&height=${height})` }}
        >
          {value !== '' &&
            <div className={styles.tools}>
              <div>
                <button
                  data-automation-id="btn-edit"
                  onClick={() => this.setState({ showPopup: true })}
                  type="button"
                ><EditIcon /></button>
                <button
                  data-automation-id="btn-delete"
                  onClick={() => {
                    this.setState({ showPopup: false, value: '' }, () => {
                      this.dispatch();
                    });
                  }}
                  className={styles.btnDelete}
                  type="button"
                ><DeleteIcon /></button>
              </div>
            </div>
          }
          {value === '' &&
            <button
              data-automation-id="btn-add-image"
              type="button"
              className={styles.emptyImage}
              onClick={() => this.setState({ showPopup: true })}
            >
              <PhotoIcon />
            </button>
          }
        </div>
        {meta.touched && meta.error &&
          <span data-automation-id="error" className={styles.error}>{meta.error}</span>
        }
      </div>
    );
  }
}

InputImage.propTypes = {
  'data-automation-id': PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

InputImage.defaultProps = {
  'data-automation-id': '',
  width: 300,
  height: 200,
};

export default InputImage;
