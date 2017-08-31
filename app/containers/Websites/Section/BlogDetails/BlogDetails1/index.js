import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import TextBox from '../../../Components/TextBox';
import AddComment from '../../../Components/AddComment';

import request from '../../../../../utils/request';
import { prettyDate, formatDate } from '../../../../../utils';
import { apiUrl } from '../../../../../config';

import './styles.css';

class BlogDetails1 extends Component {
  constructor(props) {
    super(props);

    const hostname = window.location.hostname;
    const subDomain = hostname.substring(0, hostname.indexOf('.'));
    const path = window.location.pathname;
    let blogID = 0;

    const getIDregx = /(.*)\/(\d)(\/(.*))?$/;

    const match = getIDregx.exec(path);
    if (match && match.length > 2) {
      blogID = match[2];
    }

    const setting = {
      isShowBlogCreatedDate: false,
      IsShowBlogLastUpdateDate: false,
      isShowBlogAuthor: false,
    };

    this.state = { blogID, subDomain, replyTo: 0, setting };
  }

  componentDidMount() {
    request.get(`${apiUrl}/Websites/${this.state.subDomain}/Blog?$filter=Id eq ${this.state.blogID}`, {}, (response) => {
      if (response.data && response.data.Items.length > 0) {
        const blog = response.data.Items[0];
        this.setState({ blog });
      } else {
        this.setState({ error: 'not found' });
      }
    });

    request.get(`${apiUrl}/Websites/${this.state.subDomain}/BlogSetting`, {}, (response) => {
      if (response.data) {
        this.setState({ setting: response.data }, () => console.log(this.state.setting));
      } else {
        this.setState({ error: 'not found' });
      }
    });

    request.get(`${apiUrl}/Websites/${this.state.subDomain}/BlogComment?$filter=(Blog/Id eq ${this.state.blogID})`, {}, (response) => {
      if (response.data && response.data.Items.length > 0) {
        this.setState({ comments: response.data.Items });
      } else {
        this.setState({ error: 'not found' });
      }
    });
  }

  render() {
    const { id, editMode } = this.props;
    const { blogID, comments, replyTo, blog, setting } = this.state;

    if (blog) {
      return (
        <div
          className="blog-details-1"
          data-animation-id="section-blog-details"
          data-animation-design="blog-details-1"
          data-animation-section-id={id}
        >
          <Helmet>
            <title>{blog.Title}</title>
            <meta name="description" content={blog.Intorduction} />
            {
              // <meta property="og:title" content={this.state.blog.Title} />
              // <meta property="og:description" content={this.state.blog.Intorduction} />
            }
            <meta property="og:image" content={blog.ImageURL} />
          </Helmet>
          <h1>{blog.Title}</h1>
          <div className="content">
            <TextBox
              id={`blog-details-1-${id}`}
              editMode={editMode}
            >{blog.Content}</TextBox>
          </div>
          <div className="info">
            {setting.isShowBlogCreatedDate && <span>Created date: {formatDate(blog.CreatedDate)}</span>}
            {setting.IsShowBlogLastUpdateDate && <span>Modified date: {formatDate(blog.ModifiedDate)}</span>}
            {setting.isShowBlogAuthor && <span>Author: {blog.CreatedUser}</span>}
          </div>
          {blog.IsEnableComment &&
          <div className="comments">
            {comments && <div className="header">{comments.filter((c) => c.ReplyToId === null).length} Comments</div>}
            {comments && comments.filter((c) => c.ReplyToId === null).map((comment) =>
              <div data-animation-id={`comment-${comment.Id}`} key={`comment-${comment.Id}`}>
                <div className="comment">
                  <div className="name col-xs-12">
                    <a href={`mailto:${comment.Email}`}>{comment.Name}</a>
                    <small>{prettyDate(comment.DateTime)}</small>
                  </div>
                  <div className="col-xs-12">{comment.Text}</div>
                  <button
                    className="reply"
                    onClick={() => {
                      if (replyTo === comment.Id) {
                        this.setState({ replyTo: 0 });
                      } else {
                        this.setState({ replyTo: comment.Id });
                      }
                    }}
                  >Reply</button>
                </div>
                {comments.filter((c) => c.ReplyToId === comment.Id).map((reply) =>
                  <div
                    data-animation-id={`reply-${reply.Id}`}
                    key={`reply-${reply.Id}`}
                    className="comment-reply"
                  >
                    <div className="comment">
                      <div className="name col-xs-12">
                        <a href={`mailto:${reply.Email}`}>{reply.Name}</a>
                        <small>{prettyDate(reply.DateTime)}</small>
                      </div>
                      <div className="col-xs-12">{reply.Text}</div>
                    </div>
                  </div>
                )}
                {replyTo === comment.Id && <div className="add-comment-reply">
                  <div className="add-comment">
                    <AddComment key="add-a-reply" form={`add-a-reply-${comment.Id}`} blogID={blogID} replyToID={comment.Id} />
                  </div>
                </div>}
              </div>
            )}
            {replyTo === 0 && <div className="add-comment">
              <AddComment key="add-a-comment" form={`add-a-comment-${blogID}`} blogID={blogID} />
            </div>}
            {replyTo !== 0 &&
              <button
                className="btn-add-commnet"
                onClick={() => this.setState({ replyTo: 0 })}
              >Add a comment</button>}
          </div>
          }
        </div>
      );
    } else if (this.state.error) {
      return <div>{this.state.error}</div>;
    }

    return <div>Loading...</div>;
  }
}

BlogDetails1.propTypes = {
  id: PropTypes.number,
  editMode: PropTypes.bool,
};

BlogDetails1.defaultProps = {
  id: null,
  editMode: false,
};

export default BlogDetails1;
