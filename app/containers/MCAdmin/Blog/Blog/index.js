import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import { Link } from 'react-router-dom';
import PlusIcon from 'react-icons/lib/fa/plus';
import EditIcon from 'react-icons/lib/md/edit';
import DeleteIcon from 'react-icons/lib/md/delete';
import SearchIcon from 'react-icons/lib/md/search';
import { Field, reduxForm } from 'redux-form/immutable';
import Layout from '../../Layout';
import BreadCrumb from '../../../../components/AdminLayout/components/BreadCrumb';
import Box from '../../../../components/AdminLayout/components/Box';
import Table from '../../../../../app/components/Table';
import { formatDate } from '../../../../utils';
// import styles from './styles.css';
import request from '../../../../utils/request';
import { apiUrl } from '../../../../config';
import InputWithIcon from '../../../../components/InputWithIcon';
import validate from '../../../../utils/validate';
import Button from '../../../../components/Button';
import ConfirmPopup from '../../../../components/ConfirmPopup';
import SuccessPopup from '../../../../components/SuccessPopup';
import ErrorPopup from '../../../../components/ErrorPopup';

const BlogValidate = (values) => {
  const errors = {};

  if (!values.get('title')) {
    errors.title = 'please enter blog title';
  } else if (values.get('title')) {
    const isValidLength = validate.isValidLength(values.get('title'), 50, 'Blog title');
    if (isValidLength !== true) {
      errors.title = isValidLength;
    }
  }

  return errors;
};


