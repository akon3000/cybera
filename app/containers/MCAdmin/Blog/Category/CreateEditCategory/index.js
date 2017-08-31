import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form/immutable';
import { Row, Col } from 'react-flexbox-grid';
import Toggle from 'material-ui/Toggle';
import { RadioButtonGroup } from 'material-ui/RadioButton';
import Layout from '../../../Layout';
import BreadCrumb from '../../../../../components/AdminLayout/components/BreadCrumb';
import Box from '../../../../../components/AdminLayout/components/Box';
import Input from '../../../../../components/Input';
import request from '../../../../../utils/request';
import { apiUrl } from '../../../../../config';
import Loading from '../../../../../components/Loading';
import styles from './styles.css';
import Button from '../../../../../components/Button';
import CheckBox from '../../../../../components/CheckBox';
import TextArea from '../../../../../components/TextArea';
import ConfirmPopup from '../../../../../components/ConfirmPopup';
import SuccessPopup from '../../../../../components/SuccessPopup';
import ErrorPopup from '../../../../../components/ErrorPopup';
import validate from '../../../../../utils/validate';

export const CategoryFormValidate = (values) => {
  const errors = {};

  if (!values.get('categoryName')) {
    errors.categoryName = 'Please enter name';
  } else {
    const isValidLength = validate.isValidLength(values.get('categoryName'), 50, 'Name');
    if (isValidLength !== true) {
      errors.categoryName = isValidLength;
    }
  }

  if (!values.get('description')) {
    errors.description = 'Please enter description';
  } else {
    const isValidLength = validate.isValidLength(values.get('description'), 500, 'Description');
    if (isValidLength !== true) {
      errors.description = isValidLength;
    }
  }

  return errors;
};

