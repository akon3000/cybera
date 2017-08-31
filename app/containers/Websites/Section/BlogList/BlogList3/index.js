import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './styles.css';

import Image from '../../../Components/Image';
import TextBox from '../../../Components/TextBox';
import request from '../../../../../utils/request';
import { apiUrl } from '../../../../../config';

class BlogList3 extends Component {
  constructor(props) {
    super(props);
    const hostname = window.location.hostname;
    const subDomain = hostname.substring(0, hostname.indexOf('.'));
    this.state = {
      subDomain,
      blog: [],
      error: null,
    };
  }

  componentWillMount() {
    request.get(`${apiUrl}/Websites/${this.state.subDomain}/Blog`, {}, (response) => {
      if (response.data) {
        this.setState({ blog: response.data.Items });
      } else {
        this.setState({ error: response.error });
      }
    });
  }

  render() {
    const { id, title, setting, editMode } = this.props;

    const sectionBlogTitle = setting.title.show ? (
      <div style={{ backgroundColor: setting.title.backgroundColor }}>
        <TextBox
          id={`blog-list-title-3-${id}`}
          editMode={editMode}
          sectionID={id}
          type="title"
        >{ title }</TextBox>
      </div>
    ) : null;

    const sectionBlogList = this.state.blog.length > 0 ? (
      <div className="row-spacial padding-left padding-right">
        {
          this.state.blog.map((x) => (
            <div
              key={`blog-list-${id}-${x.Id}`}
              className="col-md-4 col-sm-12"
            >
              <Image
                key={`blog-list-image-${id}-${x.Id}`}
                editMode={false}
                url={x.ImageURL}
                type="BlogListImage"
                sectionID={id}
                id={x.Id}
                width={`${setting.imageSize.width}px`}
                link={{ url: x.ShortenedURL, target: '_blank' }}
                height={`${setting.imageSize.height}px`}
                deletable={false}
                style={{ overflow: 'hidden' }}
                imageStyle={{ width: '100%', maxHeight: 'none', height: '100%' }}
              />
              <div className="hr" />
              <div className="hr" />
              <h3>{x.Title}</h3>
              <TextBox
                key={`blog-list-content-3-${id}-${x.id}`}
                id={`blog-list-content-3-${id}-${x.id}`}
                editMode={false}
                sectionID={id}
                type={`${x.Id}`}
              >{ x.Content }</TextBox>
              <div className="hr" />
            </div>
          ))
        }
      </div>
    ) : (
      <div className="blog-is-empty">
        <div className="message">
          <h1>...No Blog List Item...</h1>
        </div>
      </div>
    );

    return (
      <div
        className="blog-list-3"
        data-automation-id="section-blog-list"
        data-automation-design="blog-list-3"
        data-automation-section-id={id}
      >
        { sectionBlogTitle }
        { sectionBlogList }
      </div>
    );
  }
}

BlogList3.propTypes = {
  id: PropTypes.number.isRequired,
  setting: PropTypes.object,
  title: PropTypes.string,
  editMode: PropTypes.bool,
};

BlogList3.defaultProps = {
  setting: {},
  title: '',
  editMode: false,
};

export default BlogList3;
