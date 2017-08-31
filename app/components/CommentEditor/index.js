import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import message from '../../Message';
import validate from '../../utils/validate';
import Button from '../Button';
import request from '../../utils/request';
import { apiUrl } from '../../config';
import SuccessPopup from '../SuccessPopup';
import ErrorPopup from '../ErrorPopup';
import Loading from '../Loading';

export class CommentEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pageSource: props.pageSource,
      comment: '',
      commentErrorMessage: '',
      name: '',
      nameErrorMessage: '',
      email: '',
      emailErrorMessage: '',
      submitMessage: '',
      showSuccessPopup: false,
      error: false,
    };
  }

  handleSubmit(evt) {
    evt.preventDefault();
    let commentErrorMessage = '';
    let nameErrorMessage = '';
    let emailErrorMessage = '';

    if (this.state.comment === '') {
      commentErrorMessage = 'Please enter comment';
    } else {
      const isValidLength = validate.isValidLength(this.state.comment, 250, 'Comment');
      if (isValidLength !== true) {
        commentErrorMessage = isValidLength;
      } else {
        commentErrorMessage = '';
      }
    }

    if (this.state.name === '') {
      nameErrorMessage = 'Please enter name';
    } else {
      const isValidLength = validate.isValidLength(this.state.name, 50, 'Name');
      const isName = validate.isNameWithNumbers(this.state.name, "-.'", true);
      if (isValidLength !== true && isName !== true) {
        nameErrorMessage = `${isValidLength}.  ${isName}.`;
      } else if (isValidLength !== true) {
        nameErrorMessage = isValidLength;
      } else if (isName !== true) {
        nameErrorMessage = isName;
      } else {
        nameErrorMessage = '';
      }
    }

    if (this.state.email === '') {
      emailErrorMessage = 'Please enter email address';
    } else {
      const isValidLength = validate.isValidLength(this.state.email, 100, 'Email address');
      const isEmail = validate.isEmail(this.state.email);
      if (isValidLength !== true && !isEmail) {
        emailErrorMessage = `${isValidLength}.  ${message.error.NOT_VALID_EMAIL}.`;
      } else if (isValidLength !== true) {
        emailErrorMessage = isValidLength;
      } else if (!isEmail) {
        emailErrorMessage = message.error.NOT_VALID_EMAIL;
      } else {
        emailErrorMessage = '';
      }
    }

    this.setState({
      commentErrorMessage,
      nameErrorMessage,
      emailErrorMessage,
    });

    if (commentErrorMessage === '' && nameErrorMessage === '' && emailErrorMessage === '') {
      this.setState({ loading: true });
      let postBodyParams = {};
      if (this.state.pageSource === 'PublicComment') {
        postBodyParams = {
          Text: this.state.comment,
          Name: this.state.name,
          Email: this.state.email,
          BlogId: this.props.BlogId,
        };
      } else if (this.state.pageSource === 'PublicCommentReply') {
        postBodyParams = {
          Text: this.state.comment,
          Name: this.state.name,
          Email: this.state.email,
          BlogId: this.props.BlogId,
          ReplyToId: this.props.ReplyToId,
        };
      }
      request.post(`${apiUrl}/Websites/${this.props.websiteId}/BlogComment`,
        postBodyParams,
        (response) => {
          if (!response.error) {
            this.setState({
              submitMessage: 'Thank you for your comment. As soon as your comment get admin verification, it will be published.',
              showSuccessPopup: true,
              comment: '',
              name: '',
              email: '',
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
    if (this.state.showSuccessPopup) {
      popup.push(
        <SuccessPopup
          key="commentsuccessPopup"
          data-automation-id="dialog-comment-submit-success"
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
          data-automation-id="error-comment-submit-fail"
          key="Comment Error"
          error={this.state.error}
          onClose={() => { this.setState({ error: false }); }}
        />
      );
    }

    return (
      <div>
        <form data-automation-id="form-public-comment" onSubmit={(evt) => this.handleSubmit(evt)}>
          <div className={styles.background}>
            <div className={styles.box}>
              <div data-automation-id="title-public-comment" key="Popup_Title" className={styles.titleBox}>
                {this.state.pageSource === 'PublicComment' && 'Public comment'}
                {this.state.pageSource === 'PublicCommentReply' && 'Public reply to comment'}
              </div>
              <div className={styles.formContent}>
                <div style={{ marginBottom: '10px' }} >
                  <textarea
                    data-automation-id="textarea-public-comment-content"
                    rows="5"
                    placeholder="Comment"
                    value={this.state.comment}
                    onChange={(evt) => this.setState({ commentErrorMessage: '', comment: evt.target.value })}
                  />
                  <div className={styles.hintText} data-automation-id="error-public-comment-content">{this.state.commentErrorMessage}</div>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <input
                    data-automation-id="input-public-comment-name"
                    type="text"
                    placeholder="Name"
                    value={this.state.name}
                    onChange={(evt) => this.setState({ nameErrorMessage: '', name: evt.target.value })}
                  />
                  <div className={styles.hintText} data-automation-id="error-public-comment-name">{this.state.nameErrorMessage}</div>
                </div>
                <div>
                  <input
                    data-automation-id="input-public-comment-email"
                    type="text"
                    placeholder="Email"
                    value={this.state.email}
                    onChange={(evt) => this.setState({ emailErrorMessage: '', email: evt.target.value })}
                  />
                  <div className={styles.hintText} data-automation-id="error-public-comment-email">{this.state.emailErrorMessage}</div>
                </div>
                <Button data-automation-id="btn-submit-comment" type="submit">Submit</Button>
              </div>
            </div>
          </div>
        </form>
        {popup}
        {this.state.loading && <Loading />}
      </div>
    );
  }
}

CommentEditor.propTypes = {
  pageSource: PropTypes.string.isRequired,
  websiteId: PropTypes.number.isRequired,
  BlogId: PropTypes.number.isRequired,
  ReplyToId: PropTypes.number.isRequired,
};

export default CommentEditor;