export class CreateEditCategory extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      loading: true,
      submitMessage: '',
      showSuccessPopup: false,
      showConfirmation: false,
      IsActive: false,
      categoryList: [],
      categoryEmpty: false,
      isEditingParent: false,
      categoryTopLevel: false,
      parentCategoryChosen: '',
      pageFunction: 'Create',
    };
  }

  componentWillMount() {
    request.get(`${apiUrl}/Websites/${localStorage.getItem('websiteID')}/BlogCategory`, {}, (response) => {
      if (response.data) {
        this.setState({ loading: false, categoryList: response.data.Items.filter((item) => item.ParentId === null) });
      }
    });
    const query = this.props.location.query;
    if (query.CategoryId) {
      this.setState({ loading: true });
      request.get(`${apiUrl}/Websites/${localStorage.getItem('websiteID')}/BlogCategory?$filter=Id eq ${query.CategoryId}`, {}, (response) => {
        if (response.data && response.data.Items.length > 0) {
          const blog = response.data.Items[0];
          this.setState({
            loading: false,
            pageFunction: 'Edit',
            IsActive: blog.IsActive,
            isEditingParent: (blog.ParentId === null),
          });
        }
      });
    }
  }

  componentDidMount() {
    const query = this.props.location.query;
    if (query.CategoryId) {
      request.get(`${apiUrl}/Websites/${localStorage.getItem('websiteID')}/BlogCategory?$filter=Id eq ${query.CategoryId}`, {}, (response) => {
        if (response.data && response.data.Items.length > 0) {
          const blog = response.data.Items[0];
          this.setState({
            categoryTopLevel: (!blog.ParentId),
            parentCategoryChosen: (blog.ParentId) ? blog.ParentId : '' }, () => {
            this.handleInitialize(blog);
          });
        }
      });
    }
  }

  handleInitialize(data) {
    const initData = {
      categoryName: data.Name,
      description: data.Description,
    };
    this.props.initialize(initData);
  }

  submit(values) {
    if (!this.state.categoryTopLevel && this.state.parentCategoryChosen === '') {
      this.setState({ categoryEmpty: true });
    } else if (this.state.pageFunction === 'Create') {
      this.setState({ loading: true });
      request.post(
        `${apiUrl}/Websites/${localStorage.getItem('websiteID')}/BlogCategory`,
        {
          Name: values.get('categoryName'),
          Description: values.get('description'),
          ParentId: (this.state.parentCategoryChosen === '') ? '' : parseInt(this.state.parentCategoryChosen, 10),
        },
        (response) => {
          if (!response.error) {
            this.setState({
              submitMessage: 'New category created',
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
        `${apiUrl}/Websites/${localStorage.getItem('websiteID')}/BlogCategory`,
        {
          Id: parseInt(this.props.location.query.CategoryId, 10),
          IsActive: this.state.IsActive,
          Name: values.get('categoryName'),
          Description: values.get('description'),
          ParentId: (this.state.parentCategoryChosen === '') ? '' : parseInt(this.state.parentCategoryChosen, 10),
        },
        (response) => {
          if (!response.error) {
            this.setState({
              submitMessage: 'Category details updated',
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
    if (this.state.IsActive) {
      this.setState({ IsActive: false, showConfirmation: true });
    } else {
      this.setState({ IsActive: true, showConfirmation: true });
    }
  }

  render() {
    const { handleSubmit } = this.props;
    const popup = [];
    const activeCategory = this.state.categoryList.filter((category) => category.IsActive === true);

    if (this.state.showConfirmation) {
      popup.push(
        <ConfirmPopup
          key="showCategoryConfirmation"
          data-automation-id="dialog-category-status-confirmation"
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
          <h3>Category Status Setting</h3>
          {this.state.IsActive && <div>Blog under this category will now be accessible online.</div>}
          {!this.state.IsActive && <div>Are you sure to de-active the category? Blog under deactivated category is not accessible online.</div>}
        </ConfirmPopup>
      );
    }

    if (this.state.showSuccessPopup) {
      popup.push(
        <SuccessPopup
          key="categorySuccessPopup"
          data-automation-id="dialog-category-createedit-success"
          onClose={() => { this.setState({ showSuccessPopup: false }); this.props.history.push('/MCAdmin/Blog/Category'); }}
        >
          <h3>You have been successful</h3>
          <div>{this.state.submitMessage}</div>
        </SuccessPopup>
      );
    }

    if (this.state.error) {
      popup.push(
        <ErrorPopup
          data-automation-id="error-category-createedit-fail"
          key="Blog category Error"
          error={this.state.error}
          onClose={() => { this.setState({ error: false }); }}
        />
      );
    }

    return (
      <Layout data-automation-id="page-blogcategory-createedit">
        <BreadCrumb
          breadCrumb={[
            <button data-automation-id="btn-blog-link" key="Blog" onClick={() => this.props.history.push('/MCAdmin/Blog/Blog')}>Blog</button>,
            <button data-automation-id="btn-blogcategory-link" key="Category" onClick={() => this.props.history.push('/MCAdmin/Blog/Category')}>Category</button>,
            <button data-automation-id="btn-blogcategory-createedit-link" key="CreateEditCategory" onClick={() => window.location.reload()}>{(this.state.pageFunction === 'Create') ? 'Create New Category' : 'Edit Category'}</button>,
          ]}
        />
        <h2>{(this.state.pageFunction === 'Create') ? 'Create New Category' : 'Edit Category'}</h2>
        <Box>
          <form data-automation-id="form-blogcategory-createedit" onSubmit={handleSubmit((values) => this.submit(values))}>
            <Row>
              <Col xs={12} sm={6} md={6}>
                <Row>
                  <Col xs={12} md={12}>
                    <Field data-automation-id="input-blogcategory-createedit-name" label="Name" name="categoryName" type="text" component={Input} />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={12}>
                    <Field data-automation-id="input-blogcategory-createedit-description" label="Description" name="description" type="text" component={TextArea} rows={12} />
                  </Col>
                </Row>
              </Col>
              <Col xs={12} sm={6} md={6}>
                {this.state.pageFunction === 'Edit' &&
                  <Row className={styles.statusContainer}>
                    <Col xs={2} md={2}>
                      <label className={styles.Label} htmlFor="Status">Status</label>
                    </Col>
                    <Col xs={2} md={2}>
                      <Toggle data-automation-id="toggle-blogcategory-createedit-status" className={styles.status} onClick={() => this.ToggleStatus()} defaultToggled={this.state.IsActive} />
                    </Col>
                  </Row>
                }
                {!(this.state.pageFunction === 'Edit' && this.state.isEditingParent) &&
                <Row>
                  <Col xs={12} md={12} style={{ marginTop: '30px' }}>
                    <label className={styles.Label} htmlFor="parent category">Parent Category</label>
                  </Col>
                  <Col xs={12} md={12}>
                    <Field
                      data-automation-id="input-blogcategory-createedit-toplevelcategory"
                      label="Top level"
                      name="TopLevelCategory"
                      component={CheckBox}
                      checked={this.state.categoryTopLevel}
                      onCheck={(value) => {
                        this.setState({ categoryTopLevel: value, parentCategoryChosen: '', categoryEmpty: false });
                      }}
                    />
                    {this.state.categoryEmpty &&
                      <div data-automation-id="div-blogcategory-createedit-warntext" className={styles.warnText} style={{ marginBottom: '10px' }}>Please select type</div>
                    }
                    <RadioButtonGroup
                      data-automation-id="radiogroup-blogcategory-createedit-parentcategory"
                      valueSelected={this.state.parentCategoryChosen}
                      className={styles.parentCategory} name="currentParentCategory"
                      onChange={(event, value) => { this.setState({ parentCategoryChosen: value, categoryTopLevel: false, categoryEmpty: false }); }}
                    >
                      {activeCategory.map((category) =>
                        <radio key={category.Name} value={category.Id} label={category.Name} />
                      )}
                    </RadioButtonGroup>
                    {(this.state.categoryList.length > 0 && this.state.categoryEmpty) &&
                      <div data-automation-id="div-blogcategory-createedit-warntext" className={styles.warnText} style={{ marginTop: '10px' }}>Please choose parent category</div>
                    }
                  </Col>
                </Row>
                }
              </Col>
            </Row>
            <br />
            <br />
            <Row>
              <Col xs={12} sm={12} md={12}>
                <div className={styles.buttonFooter} >
                  <Button data-automation-id="btn-blogcategory-createedit-submit" type="submit">Save</Button>
                  <Button
                    data-automation-id="btn-blogcategory-createedit-cancel"
                    type="button"
                    btnStyle="negative"
                    onClick={() => this.props.history.push('/MCAdmin/Blog/Category')}
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

CreateEditCategory.propTypes = {
  location: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialize: PropTypes.func.isRequired,
//  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default reduxForm({
  form: 'CreateEditCategory',
  validate: CategoryFormValidate,
})(CreateEditCategory);
