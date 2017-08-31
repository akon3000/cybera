import React from 'react';
import PropTypes from 'prop-types';
import FolderIcon from 'react-icons/lib/fa/folder-o';
import FolderOpenIcon from 'react-icons/lib/fa/folder-open-o';
import GridIcon from 'react-icons/lib/md/apps';
import ListIcon from 'react-icons/lib/md/format-list-bulleted';
import AddFolderIcon from 'react-icons/lib/md/create-new-folder';
import TrashIcon from 'react-icons/lib/md/delete';
import EditIcon from 'react-icons/lib/ti/pencil';
import UploadIcon from 'react-icons/lib/md/cloud-upload';
import CheckIcon from 'react-icons/lib/md/check-circle';
import CheckBoxBlankIcon from 'react-icons/lib/md/check-box-outline-blank';
import CheckBoxIcon from 'react-icons/lib/md/check-box';
import PreviewIcon from 'react-icons/lib/md/remove-red-eye';
import DownloadIcon from 'react-icons/lib/md/file-download';
import SearchIcon from 'react-icons/lib/md/search';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import 'whatwg-fetch';

// import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

import { formatDate, bytesToMB, bytesToSize } from '../../utils';
import request from '../../utils/request';
import { apiUrl, allowedFileTypes } from '../../config';

import FolderImage from './icons/folder.png';
import FolderFullImage from './icons/folderFull.png';
import FontImage from './icons/font.png';
import VideoImage from './icons/video.png';
import FileImage from './icons/file.png';

import EditFolder from './components/EditFolder';
import EditFile from './components/EditFile';
import UploadPopup from './components/UploadPopup';
import PreviewPopup from './components/Preview';
import Video from '../Video';

// import SuccessPopup from '../SuccessPopup';
import ErrorPopup from '../ErrorPopup';
import ConfirmPopup from '../ConfirmPopup';
import Loading from '../Loading';

import styles from './styles.css';

let timer;
let prevent;

class FileManager extends React.Component {
  constructor(props) {
    super(props);
    const websiteID = localStorage.getItem('websiteID');
    this.state = {
      path: props.rootFolder,
      loading: true,
      folders: [],
      isGridView: true,
      data: [],
      folderPopup: false,
      popup: false,
      selectedFile: false,
      pageLoading: false,
      sorting: 'NameASC',
      gettingData: false,
      websiteID: websiteID === null ? 0 : parseInt(websiteID, 0),
      selectedFiles: [],
      uploadQueue: [],
      deleteQueue: [],
    };

    this.clearPopover = this.clearPopover.bind(this); // bind function once
  }

