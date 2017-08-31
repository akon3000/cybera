import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import { Link } from 'react-router-dom';
import EditIcon from 'react-icons/lib/md/visibility';
import DeleteIcon from 'react-icons/lib/md/delete';
import { reduxForm } from 'redux-form/immutable';
import Layout from '../../Layout';
import BreadCrumb from '../../../../components/AdminLayout/components/BreadCrumb';
import Box from '../../../../components/AdminLayout/components/Box';
import Table from './Table';
import { formatDate } from '../../../../utils';
import styles from './styles.css';
import request from '../../../../utils/request';
import { apiUrl } from '../../../../config';
import Button from '../../../../components/Button';
import ConfirmPopup from '../../../../components/ConfirmPopup';
import SuccessPopup from '../../../../components/SuccessPopup';
import ErrorPopup from '../../../../components/ErrorPopup';

class Comment extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      filter: [],
      submitMessage: '',
      showSuccessPopup: false,
      showConfirmation: false,
      deleteCommentId: '',
      pageForceReloadCount: 0,
      allNumber: 0,
      pendingNumber: 0,
      publishNumber: 0,
      unpublishNumber: 0,
    };
  }

  componentWillMount() {
    this.loadNumbers();
  }

  loadNumbers() {
    request.get(`${apiUrl}/Websites/${localStorage.getItem('websiteID')}/BlogComment`, {}, (response) => {
      if (response.data) {
        this.setState({
          allNumber: response.data.Items.length,
          pendingNumber: (response.data.Items.filter((item) => item.Status === 'Pending')).length,
          publishNumber: (response.data.Items.filter((item) => item.Status === 'Publish')).length,
          unpublishNumber: (response.data.Items.filter((item) => item.Status === 'Unpublish')).length,
        });
      }
    });
  }

  search(status) {
    const filter = [
      { Columns: ['Status'], keywords: status },
    ];
    this.setState({ filter, search: true });
  }

  DeleteComment() {
    this.setState({ loading: true }, () => {
      request.delete(
        `${apiUrl}/Websites/${localStorage.getItem('websiteID')}/BlogComment/${this.state.deleteCommentId}`,
        {},
        (response) => {
          if (!response.error) {
            this.setState({
              submitMessage: 'Comments/reply to comment deleted successfully',
              showSuccessPopup: true,
              loading: false,
            });
          } else {
            this.setState({
              error: response.error,
              loading: false,
            });
          }
        }
      );
    });
  }

  render() {
    const popup = [];

    if (this.state.showConfirmation) {
      popup.push(
        <ConfirmPopup
          key="showDeleteCommentConfirmation"
          data-automation-id="dialog-comment-delete-confirmation"
          onClose={() => { this.setState({ showConfirmation: false }); }}
          actions={[
            <Button
              data-automation-id="btn-yes"
              onClick={() => { this.setState({ showConfirmation: false }); this.DeleteComment(); }}
            >Yes</Button>,
            <Button
              btnStyle="negative"
              data-automation-id="btn-no"
              onClick={() => {
                this.setState({ showConfirmation: false });
              }}
            >No</Button>,
          ]}
        >
          <h3>Comment Delete</h3>
          <div>Are you sure to delete the comments/reply to comment?</div>
        </ConfirmPopup>
      );
    }

    if (this.state.showSuccessPopup) {
      popup.push(
        <SuccessPopup
          key="CommentDeleteSuccessPopup"
          data-automation-id="dialog-comment-delete-success"
          onClose={() => {
            this.setState({
              showSuccessPopup: false,
              pageForceReloadCount: this.state.pageForceReloadCount + 1,
            }, () => {
              this.loadNumbers();
            });
          }}
        >
          <h3>You have been successful</h3>
          <div>{this.state.submitMessage}</div>
        </SuccessPopup>
      );
    }

    if (this.state.error) {
      popup.push(
        <ErrorPopup
          data-automation-id="error-commment-delete-fail"
          key="Comment Delete Error"
          error={this.state.error}
          onClose={() => { this.setState({ error: false }); }}
        />
      );
    }

    const header = [
      { Label: 'Blog', Name: 'Blog', align: 'center' },
      { Label: 'Comment', Name: 'Comment', align: 'center' },
      { Label: 'Reply to Comment', Name: 'Reply to Comment', align: 'center' },
      { Label: 'Submitted by', Name: 'Submitted by', align: 'center' },
      { Label: 'Email Address', Name: 'Email Address', align: 'center' },
      { Label: 'Submitted On', Name: 'SubmittedOn', align: 'center' },
      { Label: 'SubmittedOn', Name: 'Hide', align: 'center' },
      { Label: 'Status', Name: 'Hide', align: 'center' },
      { Label: 'SortDisable', Name: 'SortDisable', align: 'center' },
    ];

    const body = [
      (value) => (value.Blog && value.Blog.Title),
      (value) => {
        const commentText = (!value.ReplyToId) ? value.Text : '';
        return commentText;
      },
      (value) => {
        const commentText = (value.ReplyToId) ? value.Text : '';
        return commentText;
      },
      (value) => value.Name,
      (value) => value.Email,
      (value) => (value.DateTime ? formatDate(value.DateTime) : ''),
      (value) => value.DateTime,
      (value) => {
        let status = '';
        if (value.Status === 'Publish') {
          status = 'Publish';
        } else if (value.Status === 'Unpublish') {
          status = 'Unpub';
        } else {
          status = value.Status;
        }
        return status;
      },
      (value) => [<Link
        key="EditIcon"
        style={{ textDecoration: 'none' }}
        to={{
          pathname: '/MCAdmin/Blog/Comment/AuditComment',
          search: `?CommentId=${value.Id}`,
        }}
      >
        <EditIcon />
      </Link>,
        <button
          key="DeleteIcon"
          style={{ textDecoration: 'none', marginLeft: '10px' }}
          onClick={() => this.setState({ showConfirmation: true, deleteCommentId: value.Id })}
        >
          <DeleteIcon />
        </button>],
    ];

    const downloadbody = [
      (value) => value.Blog,
      (value) => value.Comment,
      (value) => value['Reply to Comment'],
      (value) => value['Submitted by'],
      (value) => value['Email Address'],
      (value) => value['Submitted On'],
    ];

    return (
      <Layout data-automation-id="page-blog-comment">
        <BreadCrumb
          breadCrumb={[
            <button data-automation-id="btn-blog-link" key="blog" onClick={() => this.props.history.push('/MCAdmin/Blog/Blog')}>Blog</button>,
            <button data-automation-id="btn-blog-comment-link" key="Comment" onClick={() => window.location.reload()}>Comments/Reply To</button>,
          ]}
        />
        <h2>Comments/Reply To</h2>
        <Box>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <button
                data-automation-id="btn-blog-comment-filter-all"
                className={styles.searchButton}
                onClick={() => this.setState({ filter: [] }, () => { this.props.reset(); })}
              >All({this.state.allNumber})</button>
              <button
                data-automation-id="btn-blog-comment-filter-pending"
                className={styles.searchButton}
                onClick={() => this.search('Pending')}
              >Pending({this.state.pendingNumber})</button>
              <button
                data-automation-id="btn-blog-comment-filter-publish"
                className={styles.searchButton}
                onClick={() => this.search('Publish')}
              >Publish({this.state.publishNumber})</button>
              <button
                data-automation-id="btn-blog-comment-filter-unpublish"
                className={styles.searchButton}
                onClick={() => this.search('Unpub')}
              >Unpublish({this.state.unpublishNumber})</button>
            </Col>
          </Row>
          <Table
            data-automation-id="table-blog-comment"
            dataSource={`Websites/${localStorage.getItem('websiteID')}/BlogComment`}
            header={header}
            body={body}
            downloadBody={downloadbody}
            filter={this.state.filter}
            fileName="Blog Comments"
            pageForceReload={this.state.pageForceReloadCount}
            onClearSearch={() => {
              this.setState({ filter: [] }, () => {
                this.props.reset();
              });
            }}
          />
          {popup}
        </Box>
      </Layout>);
  }
}

Comment.propTypes = {
  history: PropTypes.object.isRequired,
  reset: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'Comment',
})(Comment);
