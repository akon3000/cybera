import React from 'react';
import PropTypes from 'prop-types';

import Layout from '../Layout';
import BreadCrumb from '../../../components/AdminLayout/components/BreadCrumb';
import Box from '../../../components/AdminLayout/components/Box';
import FileManager from '../../../components/FileManager';

import request from '../../../utils/request';
import { apiUrl } from '../../../config';

import { numberWithCommas, bytesToMB } from '../../../utils';
// import styles from './styles.css';

class DashBoard extends React.Component {
  constructor() {
    super();
    this.state = {
      fileSize: false,
    };
  }

  componentDidMount() {
    request.get(`${apiUrl}/0/File`, {}, (response) => {
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
  }

  render() {
    const { fileSize } = this.state;
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
          {fileSize !== false && <p>Your file manager total use: {numberWithCommas(bytesToMB(fileSize))} MB</p>}
          <FileManager />
        </Box>
      </Layout>);
  }
}

DashBoard.propTypes = {
  location: PropTypes.object.isRequired,
};

export default DashBoard;
