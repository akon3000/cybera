import React from 'react';
import PropTypes from 'prop-types';

import Dialog from '../Dialog';
import Button from '../Button';
import FileManager from '../FileManager';

import styles from './styles.css';

class FileMangerPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: false,
      width: `${window.innerWidth - 32}px`,
      height: `${window.innerHeight - 32}px`,
    };
  }

  render() {
    const { rootFolder, onClose, onSelectFile, selectAbleType } = this.props;
    const { file, width, height } = this.state;
    let fileMangerHeight = window.innerHeight - 112;
    if (window.innerWidth < 470) {
      fileMangerHeight -= 35;
    }
    return (
      <Dialog
        data-automation-id="popup-file-manager"
        title="File Manager"
        onClose={onClose}
        contentStyle={{
          maxWidth: '100%',
          maxHeight: 'none',
          padding: '0',
          height,
          width,
          transform: 'none',
        }}
        bodyStyle={{
          height,
          maxWidth: 'none',
          maxHeight: 'none',
        }}
        bodyClassName={styles.body}
        autoScrollBodyContent={false}
        actions={[<Button
          disabled={file === false}
          className={styles.selectFileButton}
          onClick={() => onSelectFile(file)}
        >Select File</Button>]}
      >
        <div className={styles.container}>
          <FileManager
            height={fileMangerHeight}
            rootFolder={rootFolder}
            onSelectFile={(selectedFile) => {
              if (selectedFile) {
                const extension = selectedFile.FileName.split('.').pop();
                if (selectAbleType.includes(extension.toUpperCase())) {
                  this.setState({ file: selectedFile });
                }
              } else {
                this.setState({ file: false });
              }
            }}
          />
        </div>
      </Dialog>
    );
  }
}

FileMangerPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  rootFolder: PropTypes.string,
  onSelectFile: PropTypes.func.isRequired,
  selectAbleType: PropTypes.oneOfType([
    PropTypes.any,
    PropTypes.bool,
  ]),
};

FileMangerPopup.defaultProps = {
  rootFolder: '/',
  selectAbleType: false,
};

export default FileMangerPopup;