  componentDidMount() {
    this.getData();
    if (this.state.websiteID !== 0) this.getPlan();
    window.addEventListener('scroll', this.clearPopover);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.clearPopover);
  }

  onFileDoubleClick(file) {
    if (file.Type === 'Folder') {
      this.openFolder(file.Id);
    }
  }

  getData(showLoading = true) {
    this.setState({ loading: showLoading, gettingData: true, selectedFiles: [] });
    request.get(`${apiUrl}/${this.state.websiteID}/File`, {}, (response) => {
      let fileSize = 0;
      if (response.data) {
        const data = response.data.Items
          .filter((f) => {
            if (f.FilePath.search(this.props.rootFolder) === 0 || this.props.rootFolder === `/${f.FileName}/`) {
              return true;
            }
            return false;
          });
        let folders = data.filter((f) => f.Type === 'Folder').map((f) => {
          if (this.props.rootFolder !== '/' && `${f.FilePath}${f.FileName}/` === this.props.rootFolder) {
            return { ...f, IsOpen: true };
          }
          return f;
        });

        const rootFolders = response.data.Items.filter((f) => f.FilePath === '/');
        for (let i = 0; i < rootFolders.length; i += 1) {
          fileSize += response.data.Items[i].Size;
        }

        if (this.state.folders.length > 0) {
          folders = folders.map((f) => {
            const oldFolders = this.state.folders;
            const oldFolder = oldFolders.filter((of) => of.Id === f.Id);
            if (oldFolder.length > 0) {
              return { ...f, IsOpen: oldFolder[0].IsOpen };
            }
            return f;
          });
        }
        const tempData = this.state.data.filter((f) => {
          if (f.isTemp) {
            return data.filter((d) => d.FileName === f.FileName).length === 0;
          }
          return false;
        });
        this.setState({ data: [...data, ...tempData], folders, loading: false, fileSize, gettingData: false }, () => {
          this.getFile();
        });
      } else {
        this.setState({ error: response.error, loading: false, gettingData: false, fileSize });
      }
    });
  }

  getPlan() {
    if (this.state.websiteID !== 0) {
      this.setState({ pageLoading: true });
      request.get(`${apiUrl}/Websites/${this.state.websiteID}/WebsitePlan/false`, {},
      (response) => {
        if (response.data) {
          this.setState({ currentPlan: response.data.PlanDetail, pageLoading: false });
        } else {
          const popup = (<ErrorPopup
            error={response.error}
            onClose={() => this.setState({ popup: false })}
          />);
          this.setState({ popup });
        }
      });
    }
  }

  getFile() {
    const { data, path, sorting } = this.state;
    const datas = data
      .filter((f) => f.FilePath === path)
      .filter((f) => {
        if (this.searchText.value && this.searchText.value.length > 0) {
          return f.FileName.search(this.searchText.value) >= 0;
        }
        return true;
      });
    const folders = datas.filter((f) => f.Type === 'Folder')
    .sort((a, b) => {
      const aName = a.FileName.toLowerCase();
      const bName = b.FileName.toLowerCase();
      if (sorting === 'NameASC') {
        if (aName > bName) { return 1; }
        if (aName < bName) { return -1; }
        return 0;
      } else if (sorting === 'NameDES') {
        if (aName > bName) { return -1; }
        if (aName < bName) { return 1; }
        return 0;
      }
      return 0;
    });

    const files = datas.filter((f) => f.Type !== 'Folder')
    .sort((a, b) => {
      const aName = a.FileName.toLowerCase();
      const bName = b.FileName.toLowerCase();
      const aDate = new Date(a.CreatedDate);
      const bDate = new Date(b.CreatedDate);
      if (sorting === 'NameASC') {
        if (aName > bName) { return 1; }
        if (aName < bName) { return -1; }
        return 0;
      } else if (sorting === 'NameDES') {
        if (aName > bName) { return -1; }
        if (aName < bName) { return 1; }
        return 0;
      } else if (sorting === 'DateASC') {
        if (aDate > bDate) { return 1; }
        if (aDate < bDate) { return -1; }
        return 0;
      } else if (sorting === 'DateDES') {
        if (aDate > bDate) { return -1; }
        if (aDate < bDate) { return 1; }
        return 0;
      }
      return 0;
    });
    if (sorting === 'NameASC') {
      this.setState({ files: [...folders, ...files] });
    } else {
      this.setState({ files: [...files, ...folders] });
    }
  }

  getFileType(file) {
    const extension = file.FileName.split('.').pop();
    if (file.Type === 'Folder') {
      return 'folder';
    }
    if (allowedFileTypes.image.includes(extension.toUpperCase())) {
      return 'image';
    }
    if (allowedFileTypes.video.includes(extension.toUpperCase())) {
      return 'video';
    }
    if (allowedFileTypes.font.includes(extension.toUpperCase())) {
      return 'font';
    }
    if (allowedFileTypes.document.includes(extension.toUpperCase())) {
      return 'document';
    }
    return 'other';
  }

  handleFileClick(e, file) {
    const me = this;
    if (file.Type === 'Floder') {
      timer = setTimeout(() => {
        if (!prevent) {
          me.selectedFile(file.Id, e.ctrlKey);
        }
        prevent = false;
      }, 200);
    } else {
      me.selectedFile(file.Id, e.ctrlKey);
    }
    e.stopPropagation();
  }

  handleCheckBoxClick(id) {
    let selectedFiles = this.state.selectedFiles;
    if (selectedFiles.includes(id)) {
      selectedFiles = selectedFiles.filter((x) => x !== id);
    } else {
      selectedFiles = [...selectedFiles, id];
    }
    this.setState({ selectedFiles }, () => {
      if (this.props.onSelectFile !== undefined) {
        let file = false;
        if (selectedFiles.length === 1) {
          file = this.state.files.filter((f) => f.Id === selectedFiles[0])[0];
          if (file.Type === 'Folder') {
            file = false;
          }
        }
        this.props.onSelectFile(file);
      }
    });
  }

  selectedFile(id, isAppend = false) {
    let selectedFiles = this.state.selectedFiles;
    if (isAppend) {
      if (selectedFiles.includes(id)) {
        selectedFiles = selectedFiles.filter((x) => x !== id);
      } else {
        selectedFiles = [...selectedFiles, id];
      }
      this.setState({ selectedFiles });
    } else {
      if ((selectedFiles.includes(id) && selectedFiles.length > 1) || !selectedFiles.includes(id)) {
        selectedFiles = [id];
      } else if (selectedFiles.includes(id) && selectedFiles.length === 1) {
        selectedFiles = [];
      }
      this.setState({ selectedFiles });
    }

    if (this.props.onSelectFile !== undefined) {
      let file = false;
      if (selectedFiles.length === 1) {
        file = this.state.files.filter((f) => f.Id === selectedFiles[0])[0];
        if (file.Type === 'Folder') {
          file = false;
        }
      }
      this.props.onSelectFile(file);
    }
  }

  handleFileDoubleClick(e, file) {
    clearTimeout(timer);
    prevent = true;
    this.onFileDoubleClick(file);
  }

  clearSelectedFiles() {
    this.setState({ selectedFiles: [] });
  }

  openFolder(id) {
    let path = '';
    let folders = this.state.folders.map((folder) => {
      if (folder.Id === id) {
        path = `${folder.FilePath}${folder.FileName}/`;
        return { ...folder, IsOpen: true };
      }
      return folder;
    });
    folders = folders.map((folder) => {
      if (folder.FilePath === path) {
        return { ...folder, IsOpen: false };
      }
      return folder;
    });
    this.setState({
      folders,
      path,
      latestOpen: id,
      selectedFiles: [],
    }, () => {
      this.getFile();
      if (this.props.onSelectFile !== undefined) {
        this.props.onSelectFile(false);
      }
    });
    this.clearPopover();
  }

  deleteFilePopup(fileId = false) {
    let confirmMessage = 'Are you sure to permanently delete the folder and its content? If the folder’s content already added to your site, they will still be there.';
    if (fileId || this.state.selectedFiles.length === 1) {
      const id = fileId || this.state.selectedFiles[0];
      const files = this.state.files.filter((f) => f.Id === id);
      if (files.length > 0 && files[0].Type !== 'Folder') {
        confirmMessage = 'Are you sure to permanently delete the  file? If the file already added to your site, it will still be there.';
      }
    }

    const confirmPopup = (<ConfirmPopup
      onClose={() => this.setState({ popup: false })}
      onConfirm={() => {
        if (fileId) {
          // const data = this.state.data.filter((f) => f.Id !== fileId);
          // const folders = this.state.folders.filter((f) => f.Id !== fileId);
          this.setState({ deleteQueue: [fileId] }, () => {
            this.deleteFile();
          });
        } else {
          const deleteQueue = [];
          const selectedFiles = this.state.selectedFiles;
          for (let i = 0; i < selectedFiles.length; i += 1) {
            deleteQueue.push(selectedFiles[i]);
          }
          this.setState({ deleteQueue }, () => {
            this.deleteFile();
          });
          // const data = this.state.data.filter((f) => !selectedFiles.includes(f.Id));
          // const folders = this.state.folders.filter((f) => !selectedFiles.includes(f.Id));
          // this.setState({ data, folders }, () => {
          //   this.getFile();
          //   for (let i = 0; i < selectedFiles.length; i += 1) {
          //     deleteQueue.push(selectedFiles[i]);
          //   }

          // });
        }
        this.setState({ popup: false });
      }}
    >
      {confirmMessage}
    </ConfirmPopup>);
    this.setState({ popup: confirmPopup });
  }

  deleteFile() {
    const deleteQueue = this.state.deleteQueue;
    for (let i = 0; i < deleteQueue.length; i += 1) {
      request.delete(`${apiUrl}/${this.state.websiteID}/File/${deleteQueue[i]}`, {},
      (response) => {
        let popup = false;
        let newDeleteQueue = [];
        if (!response.data) {
          popup = (<ErrorPopup
            onClose={() => this.setState({ popup: false })}
            error={response.error}
          />);
        } else {
          newDeleteQueue = this.state.deleteQueue.filter((x) => x !== deleteQueue[i]);
        }
        this.setState({ popup, deleteQueue: newDeleteQueue, loading: true }, () => this.getData());
      });
    }
    // request.delete(`${apiUrl}/${this.state.websiteID}/File/${fileId}`, {},
    // (response) => {
    //   let popup = false;
    //   if (!response.data) {
    //     popup = (<ErrorPopup
    //       onClose={() => this.setState({ popup: false })}
    //       error={response.error}
    //     />);
    //   }
    //   this.setState({ popup });
    // });
  }

  generateFolders(path = '/') {
    const folders = this.state.folders.filter((folder) => folder.FilePath === path);
    if (folders) {
      return folders.map((folder) =>
        <li key={`folder-li-${folder.Id}`}>
          <button
            key={`folder-button-${folder.Id}`}
            className={`${styles.file} ${this.state.latestOpen === folder.Id ? styles.activeFolder : ''}`}
            onClick={() => this.openFolder(folder.Id)}
          >
            {folder.IsOpen ? <FolderOpenIcon /> : <FolderIcon />}
            {folder.FileName}
          </button>
          {folder.IsOpen && this.state.folders.find((f) => f.FilePath === `${path}${folder.FileName}/`) &&
          <ul>{this.generateFolders(`${folder.FilePath}${folder.FileName}/`)}</ul>}
        </li>
      );
    }

    return null;
  }

  folderMenu(path) {
    const menus = [];
    if (path !== '/') {
      menus.push(<MenuItem
        key="context-menu-add-folder"
        leftIcon={<AddFolderIcon />}
        primaryText="Add New Folder"
        onClick={() => this.newFolderPopup(path)}
      />);
    }
    if (menus.length > 0) {
      return <Menu>{menus}</Menu>;
    }
    return null;
  }

  newFolderPopup(path) {
    if (this.state.websiteID !== 0) {
      const mbFileSize = bytesToMB(this.state.fileSize);
      const currentPlan = this.state.currentPlan;
      const mbMaxFileSize = currentPlan.StorageSize * 1024;
      if (mbFileSize >= mbMaxFileSize && currentPlan.Id !== 4) {
        this.fullStorageUsage();
        return;
      }
    }
    const popup = (<EditFolder
      onClose={() => this.setState({ popup: false })}
      path={path}
      websiteID={this.state.websiteID}
      onSuccess={() => {
        this.getData();
        this.setState({ popup: false });
      }}
      onError={(error) => {
        const errorPopup = (<ErrorPopup
          onClose={() => this.setState({ popup: false })}
          error={error}
        />);
        this.setState({ popup: errorPopup });
      }}
    />);
    this.setState({ popup });
  }

  editFolderPopup(folder) {
    const popup = (<EditFolder
      onClose={() => this.setState({ popup: false })}
      path={folder.FilePath}
      folder={folder}
      websiteID={this.state.websiteID}
      onSuccess={() => {
        this.getData();
        this.setState({ popup: false });
      }}
      onError={(error) => {
        const errorPopup = (<ErrorPopup
          onClose={() => this.setState({ popup: false })}
          error={error}
        />);
        this.setState({ popup: errorPopup });
      }}
    />);
    this.setState({ popup });
  }

  editFilePopup(file) {
    const popup = (<EditFile
      onClose={() => this.setState({ popup: false })}
      file={file}
      websiteID={this.state.websiteID}
      onSuccess={() => {
        this.getData();
        this.setState({ popup: false });
      }}
      onError={(error) => {
        const errorPopup = (<ErrorPopup
          onClose={() => this.setState({ popup: false })}
          error={error}
        />);
        this.setState({ popup: errorPopup });
      }}
    />);
    this.setState({ popup });
  }

  clearPopover() {
    this.setState({ popover: false });
  }

  contextFolderMenu(e) { // , targetPath
    // const { loading } = this.state;
    this.clearPopover();
    e.preventDefault();
    e.stopPropagation();
    e.preventDefault();
    return true;
    // if (loading) return;
    // const MenuItems = this.folderMenu(targetPath);
    // if (!MenuItems) return;
    // const top = `${e.clientY}px`;
    // const left = `${e.clientX}px`;
    // const popoverMenu = (<Popover
    //   open={Boolean(true)}
    //   onRequestClose={() => this.setState({ popover: false })}
    //   style={{ top, left }}
    //   anchorEl={{ getBoundingClientRect: () => ({ top, left }) }}
    //   useLayerForClickAway={Boolean(false)}
    //   className={styles.popover}
    // >
    //   {MenuItems}
    // </Popover>);
    // this.setState({ popover: popoverMenu });
  }

  fullStorageUsage() {
    const mbFileSize = bytesToMB(this.state.fileSize);
    const currentPlan = this.state.currentPlan;
    const mbMaxFileSize = currentPlan.StorageSize * 1024;
    const popup = (<ErrorPopup
      error={<div>Sorry, you already used your storage capacity. <br />
  Your plan name: {currentPlan.Name} <br />
  Allocated storage: {currentPlan.StorageSize}GB <br />
  Your storage usage: {((mbFileSize / mbMaxFileSize) * 100).toFixed(2)}% used, {(mbMaxFileSize - mbFileSize).toFixed(2)} MB available. <br />
  Please upgrade your plan or delete unnecessary content to free up storage space.</div>}
      onClose={() => this.setState({ popup: false })}
    />);
    this.setState({ popup });
  }

  uploadFile(e) {
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    const uploadQueue = [];

    for (let i = 0; i < files.length; i += 1) {
      uploadQueue.push(files[i]);
    }
    this.setState({ uploadQueue });
  }

  handleSearchSubmit(e) {
    e.preventDefault();
    this.getFile();
  }

  search() {
    clearTimeout(this.typingSearchTimer);
    this.typingSearchTimer = setTimeout(() => {
      this.getFile();
    }, 500);
  }

  render() {
    const {
      files, folders, loading, popover,
      isGridView, popup, path, pageLoading,
      selectedFiles, uploadQueue, websiteID } = this.state;
    const { height } = this.props;
    return (
      <div data-automation-id="file-manager" className={styles.container}>
        <div className={styles.uploadTools}>
          <div className={styles.uploadToolsText}>
            <p>Upload fonts in TTF, OTF, WOFF or WOFF2. Each file can be up to 10 MB.</p>
            <p>Upload images in JPEG, PNG or GIF. Each file can be up to 15 MB.</p>
            <p>Upload videos in AVI, MPEG, MPG, MPE, MP4, MKV, WE BM, MOV, OGV, VOB, M4V, 3GP, DIVX or XVID. Each file can be up to 50 MB.</p>
            <p>Upload document in DOC, DOCX, XLS, XLSX, PPT, PPTX, ODT, ODP or PDF. Each file can be up to 15 MB.</p>
          </div>
          <input
            ref={(c) => { this.files = c; }}
            onChange={(e) => {
              this.uploadFile(e);
            }}
            type="file"
            id="file-upload"
            style={{ display: 'none' }}
            name="files[]"
            multiple={Boolean(true)}
            disabled={loading || this.state.deleteQueue.length > 0}
          />
          <label
            data-automation-id="btn-file-manager-upload"
            htmlFor="file-upload"
            className={`${styles.uploadButton} ${loading || this.state.deleteQueue.length > 0 ? styles.disabled : ''}`}
          >
            <UploadIcon />Upload File
          </label>
        </div>
        <div className={styles.topTools}>
          <div className={styles.left}>
            {path !== '/' &&
            <button
              data-automation-id="btn-new-folder"
              onClick={() => this.newFolderPopup(path)}
            ><AddFolderIcon /><span>Add New Folder</span></button>}
            {path !== '/' && selectedFiles.length > 0 &&
            <button
              data-automation-id="btn-delete"
              onClick={() => this.deleteFilePopup()}
              className={styles.deleteSelected}
              disabled={selectedFiles.length <= 0}
            ><TrashIcon /><span>Delete</span></button>}
            {path !== '/' && selectedFiles.length === 1 &&
            <button
              data-automation-id="btn-rename"
              onClick={() => {
                const file = this.state.data.filter((f) => f.Id === selectedFiles[0])[0];
                if (file.Type === 'Folder') {
                  this.editFolderPopup(file);
                } else {
                  this.editFilePopup(file);
                }
              }}
              className={styles.deleteSelected}
              disabled={selectedFiles.length !== 1}
            ><EditIcon /><span>Rename</span></button>}
          </div>
          <div className={styles.right}>
            <div className={styles.search}>
              <form onSubmit={(e) => this.handleSearchSubmit(e)}>
                <input
                  data-automation-id="input-search-text"
                  ref={(c) => { this.searchText = c; }}
                  onChange={(e) => this.search(e)}
                  maxLength="50"
                />
                <button data-automation-id="btn-search"><SearchIcon /></button>
              </form>
            </div>
            <div className={styles.buttons}>
              <button
                data-automation-id="btn-view-grid"
                className={isGridView && styles.active}
                onClick={() => this.setState({ isGridView: true })}
              ><GridIcon /></button>
              <button
                data-automation-id="btn-view-list"
                className={isGridView || styles.active}
                onClick={() => this.setState({ isGridView: false })}
              ><ListIcon /></button>
            </div>
            <div className={styles.sorting}>
              <label htmlFor="sort">Sort : </label>
              <select
                data-automation-id="select-sorting"
                value={this.state.sorting}
                onChange={(e) => {
                  this.setState({ sorting: e.target.value }, () => {
                    this.getFile();
                  });
                }}
              >
                <option value="NameASC">A - Z</option>
                <option value="NameDES">Z - A</option>
                <option value="DateDES">Newest</option>
                <option value="DateASC">Oldest</option>
              </select>
            </div>
          </div>
        </div>
        <div className={styles.fileContainer}>
          <div className={styles.leftBar} style={{ height: `${height - 178}px` }}>
            <ul data-automation-id="folder-list-left">
              {folders.length > 0 && this.generateFolders()}
            </ul>
          </div>
          <div // eslint-disable-line
            className={styles.body}
            style={{ height: `${height - 178}px` }}
            onContextMenu={(e) => this.contextFolderMenu(e, path)}
            onClick={() => {
              if (isGridView) {
                this.clearSelectedFiles();
              }
            }}
          >
            {files && !loading && isGridView && files.map((file) => {
              const fileType = this.getFileType(file);
              let typeClass = '';
              const extension = file.FileName.split('.').pop().toLowerCase();
              if (file.Type === 'Folder') {
                typeClass = styles.fileFolder;
              } else if (fileType === 'image') {
                typeClass = styles.fileImage;
              } else if (fileType === 'video') {
                typeClass = styles.fileVideo;
              } else if (fileType === 'font') {
                typeClass = styles.fileFont;
              } else if (fileType === 'document') {
                typeClass = styles.fileDocument;
              }
              return (
                <div // eslint-disable-line
                  key={`file-${file.Id}`}
                  className={`${styles.file} ${typeClass} ${selectedFiles.includes(file.Id) ? styles.activeFile : ''}`}
                  onClick={(e) => this.handleFileClick(e, file)}
                  onDoubleClick={(e) => {
                    if (file.Type === 'Folder') {
                      this.handleFileDoubleClick(e, file);
                    }
                  }}
                  onContextMenu={(e) => {
                    if (file.Type === 'Folder') {
                      this.contextFolderMenu(e, `${file.FilePath}${file.fileName}/`);
                    }
                  }}
                  role="button"
                >
                  <CheckIcon className={styles.checkedIcon} />
                  {file.Type === 'Folder' &&
                    <span className={styles.fileThumb}>
                      <img src={file.Size > 0 ? FolderFullImage : FolderImage} alt={file.FileName} />
                    </span>}
                  {fileType === 'image' &&
                    <span className={styles.fileThumb}>
                      {file.MediaLink && <img
                        src={`${file.MediaLink}?width=110`}
                        alt={file.FileName}
                      />}
                    </span>}
                  {fileType === 'video' &&
                    <span className={styles.fileThumb}>
                      <Video className={styles.video} sources={[{ src: file.MediaLink, type: file.Type }]} />
                    </span>}
                  {fileType === 'document' &&
                  <span className={styles.fileThumb}>
                    <img src={FileImage} alt={file.FileName} />
                    <small>{extension}</small>
                  </span>}
                  {fileType === 'font' &&
                  <span className={styles.fileThumb}>
                    <img src={FontImage} alt={file.FileName} />
                  </span>}
                  <span className={styles.fileName}>{file.FileName}</span>
                  {file.FilePath !== '/' && <div className={styles.fileButtons}>
                    {['image', 'video'].includes(fileType) &&
                      <button
                        onClick={(e) => {
                          const previewPopup = (<PreviewPopup
                            file={file}
                            onClose={() => this.setState({ popup: false })}
                            type={fileType}
                          />);
                          this.setState({ popup: previewPopup });
                          e.stopPropagation();
                        }}
                      >
                        <PreviewIcon /></button>
                    }
                    {file.Type !== 'Folder' &&
                      <button
                        onClick={(e) => {
                          const anchor = document.createElement('a');
                          anchor.href = file.MediaLink;
                          anchor.target = '_blank';
                          anchor.download = file.FileName;
                          anchor.click();
                          e.stopPropagation();
                        }}
                        download={file.MediaLink}
                      >
                        <DownloadIcon />
                      </button>
                    }
                    <button
                      onClick={(e) => {
                        if (file.Type === 'Folder') {
                          this.editFolderPopup(file);
                        } else {
                          this.editFilePopup(file);
                        }
                        e.stopPropagation();
                      }}
                    ><EditIcon /></button>
                    <button
                      onClick={(e) => {
                        this.deleteFilePopup(file.Id);
                        e.stopPropagation();
                      }}
                    >
                      <TrashIcon /></button>
                  </div>}
                </div>
              );
            })}
            {files && !loading && !isGridView && files.map((file) => {
              const fileType = this.getFileType(file);
              let typeClass = '';
              if (fileType === 'folder') {
                typeClass = styles.fileFolder;
              } else if (fileType === 'image') {
                typeClass = styles.fileImage;
              }
              return (
                <div
                  key={`file-${file.Id}`}
                  className={`${styles.fileList} ${typeClass} ${selectedFiles.includes(file.Id) ? styles.activeFile : ''}`}
                  onContextMenu={(e) => { this.clearPopover(); e.preventDefault(); e.stopPropagation(); }}
                >
                  <div className={styles.fileName}>
                    <button
                      className={styles.checkBox}
                      onClick={() => this.handleCheckBoxClick(file.Id)}
                    >
                      {selectedFiles.includes(file.Id) ? <CheckBoxIcon /> : <CheckBoxBlankIcon />}
                    </button>
                    <button
                      className={styles.fileThumb}
                      onClick={() => {
                        if (file.Type === 'Folder') {
                          this.openFolder(file.Id, file.FilePath);
                        }
                      }}
                    >
                      {file.Type === 'Folder' &&
                        <span className={styles.fileThumb}>
                          <img src={file.Size > 0 ? FolderFullImage : FolderImage} alt={file.FileName} />
                        </span>}
                      {fileType === 'image' &&
                        <span className={styles.fileThumb}>
                          {file.MediaLink !== '' && <img src={file.MediaLink} alt={file.FileName} />}
                        </span>}
                      {fileType === 'video' &&
                        <span className={styles.fileThumb}>
                          <img src={VideoImage} alt={file.FileName} />
                        </span>}
                      {fileType === 'document' &&
                      <span className={styles.fileThumb}>
                        <img src={FileImage} alt={file.FileName} />
                      </span>}
                      {fileType === 'font' &&
                      <span className={styles.fileThumb}>
                        <img src={FontImage} alt={file.FileName} />
                      </span>}
                    </button>
                    <div className={styles.fileName}>
                      <div>{file.FileName}</div>
                    </div>
                  </div>
                  <div className={styles.fileDate}>{formatDate(file.CreatedDate)}</div>
                  <span className={styles.fileType}>{file.Type}</span>
                  <span className={styles.fileSize}>{bytesToSize(file.Size)}</span>
                  {file.FilePath !== '/' &&
                  <div className={styles.fileButtons}>
                    {['image', 'video'].includes(fileType) &&
                      <button
                        onClick={(e) => {
                          const previewPopup = (<PreviewPopup
                            file={file}
                            onClose={() => this.setState({ popup: false })}
                            type={fileType}
                          />);
                          this.setState({ popup: previewPopup });
                          e.stopPropagation();
                        }}
                      >
                        <PreviewIcon /></button>
                      }
                      {file.Type !== 'Folder' &&
                        <button
                          onClick={(e) => {
                            const anchor = document.createElement('a');
                            anchor.href = file.MediaLink;
                            anchor.target = '_blank';
                            anchor.download = file.FileName;
                            anchor.click();
                            e.stopPropagation();
                          }}
                          download={file.MediaLink}
                        >
                          <DownloadIcon />
                        </button>
                      }
                    <button
                      onClick={() => {
                        if (file.Type === 'Folder') {
                          this.editFolderPopup(file);
                        } else {
                          this.editFilePopup(file);
                        }
                      }}
                    ><EditIcon /></button>
                    <button onClick={() => this.deleteFile(file)}><TrashIcon /></button>
                  </div>}
                </div>
              );
            })}
            {popover}
          </div>
          { (loading || this.state.deleteQueue.length > 0) &&
            <div className={styles.loaderOverlay}>
              <div className={styles.loaderContainer}>
                <RefreshIndicator
                  size={40}
                  left={0}
                  top={0}
                  status="loading"
                  className={styles.loader}
                />
              </div>
            </div>}
          { pageLoading && <Loading />}
        </div>
        {popup}
        {uploadQueue.length > 0 &&
          <UploadPopup
            websiteID={websiteID}
            directory={path}
            files={uploadQueue}
            onClose={() => this.setState({ uploadQueue: [] })}
            onCompleted={(file) => {
              const dataItem = {
                CreatedDate: (new Date()).toString(),
                FileName: file.name,
                FilePath: path,
                Id: Math.random() * Math.random(),
                MediaLink: '',
                Size: file.size,
                Type: '',
                isDelete: false,
                isTemp: true,
              };
              this.setState({ data: [...this.state.data, dataItem] }, () => this.getFile());
              clearTimeout(this.reloadTimer);
              this.reloadTimer = setTimeout(() => {
                this.getData();
              }, 300);
            }}
            onUploadError={() => {
              // Do not thing
            }}
          />
        }
      </div>
    );
  }
}

FileManager.propTypes = {
  rootFolder: PropTypes.string,
  height: PropTypes.number,
  onSelectFile: PropTypes.func,
};

FileManager.defaultProps = {
  rootFolder: '/',
  height: 600,
  onSelectFile: undefined,
};

export default FileManager;
