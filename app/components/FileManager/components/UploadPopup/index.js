import React from 'react';
import PropTypes from 'prop-types';
import CloseIcon from 'react-icons/lib/md/close';
import ExpandMoreIcon from 'react-icons/lib/md/expand-more';
import ExpandLessIcon from 'react-icons/lib/md/expand-less';

import Item from './Item';

import styles from './styles.css';

class UploadPopup extends React.Component {
  constructor(props) {
    let nextID = 0;
    const files = props.files.map((file) => {
      nextID += 1;
      return { id: nextID, file, name: file.name, status: 'new', size: file.size };
    });
    super(props);
    this.state = {
      files,
      nextID,
      completed: [],
      expand: 'more',
      queue: files.map((f) => f.id),
    };
  }

  componentWillReceiveProps(nextProps) {
    let nextID = this.state.nextID;
    if (nextProps.files && nextProps.files !== this.props.files) {
      const files = nextProps.files.map((file) => {
        nextID += 1;
        return { id: nextID, file, name: file.name, status: 'new', size: file.size };
      });
      this.setState({
        files: [...this.state.files, ...files],
        nextID,
        queue: [...this.state.queue, ...files.map((f) => f.id)],
      });
    }
  }

  render() {
    const { files, completed, expand } = this.state;
    const { websiteID, directory, onCompleted, onUploadError } = this.props;
    return (<div
      className={styles.container}
    >
      <div data-automation-id="popup-file-upload" className={styles.title}>
        {files.length !== completed.length && <span>Uploading {files.length - completed.length} items</span>}
        {files.length === completed.length && <span>{files.length} uploads complete</span>}
        <div className={styles.topTools}>
          {expand === 'more' && <button
            onClick={() => this.setState({ expand: 'less' })}
          ><ExpandMoreIcon /></button>}
          {expand === 'less' && <button
            onClick={() => this.setState({ expand: 'more' })}
          ><ExpandLessIcon /></button>}
          <button
            onClick={() => this.props.onClose()}
            disabled={files.length !== completed.length}
          ><CloseIcon /></button>
        </div>
      </div>
      <div className={styles.itemContainer} style={expand === 'less' ? { display: 'none' } : {}}> { /*  className={styles.container} */}
        {files.map((file) =>
          <Item
            key={file.id}
            websiteID={websiteID}
            directory={directory}
            name={file.name}
            size={file.size}
            file={file}
            nextQueue={this.state.queue.length > 0 ? this.state.queue[0] : 0}
            onCompleted={(fileCompleted) => {
              const queue = this.state.queue;
              queue.shift();
              this.setState({
                completed: [...completed, fileCompleted.id],
                queue: [...queue],
              });
              onCompleted(fileCompleted);
            }}
            onUploadError={(fileError) => {
              const queue = this.state.queue;
              queue.shift();
              this.setState({
                completed: [...completed, fileError.id],
                queue: [...queue],
              });
              onUploadError(fileError);
            }}
          />)}
      </div>

    </div>);
  }
}

UploadPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  files: PropTypes.array.isRequired,
  websiteID: PropTypes.number.isRequired,
  directory: PropTypes.string.isRequired,
  onCompleted: PropTypes.func.isRequired,
  onUploadError: PropTypes.func.isRequired,
};

UploadPopup.defaultProps = {};

export default UploadPopup;
