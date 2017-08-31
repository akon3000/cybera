import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Layout from '../../../Layout';
import BreadCrumb from '../../../../../components/AdminLayout/components/BreadCrumb';
import Box from '../../../../../components/AdminLayout/components/Box';
import request from '../../../../../utils/request';
import { apiUrl } from '../../../../../config';
import Loading from '../../../../../components/Loading';
import styles from './styles.css';
import Button from '../../../../../components/Button';
import ConfirmPopup from '../../../../../components/ConfirmPopup';
import SuccessPopup from '../../../../../components/SuccessPopup';
import ErrorPopup from '../../../../../components/ErrorPopup';
import validate from '../../../../../utils/validate';

export class AuditComment extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      loading: true,
      submitMessage: '',
      showSuccessPopup: false,
      showConfirmation: false,
      comment: '',
      originalCommentText: '',
      adminReply: '',
      commentStatus: '',
      originalCommentStatus: '',
      commentWarn: '',
      adminReplyWarn: '',
      adminInfo: JSON.parse(localStorage.getItem('user')),
      blogId: 0,
      replyTo: true,
    };
  }

  componentDidMount() {
    const query = this.props.location.query;
    if (query.CommentId) {
      request.get(`${apiUrl}/Websites/${localStorage.getItem('websiteID')}/BlogComment?$filter=Id eq ${parseInt(query.CommentId, 10)}`, {}, (response) => {
        if (response.data && response.data.Items.length > 0) {
          const blogComment = response.data.Items[0];
          this.setState({
            loading: false,
            comment: blogComment.Text,
            originalCommentText: blogComment.Text,
            commentStatus: blogComment.Status,
            originalCommentStatus: blogComment.Status,
            blogId: (blogComment.Blog && blogComment.Blog.Id),
            replyTo: (blogComment.ReplyToId),
          });
        }
      });
    }
  }

  inputValidation(value) {
    let error = '';
    if (!value) {
      error = 'Please enter comment';
    } else {
      const isValidLength = validate.isValidLength(value, 250, 'Comment');
      if (isValidLength !== true) {
        error = isValidLength;
      }
    }
    return error;
  }

  editComment() {
    let commentWarn = '';
    commentWarn = this.inputValidation(this.state.comment);
    if (commentWarn !== '') {
      this.setState({ commentWarn });
    } else {
      this.setState({ loading: true });
      request.patch(
        `${apiUrl}/Websites/${localStorage.getItem('websiteID')}/BlogComment`,
        {
          Id: parseInt(this.props.location.query.CommentId, 10),
          Text: this.state.comment,
        },
        (response) => {
          if (!response.error) {
            this.setState({
              submitMessage: 'Comment details updated',
              originalCommentText: this.state.comment,
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
    }
  }

  commentStatusUpdate() {
    this.setState({ loading: true });
    request.patch(
      `${apiUrl}/Websites/${localStorage.getItem('websiteID')}/BlogComment`,
      {
        Id: parseInt(this.props.location.query.CommentId, 10),
        Status: this.state.commentStatus,
      },
      (response) => {
        if (!response.error) {
          this.setState({
            submitMessage: 'Comment status updated',
            originalCommentStatus: this.state.commentStatus,
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
  }

  AdminReplyComment() {
    let adminReplyWarn = '';
    adminReplyWarn = this.inputValidation(this.state.adminReply);
    this.setState({ adminReplyWarn });

    if (adminReplyWarn !== '') {
      this.setState({ adminReplyWarn });
    } else {
      this.setState({ loading: true });
      request.post(
        `${apiUrl}/Websites/${localStorage.getItem('websiteID')}/BlogComment`,
        {
          Text: this.state.adminReply,
          BlogId: parseInt(this.state.blogId, 10),
          AdminId: parseInt(this.state.adminInfo.Id, 10),
          ReplyToId: parseInt(this.props.location.query.CommentId, 10),
        },
        (response) => {
          if (!response.error) {
            this.setState({
              submitMessage: 'Reply to comment successfully',
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
    }
  }

  render() {
    const popup = [];
    const style = {
      customFont: {
        fontFamily: 'Montserrat',
        fontSize: '0.85em',
      },
    };

    if (this.state.showConfirmation) {
      popup.push(
        <ConfirmPopup
          key="showCommentConfirmation"
          data-automation-id="dialog-blogcomment-status-confirmation"
          onClose={() => { this.setState({ showConfirmation: false, commentStatus: this.state.originalCommentStatus }); }}
          actions={[
            <Button
              data-automation-id="btn-yes"
              onClick={() => { this.setState({ showConfirmation: false }); this.commentStatusUpdate(); }}
            >Yes</Button>,
            <Button
              btnStyle="negative"
              data-automation-id="btn-no"
              onClick={() => {
                this.setState({
                  showConfirmation: false,
                  commentStatus: this.state.originalCommentStatus,
                });
              }}
            >No</Button>,
          ]}
        >
          <h3>Comment Status Setting</h3>
          <div>Are you sure to update the status?</div>
        </ConfirmPopup>
      );
    }

    if (this.state.showSuccessPopup) {
      popup.push(
        <SuccessPopup
          key="categorySuccessPopup"
          data-automation-id="dialog-blog-auditcomment-success"
          onClose={() => { this.setState({ showSuccessPopup: false }); }}
        >
          <h3>You have been successful</h3>
          <div>{this.state.submitMessage}</div>
        </SuccessPopup>
      );
    }

    if (this.state.error) {
      popup.push(
        <ErrorPopup
          data-automation-id="error-blog-auditcomment-fail"
          key="Blog comment audit Error"
          error={this.state.error}
          onClose={() => { this.setState({ error: false }); }}
        />
      );
    }

    return (
      <Layout data-automation-id="page-blogcomment-audit">
        <BreadCrumb
          breadCrumb={[
            <button data-automation-id="btn-blog-link" key="Blog" onClick={() => this.props.history.push('/MCAdmin/Blog/Blog')}>Blog</button>,
            <button data-automation-id="btn-blogcomment-link" key="Comment" onClick={() => this.props.history.push('/MCAdmin/Blog/Comment')}>Comment</button>,
            <button data-automation-id="btn-blogcomment-audit-link" key="AuditComment" onClick={() => window.location.reload()}>Audit/Reply to Comment</button>,
          ]}
        />
        <h2>Audit/Reply to Comment</h2>
        <Box>
          <Row>
            <Col xs={12} sm={12} md={12}>
              <label htmlFor="Edit Comment" className={styles.Label}>Edit</label>
            </Col>
            <Col xs={12} sm={12} md={12}>
              <textarea
                data-automation-id="textarea-auditcomment-usercomment"
                rows="5"
                className={styles.textarea}
                value={this.state.comment}
                onChange={(evt) => this.setState({
                  comment: evt.target.value, commentWarn: '',
                }, () => {
                  this.setState({ commentWarn: this.inputValidation(this.state.comment) });
                })}
              />
              {this.state.commentWarn !== '' &&
                <div data-automation-id="div-commentaudit-usercomment-warntext" className={styles.warnText}>{this.state.commentWarn}</div>
              }
            </Col>
            <Col xs={12} sm={12} md={12}>
              <div className={styles.buttonFooter} >
                <Button
                  data-automation-id="btn-auditcomment-editusercomment-submit"
                  type="button"
                  onClick={() => this.editComment()}
                >Save</Button>
                <Button
                  data-automation-id="btn-auditcomment-editusercomment-cancel"
                  type="button"
                  btnStyle="negative"
                  onClick={() => this.setState({ comment: this.state.originalCommentText })}
                >Cancel</Button>
              </div>
            </Col>
          </Row>
          <Row style={{ marginTop: '30px' }}>
            <Col xs={12} sm={2} md={2}>
              <div className={styles.selectLabelContainer}>
                <label htmlFor="Update Comment Status">Update Status</label>
              </div>
            </Col>
            <Col xs={12} sm={6} md={6}>
              <div className={styles.selectContainer}>
                <SelectField
                  data-automation-id="select-auditcomment-updatestatus"
                  style={style.customFont}
                  value={this.state.commentStatus}
                  onChange={(event, index, value) => this.setState({ commentStatus: value })}
                >
                  {this.state.originalCommentStatus === 'Pending' &&
                    <MenuItem key="pending" value="Pending" primaryText="Pending" />
                  }
                  <MenuItem key="publish" value="Publish" primaryText="Publish" />
                  <MenuItem key="unpublish" value="Unpublish" primaryText="Unpublish" />
                </SelectField>
              </div>
            </Col>
            <Col xs={12} sm={4} md={4}>
              <div style={{ float: 'right', marginRight: '147px' }}>
                <Button
                  data-automation-id="btn-auditcomment-updatestatus-submit"
                  type="button"
                  onClick={() => {
                    if (this.state.commentStatus !== this.state.originalCommentStatus) {
                      this.setState({ showConfirmation: true });
                    }
                  }}
                >Save</Button>
              </div>
            </Col>
          </Row>
          {!this.state.replyTo &&
          <Row style={{ marginTop: '30px' }}>
            <Col xs={12} sm={12} md={12}>
              <label htmlFor="Reply to Comment" className={styles.Label}>Reply As Admin</label>
            </Col>
            <Col xs={12} sm={12} md={12}>
              <textarea
                data-automation-id="textarea-auditcomment-adminreply"
                rows="5"
                className={styles.textarea}
                value={this.state.adminReply}
                onChange={(evt) => this.setState({
                  adminReply: evt.target.value, adminReplyWarn: '',
                }, () => {
                  this.setState({ adminReplyWarn: this.inputValidation(this.state.adminReply) });
                })}
              />
              {this.state.adminReplyWarn !== '' &&
                <div data-automation-id="div-commentaudit-admincomment-warntext" className={styles.warnText}>{this.state.adminReplyWarn}</div>
              }
            </Col>
            <Col xs={12} sm={12} md={12}>
              <div className={styles.buttonFooter} >
                <Button
                  data-automation-id="btn-auditcomment-adminreply-submit"
                  type="button"
                  onClick={() => this.AdminReplyComment()}
                >Save</Button>
                <Button
                  data-automation-id="btn-auditcomment-adminreply-cancel"
                  type="button"
                  btnStyle="negative"
                  onClick={() => this.setState({ adminReply: '' })}
                >Cancel</Button>
              </div>
            </Col>
          </Row>}
          {popup}
        </Box>
        {this.state.loading && <Loading />}
      </Layout>);
  }
}

AuditComment.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default AuditComment;
