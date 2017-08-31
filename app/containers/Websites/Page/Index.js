import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import request from '../../../utils/request';
import { apiUrl } from '../../../config';
import LoadingPage from '../../../components/LoadingPage';

import Template from '../Template';
import SectionLoaders from '../Section/loaders';

class Page extends React.Component {
  constructor(props) {
    super(props);

    const hostname = window.location.hostname;
    const subDomain = hostname.substring(0, hostname.indexOf('.'));
    let path = window.location.pathname;

    const getIDregx = /(.*)\/(\d)(\/(.*))?$/;

    const match = getIDregx.exec(path);
    if (match) {
      path = match[1];
    }

    this.state = {
      subDomain,
      path,
      pageData: null,
      error: null,
    };
  }

  componentWillMount() {
    request.get(`${apiUrl}/Website/${this.state.subDomain}/Page?path=${this.state.path}`, {}, (response) => {
      if (response.data) {
        // response.data.Header = JSON.parse(response.data.Header);
        response.data.Body = JSON.parse(response.data.Body);
        // response.data.Footer = JSON.parse(response.data.Footer);
        this.setState({ pageData: response.data });
      } else {
        this.setState({ error: response.error });
      }
    });
  }

  getSubdomain() {
    let hostname = window.location.hostname;
    hostname = hostname.substring(0, hostname.indexOf('.'));
    return hostname;
  }

  render() {
    if (this.state.pageData) {
      return (
        <Template id={this.state.pageData.TemplateId} className={`page-${this.state.pageData.Name.toLowerCase()}`}>
          <Helmet>
            <title>{`${this.state.pageData.Name}`}</title>
          </Helmet>
          {
            // SectionLoaders.getHeader(this.state.pageData.Header)
          }
          { this.state.pageData.Body.map((section) => SectionLoaders.getBody(section))}
          {
            // SectionLoaders.getFooter(this.state.pageData.Footer)
          }
        </Template>);
    } else if (this.state.error) {
      return <div>{this.state.error}</div>;
    }
    return <LoadingPage />;
  }
}

Page.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Page;
