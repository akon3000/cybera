import React from 'react';
import PropTypes from 'prop-types';
import CloseIcon from 'react-icons/lib/md/close';

import Video from '../../../Video';

import styles from './styles.css';

class Preview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageStyle: {},
    };
  }

  componentDidMount() {
    // console.log(this.obj.getDOMNode(), this.obj.width, this.obj.height);
  }

  render() {
    const { file, onClose, type } = this.props;
    return (
      <div data-automation-id="preview-file-manager" className={styles.container}>
        <div className={styles.topTools}>
          <span className={styles.fileName}>{file.FileName}</span>
          <button className={styles.closeBtn} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className={styles.preview} ref={(c) => { this.preview = c; }}>
          {type === 'image' &&
            <img
              ref={(c) => { this.obj = c; }}
              src={file.MediaLink} alt="preview"
              className={styles.previewItem}
              style={this.state.imageStyle}
              onLoad={() => {
                const marginTop = (window.innerHeight - this.obj.height - 40) / 2;
                const marginLeft = (window.innerWidth - this.obj.width) / 2;
                this.setState({ imageStyle: { marginTop: `${marginTop}px`, marginLeft: `${marginLeft}px` } });
              }}
            />}
          {type === 'video' &&
          <div className={styles.video}>
            <Video controls={Boolean(true)} width={800} sources={[{ src: file.MediaLink, type: file.Type }]} />
          </div>
          }
        </div>
      </div>
    );
  }
}

Preview.propTypes = {
  file: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

Preview.defaultProps = {};

export default Preview;
