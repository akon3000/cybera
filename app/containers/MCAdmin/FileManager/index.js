import React from 'react';
import PropTypes from 'prop-types';

import Layout from '../Layout';
import BreadCrumb from '../../../components/AdminLayout/components/BreadCrumb';
import Box from '../../../components/AdminLayout/components/Box';
import FileManager from '../../../components/FileManager';

import request from '../../../utils/request';
import { apiUrl } from '../../../config';

import { bytesToMB } from '../../../utils';
// import auth from '../../../utils/auth';
// import styles from './styles.css';

class DashBoard extends React.Component {
  constructor() {
    super();
    this.state = {
      fileSize: undefined,
      maxFileSize: undefined,
      websiteID: localStorage.getItem('websiteID'),
    };
  }

  componentDidMount() {
    const { websiteID } = this.state;
    request.get(`${apiUrl}/${websiteID}/File`, {}, (response) => {
      if (response.data) {
        let fileSize = 0;// response.data.Items.reduce((a, b) => a.Size + b.Size, 0);
        const rootFolders = response.data.Items.filter((f) => f.FilePath === '/');
        for (let i = 0; i < rootFolders.length; i += 1) {
          fileSize += response.data.Items[i].Size;
        }
        this.setState({ files: response.data.Items, fileSize });
      } else {
        this.setState({ error: response.error });
      }
    });

    request.get(`${apiUrl}/Websites/${websiteID}/WebsitePlan/false`, {}, (response) => {
      if (response.data) {
        let maxFileSize = response.data.PlanDetail.StorageSize;
        if (response.data.PlanDetail.Id === 4) {
          maxFileSize = 0;
        }
        this.setState({ maxFileSize });
      } else {
        this.setState({ error: response.error });
      }
    });
  }

  render() {
    const { fileSize, maxFileSize } = this.state;
    let storageMonitoring;
    if (fileSize >= 0 && maxFileSize >= 0) {
      const mbFileSize = bytesToMB(fileSize);
      const mbMaxFileSize = maxFileSize * 1024;
      if (maxFileSize === 0) {
        storageMonitoring = <p>Your file manager total use: {mbFileSize} MB</p>;
      } else {
        storageMonitoring = <p>{`Your file manager usage: ${((mbFileSize / mbMaxFileSize) * 100).toFixed(2)}% used, ${(mbMaxFileSize - mbFileSize).toFixed(2)} MB available. Please delete unnecessary content to free up storage space.`}</p>;
      }
    }
    return (
      <Layout>
        <BreadCrumb
          breadCrumb={[
            <button key="File Manager" onClick={() => window.location.reload()}>File Manager</button>,
          ]}
        />
        <h2>File Manager</h2>
        <Box>
          <h3>Storage Monitoring</h3>
          {storageMonitoring}
          <FileManager />
        </Box>
      </Layout>);
  }
}

DashBoard.propTypes = {
  location: PropTypes.object.isRequired,
};

export default DashBoard;
