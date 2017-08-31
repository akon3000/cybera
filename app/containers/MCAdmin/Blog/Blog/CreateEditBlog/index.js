import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form/immutable';
import { Row, Col } from 'react-flexbox-grid';
import MenuItem from 'material-ui/MenuItem';

import Layout from '../../../Layout';
import BreadCrumb from '../../../../../components/AdminLayout/components/BreadCrumb';
import Box from '../../../../../components/AdminLayout/components/Box';
import Input from '../../../../../components/Input';
import InputImage from '../../../../../components/InputImage';
import request from '../../../../../utils/request';
import { apiUrl } from '../../../../../config';
import Loading from '../../../../../components/Loading';
import styles from './styles.css';
import Button from '../../../../../components/Button';
import TextArea from '../../../../../components/TextArea';
import Select from '../../../../../components/Select';
import ConfirmPopup from '../../../../../components/ConfirmPopup';
import SuccessPopup from '../../../../../components/SuccessPopup';
import ErrorPopup from '../../../../../components/ErrorPopup';
import validate from '../../../../../utils/validate';
import TinyMCE from '../../../../../components/TinyMCE';

export const decode = (encodedStr) => {
  const elem = document.createElement('textarea');
  elem.innerHTML = encodedStr;

  return elem.value;
};


export const BlogFormValidate = (values) => {
  const errors = {};

  const requiredFields = {
    title: 'Please enter blog title',
    introductionImage: 'Please upload blog introduction image',
    category: 'Please choose category',
    introduction: 'Please enter introduction',
    content: 'Please enter content',
  };

  for (const [field, hint] of Object.entries(requiredFields)) { // eslint-disable-line
    if (!values.get(field)) {
      errors[field] = hint;
    }
  }

  if (values.get('title')) {
    const isValidLength = validate.isValidLength(values.get('title'), 50, 'Blog title');
    if (isValidLength !== true) {
      errors.title = isValidLength;
    }
  }

  if (values.get('introduction')) {
    const isValidLength = validate.isValidLength(values.get('introduction'), 100, 'Introduction');
    if (isValidLength !== true) {
      errors.introduction = isValidLength;
    }
  }

  if (values.get('content')) {
    const isValidLength = validate.isValidLength(values.get('content'), 5000, 'Content');
    if (isValidLength !== true) {
      errors.content = isValidLength;
    }
  }

  return errors;
};