class Blog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      filter: [],
      submitMessage: '',
      showSuccessPopup: false,
      showConfirmation: false,
      deleteBlogId: '',
      pageForceReloadCount: 0,
    };
  }

  search(title) {
    const filter = [
      { Columns: ['Blog Title'], keywords: title },
    ];
    this.setState({ filter, search: true });
  }

  DeleteBlog() {
    this.setState({ loading: true }, () => {
      request.delete(
        `${apiUrl}/Websites/${localStorage.getItem('websiteID')}/Blog/${this.state.deleteBlogId}`,
        {},
        (response) => {
          if (!response.error) {
            this.setState({
              submitMessage: 'Blog deleted successfully',
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
          key="showDeleteBlogConfirmation"
          data-automation-id="dialog-blog-delete-confirmation"
          onClose={() => { this.setState({ showConfirmation: false }); }}
          actions={[
            <Button
              data-automation-id="btn-yes"
              onClick={() => { this.setState({ showConfirmation: false }); this.DeleteBlog(); }}
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
          <h3>Blog Delete</h3>
          <div>Are you sure to delete the blog?</div>
        </ConfirmPopup>
      );
    }

    if (this.state.showSuccessPopup) {
      popup.push(
        <SuccessPopup
          key="blogDeleteSuccessPopup"
          data-automation-id="dialog-blog-delete-success"
          onClose={() => { this.setState({ showSuccessPopup: false, pageForceReloadCount: this.state.pageForceReloadCount + 1 }); }}
        >
          <h3>You have been successful</h3>
          <div>{this.state.submitMessage}</div>
        </SuccessPopup>
      );
    }

    if (this.state.error) {
      popup.push(
        <ErrorPopup
          data-automation-id="error-blog-delete-fail"
          key="Blog Delete Error"
          error={this.state.error}
          onClose={() => { this.setState({ error: false }); }}
        />
      );
    }

    const header = [
      { Label: 'Blog Featured Image', Name: 'Blog Featured Image', align: 'center' },
      { Label: 'Blog Title', Name: 'Blog Title', align: 'center' },
      { Label: 'Category', Name: 'Category', align: 'center' },
      { Label: 'Author', Name: 'Author', align: 'center' },
      { Label: 'Created Date', Name: 'CreatedDate', align: 'center' },
      { Label: 'CreatedDate', Name: 'Hide', align: 'center' },
      { Label: 'Publish Date', Name: 'PublishDate', align: 'center' },
      { Label: 'PublishDate', Name: 'Hide', align: 'center' },
      { Label: 'Last Update Date', Name: 'LastUpdateDate', align: 'center' },
      { Label: 'LastUpdateDate', Name: 'Hide', align: 'center' },
      { Label: 'Blog Shortened URL', Name: 'Blog Shortened URL', align: 'center' },
      { Label: 'Blog Status', Name: 'Blog Status', align: 'center' },
      { Label: 'SortDisable', Name: 'SortDisable', align: 'center' },
    ];

    const body = [
      (value) => <img src={`${value.ImageURL}?width=${90}&height=${60}`} style={{ height: '60px' }} alt={value.Title} />,
      (value) => value.Title,
      (value) => (value.BlogCategory && value.BlogCategory.Name),
      (value) => value.CreatedUser,
      (value) => (value.CreatedDate ? formatDate(value.CreatedDate) : ''),
      (value) => value.CreatedDate,
      (value) => (value.PublishDate ? formatDate(value.PublishDate) : ''),
      (value) => value.PublishDate,
      (value) => (value.ModifiedDate ? formatDate(value.ModifiedDate) : ''),
      (value) => value.ModifiedDate,
      (value) => value.ShortenedURL,
      (value) => (value.IsActive ? 'Publish' : 'Unpublish'),
      (value) => [<Link
        key="EditIcon"
        style={{ textDecoration: 'none' }}
        to={{
          pathname: '/MCAdmin/Blog/Blog/CreateEditBlog',
          search: `?BlogId=${value.Id}`,
        }}
      >
        <EditIcon />
      </Link>,
        <button
          key="DeleteIcon"
          style={{ textDecoration: 'none', marginLeft: '10px' }}
          onClick={() => this.setState({ showConfirmation: true, deleteBlogId: value.Id })}
        >
          <DeleteIcon />
        </button>],
    ];

    const downloadbody = [
      (value) => value['Blog Featured Image'],
      (value) => value['Blog Title'],
      (value) => value.Category,
      (value) => value.Author,
      (value) => value['Created Date'],
      (value) => value['Publish Date'],
      (value) => value['Last Update Date'],
      (value) => value['Blog Shortened URL'],
      (value) => value['Blog Status'],
    ];

    return (
      <Layout openedMenu="Merchants" activeMenu="Blog" isLoading={this.state.isLoading}>
        <BreadCrumb
          breadCrumb={[
            <button key="Blog" onClick={() => window.location.reload()}>Blog</button>,
          ]}
        />
        <h2>Blog</h2>
        <Box>
          <Row>
            <Col xs={12} sm={6} md={4} lg={4}>
              <div style={{ paddingBottom: '15px' }}>
                <Button
                  data-automation-id="btn-create-blog"
                  onClick={() => this.props.history.push('/MCAdmin/Blog/Blog/CreateEditBlog')}
                ><PlusIcon /> Create new Blog</Button>
              </div>
            </Col>
            <Col xs={12} sm={6} md={8} lg={8}>
              <form data-automation-id="form-blogdashboard-search" onSubmit={this.props.handleSubmit((values) => this.search(values.get('title')))}>
                <Row>
                  <Col xs={12} sm={6} lg={6}>
                    <Field data-automation-id="input-blogdashboard-title" hintText="Title" name="title" type="text" component={InputWithIcon} icon={<SearchIcon />} />
                  </Col>
                  <Col xs={12} md={3}>
                    <Button data-automation-id="btn-blogdashboard-search"><SearchIcon /> Search</Button>
                  </Col>
                </Row>
              </form>
            </Col>
          </Row>
          <Table
            dataSource={`Websites/${localStorage.getItem('websiteID')}/Blog`}
            header={header}
            body={body}
            downloadBody={downloadbody}
            filter={this.state.filter}
            fileName="Blog"
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

Blog.propTypes = {
  history: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'Blog',
  validate: BlogValidate,
})(Blog);
