import React from 'react';
import PropTypes from 'prop-types';
import HomePage from '../Home';
import CommentEditor from '../../../components/CommentEditor';

class PublicComment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const popup = [];
    let pageSource = '';
    if (window.location.href.indexOf('PublicCommentReply') !== -1) {
      pageSource = 'PublicCommentReply';
    } else {
      pageSource = 'PublicComment';
    }

    popup.push(
      <CommentEditor
        data-automation-id="dialog-public-comment"
        key="publicComment"
        pageSource={pageSource}
        websiteId={1}
        BlogId={3}
        ReplyToId={10}
      />
    );

    return (
      <div data-automation-id="page-public-comment">
        <HomePage />
        {popup}
      </div>
    );
  }
}

PublicComment.propTypes = {
  location: PropTypes.object.isRequired,
};

export default PublicComment;