export class CreateEditBlog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      loading: true,
      submitMessage: '',
      showSuccessPopup: false,
      showConfirmation: false,
      IsActive: false,
      publicComment: true,
      categoryList: [],
      facebookEmpty: false,
      twitterEmpty: false,
      instagramEmpty: false,
      shareFacebook: false,
      shareTwitter: false,
      shareInstagram: false,
      pageFunction: 'Create',
      content: '',
    };
  }

  componentWillMount() {
    const query = this.props.location.query;
    if (query.BlogId) {
      this.setState({ pageFunction: 'Edit' });
    }
    request.get(`${apiUrl}/Websites/${localStorage.getItem('websiteID')}/SocialNetworks`, {},
    (response) => {
      if (response.data) {
        this.setState({ facebookEmpty: (!response.data.Facebook.UrlFacebook),
          twitterEmpty: (!response.data.Twitter.UrlTwitter),
          instagramEmpty: (!response.data.Instagram.UrlInstagram),
        });
      }
    });
    request.get(`${apiUrl}/Websites/${localStorage.getItem('websiteID')}/BlogCategory`, {}, (response) => {
      if (response.data) {
        this.setState({ loading: false, categoryList: response.data.Items });
      }
    });
  }

  componentDidMount() {
    const query = this.props.location.query;
    if (query.BlogId) {
      request.get(`${apiUrl}/Websites/${localStorage.getItem('websiteID')}/Blog?$filter= Id eq ${query.BlogId}`, {}, (response) => {
        if (response.data && response.data.Items.length > 0) {
          const blog = response.data.Items[0];
          this.setState({
            IsActive: blog.IsActive,
            content: blog.Content,
            publicComment: blog.IsEnableComment,
            shortenedURL: blog.ShortenedURL }, () => {
            this.handleInitialize(blog);
          });
        }
      });
    }
  }

  handleInitialize(data) {
    const initData = {
      title: data.Title,
      introductionImage: data.ImageURL,
      category: (data.BlogCategory && data.BlogCategory.Id),
      introduction: data.Introduction,
      content: data.Content,
    };
    this.props.initialize(initData);
  }

  submit(values) {
    if (this.state.pageFunction === 'Create') {
      this.setState({ loading: true });
      request.post(
        `${apiUrl}/Websites/${localStorage.getItem('websiteID')}/Blog`,
        {
          Title: values.get('title'),
          IsActive: this.state.IsActive,
          Introduction: values.get('introduction'),
          Content: values.get('content'),
          BlogCategoryId: values.get('category'),
          ImageURL: values.get('introductionImage'),
          IsEnableComment: this.state.publicComment,
        },
        (response) => {
          if (!response.error) {
            this.setState({
              submitMessage: 'New blog created',
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
    } else if (this.state.pageFunction === 'Edit') {
      this.setState({ loading: true });
      request.put(
        `${apiUrl}/Websites/${localStorage.getItem('websiteID')}/Blog`,
        {
          Id: parseInt(this.props.location.query.BlogId, 10),
          IsActive: this.state.IsActive,
          Title: values.get('title'),
          Introduction: values.get('introduction'),
          Content: values.get('content'),
          BlogCategoryId: values.get('category'),
          ImageURL: values.get('introductionImage'),
          IsEnableComment: this.state.publicComment,
        },
        (response) => {
          if (!response.error) {
            this.setState({
              submitMessage: 'Blog details updated',
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

  ToggleStatus() {
    this.setState({ showConfirmation: true, IsActive: !this.state.IsActive });
  }

  TogglePublicComment() {
    this.setState({ publicComment: !this.state.publicComment });
  }

  ToggleSocialMedia(socialMedia) {
    if (socialMedia === 'facebook') {
      this.setState({ shareFacebook: !this.state.shareFacebook });
    } else if (socialMedia === 'twitter') {
      this.setState({ shareTwitter: !this.state.shareTwitter });
    } else if (socialMedia === 'instagram') {
      this.setState({ shareInstagram: !this.state.shareInstagram });
    }
  }

  render() {
    const categoryMenuItem = [];
    this.state.categoryList.forEach((n) => {
      if (n.IsActive) {
        categoryMenuItem.push(<MenuItem key={`category_${n.Id}`} value={parseInt(n.Id, 10)} primaryText={n.Name} />);
      }
    });

    const { handleSubmit } = this.props;
    const popup = [];

    if (this.state.showConfirmation) {
      popup.push(
        <ConfirmPopup
          key="showBlogConfirmation"
          data-automation-id="dialog-blog-status-confirmation"
          onClose={() => { this.setState({ showConfirmation: false, IsActive: !this.state.IsActive }); }}
          actions={[
            <Button data-automation-id="btn-yes" onClick={() => { this.setState({ showConfirmation: false }); }}>Yes</Button>,
            <Button
              btnStyle="negative"
              data-automation-id="btn-no"
              onClick={() => {
                this.setState({
                  showConfirmation: false,
                  IsActive: !this.state.IsActive,
                });
              }}
            >No</Button>,
          ]}
        >
          <h3>Blog Status Setting</h3>
          {this.state.IsActive && <div>Are you sure to publish the blog?</div>}
          {!this.state.IsActive && <div>Are you sure to unpublish the blog?</div>}
        </ConfirmPopup>
      );
    }

    if (this.state.showSuccessPopup) {
      popup.push(
        <SuccessPopup
          key="blogSuccessPopup"
          data-automation-id="dialog-blog-createedit-success"
          onClose={() => { this.setState({ showSuccessPopup: false }); this.props.history.push('/MCAdmin/Blog/Blog'); }}
        >
          <h3>You have been successful</h3>
          <div>{this.state.submitMessage}</div>
        </SuccessPopup>
      );
    }

    if (this.state.error) {
      popup.push(
        <ErrorPopup
          data-automation-id="error-blog-createedit-fail"
          key="Blog Error"
          error={this.state.error}
          onClose={() => { this.setState({ error: false }); }}
        />
      );
    }

    return (
      <Layout data-automation-id="page-blog-createedit">
        <BreadCrumb
          breadCrumb={[
            <button data-automation-id="btn-blog-link" key="BlogLink" onClick={() => this.props.history.push('/MCAdmin/Blog/Blog')}>Blog</button>,
            <button data-automation-id="btn-blog-createedit-link" key="CreateEditBlog" onClick={() => window.location.reload()}>{(this.state.pageFunction === 'Create') ? 'Create New Blog' : 'Edit Blog'}</button>,
          ]}
        />
        <h2>{(this.state.pageFunction === 'Create') ? 'Create New Blog' : 'Edit Blog'}</h2>
        <Box>
          <form data-automation-id="form-blog-createedit" onSubmit={handleSubmit((values) => this.submit(values))}>
            <Row>
              <Col xs={12} md={4}>
                <Field
                  data-automation-id="input-blog-createedit-image"
                  label="Introduction Image" name="introductionImage"
                  type="text" component={InputImage}
                  rootFolder="/Blog/"
                />
              </Col>
              <Col xs={12} md={8}>
                <Field data-automation-id="input-blog-createedit-title" label="Title" name="title" type="text" component={Input} />
                <Field
                  data-automation-id="select-blog-createedit-category"
                  label="Category"
                  name="category"
                  component={Select}
                >
                  {categoryMenuItem}
                </Field>
                <Field data-automation-id="input-blog-createedit-introduction" label="Introduction" name="introduction" type="text" component={TextArea} rows={3} />
              </Col>
            </Row>
            {
              // <Row>
              //   <Col xs={12} md={12}>
              //     <Field data-automation-id="input-blog-createedit-introduction" label="Introduction" name="introduction" type="text" component={TextArea} rows={3} />
              //   </Col>
              // </Row>
            }
            {
              // <Row>
              //   <Col xs={12}>
              //     <TinyMCE
              //       content={decode(this.state.content)}
              //       onChange={(e) => {
              //         this.setState({ content: e.target.getContent() });
              //       }}
              //     />
              //   </Col>
              // </Row>
            }
            <Row>
              <Col xs={12} md={12}>
                <Field
                  id="input-blog-create-edit-content"
                  data-automation-id="input-blog-createedit-content"
                  label="Content" name="content" type="text"
                  value={this.state.content}
                  component={TinyMCE} rows={15}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <Row style={{ marginTop: '20px' }}>
                  <Col xs={6} md={6}>
                    <label className={styles.Label} htmlFor="Public comment">Public Comment</label>
                  </Col>
                  <Col xs={6} md={6}>
                    <div>
                      <label htmlFor="Blog public comment" className={styles.switch}>
                        <input
                          data-automation-id="checkbox-blog-createedit-publiccomment"
                          className={styles.switchInput} type="checkbox"
                          checked={this.state.publicComment}
                          onChange={() => this.TogglePublicComment()}
                        />
                        <span className={styles.switchLabel} data-on="Enable" data-off="Disable"></span>
                        <span className={styles.switchHandle}></span>
                      </label>
                    </div>
                    {
                      // <Toggle
                      //   toggled={this.state.publicComment}
                      //   onToggle={(event, isInputChecked) => this.setState({ publicComment: isInputChecked })}
                      //   label={this.state.publicComment ? 'Enable' : 'Disable'}
                      //   className={styles.toggled}
                      //   labelPosition="right"
                      // />
                    }
                  </Col>
                </Row>
              </Col>
              <Col xs={12} md={6}>
                <Row style={{ marginTop: '20px' }}>
                  <Col xs={5} md={5}>
                    <label className={styles.Label} htmlFor="Status">Status</label>
                  </Col>
                  <Col xs={7} md={7}>
                    <div>
                      <label htmlFor="Blog Status" className={styles.switch}>
                        <input
                          data-automation-id="checkbox-blog-createedit-status"
                          className={styles.switchInput} type="checkbox"
                          checked={this.state.IsActive}
                          onChange={() => this.ToggleStatus()}
                        />
                        <span className={styles.switchLabel} data-on="Publish" data-off="Unpublish"></span>
                        <span className={styles.switchHandle}></span>
                      </label>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            {
              // <Row>
              // <Col xs={12} md={12}>
              //   {(this.state.facebookEmpty && this.state.twitterEmpty && this.state.instagramEmpty && !this.state.loading) &&
              //     <div className={styles.socialmediaMessage}>You can publish your blog in social media. Please connect your social media
              //       <span // eslint-disable-line
              //         className={styles.socialmediaLink}
              //         onClick={() => this.props.history.push('/MCAdmin/WebsiteManagement/WebsiteSocialGoogle')}
              //       > here</span>.
              //     </div>
              //   }
              //   {((!this.state.facebookEmpty || !this.state.twitterEmpty || !this.state.instagramEmpty) && !this.state.loading) &&
              //     <Row style={{ marginTop: '10px' }}>
              //       <Col xs={12} md={6}>
              //         <label className={styles.Label} htmlFor="Social Media Share">Social Media Share</label>
              //       </Col>
              //     </Row>
              //   }
              // </Col>
              // </Row>
            // <Row>
            //   <Col xs={12} md={4}>
            //     {(!this.state.facebookEmpty && !this.state.loading) &&
            //       <Row style={{ marginTop: '20px' }}>
            //         <Col xs={5} md={5} style={{ paddingTop: '10px' }}>
            //           <label className={styles.Label} htmlFor="Facebook share">Facebook</label>
            //         </Col>
            //         <Col xs={7} md={7}>
            //           <button
            //             type="button"
            //             onClick={() => {
            //               FB.ui({ // eslint-disable-line
            //                 method: 'share',
            //                 href: 'http://website03.cybera.dev:3000/blog-details/2',
            //               }, (response) => {
            //                 console.log(response);
            //               });
            //             }}
            //           >Share</button> {this.state.shortenedURL}
            //           {
            //             // <div>
            //             //   <label htmlFor="facebook" className={styles.switch}>
            //             //     <input
            //             //       data-automation-id="checkbox-blog-createedit-facebook"
            //             //       className={styles.switchInput} type="checkbox"
            //             //       checked={this.state.shareFacebook}
            //             //       onChange={() => this.ToggleSocialMedia('facebook')}
            //             //     />
            //             //     <span className={styles.switchLabel} data-on="Enable" data-off="Disable"></span>
            //             //     <span className={styles.switchHandle}></span>
            //             //   </label>
            //             // </div>
            //           }
            //         </Col>
            //       </Row>
            //     }
            //   </Col>
            //   <Col xs={12} md={4}>
            //     {(!this.state.twitterEmpty && !this.state.loading) &&
            //       <Row style={{ marginTop: '20px' }}>
            //         <Col xs={5} md={5} style={{ paddingTop: '10px' }}>
            //           <label className={styles.Label} htmlFor="Twitter share">Twitter</label>
            //         </Col>
            //         <Col xs={7} md={7}>
            //           <div>
            //             <label htmlFor="twitter" className={styles.switch}>
            //               <input
            //                 data-automation-id="checkbox-blog-createedit-twitter"
            //                 className={styles.switchInput} type="checkbox"
            //                 checked={this.state.shareTwitter}
            //                 onChange={() => this.ToggleSocialMedia('twitter')}
            //               />
            //               <span className={styles.switchLabel} data-on="Enable" data-off="Disable"></span>
            //               <span className={styles.switchHandle}></span>
            //             </label>
            //           </div>
            //         </Col>
            //       </Row>
            //     }
            //   </Col>
            //   <Col xs={12} md={4}>
            //     {(!this.state.instagramEmpty && !this.state.loading) &&
            //       <Row style={{ marginTop: '20px' }}>
            //         <Col xs={5} md={5} style={{ paddingTop: '10px' }}>
            //           <label className={styles.Label} htmlFor="instagram share">Instagram</label>
            //         </Col>
            //         <Col xs={7} md={7}>
            //           <div>
            //             <label htmlFor="instagram" className={styles.switch}>
            //               <input
            //                 data-automation-id="checkbox-blog-createedit-instagram"
            //                 className={styles.switchInput} type="checkbox"
            //                 checked={this.state.shareInstagram}
            //                 onChange={() => this.ToggleSocialMedia('instagram')}
            //               />
            //               <span className={styles.switchLabel} data-on="Enable" data-off="Disable"></span>
            //               <span className={styles.switchHandle}></span>
            //             </label>
            //           </div>
            //         </Col>
            //       </Row>
            //     }
            //   </Col>
            // </Row>
          }
            <br />
            <br />
            <Row>
              <Col xs={12} sm={12} md={12}>
                <div className={styles.buttonFooter} >
                  <Button data-automation-id="btn-blog-createedit-submit" type="submit">Save</Button>
                  <Button
                    data-automation-id="btn-blog-createedit-cancel"
                    type="button"
                    btnStyle="negative"
                    onClick={() => this.props.history.push('/MCAdmin/Blog/Blog')}
                  >Cancel</Button>
                </div>
              </Col>
            </Row>
          </form>
          {popup}
        </Box>
        {this.state.loading && <Loading />}
      </Layout>);
  }
}

CreateEditBlog.propTypes = {
  location: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialize: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default reduxForm({
  form: 'CreateEditCategory',
  validate: BlogFormValidate,
})(CreateEditBlog);
