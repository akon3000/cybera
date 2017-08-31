import React from 'react';
import PropTypes from 'prop-types';
import FinishIcon from 'react-icons/lib/md/check-circle';
import CancelIcon from 'react-icons/lib/md/add-circle';
import CircularProgress from 'material-ui/CircularProgress';
import ErrorIcon from 'react-icons/lib/md/error';

import request from '../../../../../utils/request';
import { apiUrl } from '../../../../../config';

import styles from './styles.css';

class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: this.props.file.id === this.props.nextQueue ? 'reading' : 'awaiting',
      total: 100,
      loaded: 0,
    };
    this.xhr = new XMLHttpRequest();
  }

  componentDidMount() {
    if (this.props.file.id === this.props.nextQueue) {
      this.uploadFile(this.props.file);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.nextQueue === this.props.file.id && this.state.status === 'awaiting') {
      this.setState({ status: 'reading' }, () => {
        this.uploadFile(this.props.file);
      });
    }
  }

  uploadFile(file) {
    const { websiteID, directory, size } = this.props;
    request.get(`${apiUrl}/${websiteID}/FileToken?Directory=${directory}&FileName=${file.name}&FileSize=${size}`, {}, (response) => {
      if (response.data) {
        const fr = new FileReader();
        const url = response.data.SignURL;
        fr.onload = (ee) => {
          const array = new Uint8Array(ee.target.result);
          this.xhr.open('PUT', url, true);
          this.xhr.setRequestHeader('Content-Type', response.data.ContentType);

          this.xhr.upload.onprogress = (progressEvent) => {
            if (progressEvent.lengthComputable) {
              this.setState({ total: progressEvent.total, loaded: progressEvent.loaded });
            }
          };

          this.xhr.upload.onloadstart = () => {
            this.setState({ status: 'start' });
          };

          this.xhr.upload.onloadend = () => {
            this.setState({ status: 'completed' }, () => {
              this.props.onCompleted(file);
            });
          };
          this.xhr.send(array);
        };
        fr.readAsArrayBuffer(file.file);
      } else {
        this.setState({ status: 'error', error: response.error }, () => {
          this.props.onUploadError(file);
        });
      }
    });
  }

  abort() {
    this.xhr.abort();
    this.setState({ status: 'abort' });
  }

  render() {
    const { name } = this.props;
    const { status, loaded, total } = this.state;
    return (
      <div data-automation-id="file-upload-items" className={styles.items} key={name}>
        <span className={styles.name}>{name}</span>
        { status === 'completed' && <button className={styles.finish}><FinishIcon /></button>}
        { status === 'start' &&
          <div className={styles.loadingContainer}>
            <button className={styles.loading}>
              <CircularProgress
                mode="determinate"
                min={0}
                max={total}
                value={loaded}
                thickness={2}
                size={20}
                color="#3787C1"
                style={{ zIndex: '1' }}
              />
            </button>
            <button className={styles.cancel} onClick={() => this.abort()}><CancelIcon style={{ transform: 'rotate(45deg)' }} /></button>
          </div>
        }
        { status === 'abort' && <button className={styles.cancelled}>cancelled</button>}
        { status === 'error' && <button className={styles.error}><ErrorIcon /><span>{this.state.error}</span></button>}
      </div>
    );
  }
}

Item.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  file: PropTypes.object,
  websiteID: PropTypes.number.isRequired,
  directory: PropTypes.string.isRequired,
  onCompleted: PropTypes.func.isRequired,
  onUploadError: PropTypes.func.isRequired,
  nextQueue: PropTypes.number,
};

Item.defaultProps = {
  file: undefined,
  nextQueue: 0,
};

export default Item;
