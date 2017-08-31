import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import PlusIcon from 'react-icons/lib/fa/plus';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import EditIcon from 'react-icons/lib/md/edit';
import DeleteIcon from 'react-icons/lib/md/delete';
import Layout from '../../Layout';
import BreadCrumb from '../../../../components/AdminLayout/components/BreadCrumb';
import Box from '../../../../components/AdminLayout/components/Box';
import Loading from '../../../../components/Loading';
import CategoryItem from './CategoryItem';
import request from '../../../../utils/request';
import { apiUrl } from '../../../../config';
import Button from '../../../../components/Button';
import Table from '../../../../../app/components/Table';
import { formatDate } from '../../../../utils';
import ConfirmPopup from '../../../../components/ConfirmPopup';
import SuccessPopup from '../../../../components/SuccessPopup';
import ErrorPopup from '../../../../components/ErrorPopup';
import styles from './styles.css';

class Category extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      categoryList: [],
      loading: true,
      showDeleteConfirmPopup: false,
      deleteCategoryId: null,
      deleteSuccess: false,
      submitMessage: '',
      parentPriority: [],
      pageForceReloadCount: 0,
    };
  }

  componentWillMount() {
    request.get(`${apiUrl}/Websites/${localStorage.getItem('websiteID')}/BlogCategory`, {}, (response) => {
      if (response.data) {
        this.setState({ categoryList: response.data.Items }, () => {
          const parents = this.state.categoryList.filter((category) => category.ParentId === null);
          const parentPriority = [];
          parents.forEach((parent) => {
            parentPriority.push({
              Id: parent.Id,
              ParentId: parent.ParentId,
              Priority: parent.Priority,
            });
          });
          this.setState({ loading: false, parentPriority });
        });
      }
    });
  }

  reloadPage() {
    request.get(`${apiUrl}/Websites/${localStorage.getItem('websiteID')}/BlogCategory`, {}, (response) => {
      if (response.data) {
        this.setState({ categoryList: response.data.Items }, () => {
          const parents = this.state.categoryList.filter((category) => category.ParentId === null);
          const parentPriority = [];
          parents.forEach((parent) => {
            parentPriority.push({
              Id: parent.Id,
              ParentId: parent.ParentId,
              Priority: parent.Priority,
            });
          });
          this.setState({ loading: false, parentPriority });
        });
      }
    });
  }

  updatePriority(dragPriority, hoverPriority) {
    this.setState({ loading: true });
    const category = {};
    const parents = this.state.categoryList.filter((item) => item.ParentId === null);
    const children = this.state.categoryList.filter((item) => item.ParentId !== null);
    let count = 0;
    if (!dragPriority.ParentId) {
      if (dragPriority.Priority > hoverPriority.Priority) {
        parents.forEach((parent) => {
          if (parent.Priority >= hoverPriority.Priority && parent.Priority < dragPriority.Priority) {
            let key = `Category[${count}].Id`;
            category[key] = parent.Id;
            key = `Category[${count}].Priority`;
            category[key] = parent.Priority + 1;
            count += 1;
          } else if (parent.Priority === dragPriority.Priority) {
            let key = `Category[${count}].Id`;
            category[key] = parent.Id;
            key = `Category[${count}].Priority`;
            category[key] = hoverPriority.Priority;
            count += 1;
          }
        });
      } else {
        parents.forEach((parent) => {
          if (parent.Priority <= hoverPriority.Priority && parent.Priority > dragPriority.Priority) {
            let key = `Category[${count}].Id`;
            category[key] = parent.Id;
            key = `Category[${count}].Priority`;
            category[key] = parent.Priority - 1;
            count += 1;
          } else if (parent.Priority === dragPriority.Priority) {
            let key = `Category[${count}].Id`;
            category[key] = parent.Id;
            key = `Category[${count}].Priority`;
            category[key] = hoverPriority.Priority;
            count += 1;
          }
        });
      }
    } else {
      if (dragPriority.Priority > hoverPriority.Priority) { // eslint-disable-line
        children.forEach((child) => {
          if (child.Priority >= hoverPriority.Priority && child.Priority < dragPriority.Priority) {
            let key = `Category[${count}].Id`;
            category[key] = child.Id;
            key = `Category[${count}].ParentId`;
            category[key] = child.ParentId;
            key = `Category[${count}].Priority`;
            category[key] = child.Priority + 1;
            count += 1;
          } else if (child.Priority === dragPriority.Priority) {
            let key = `Category[${count}].Id`;
            category[key] = child.Id;
            key = `Category[${count}].ParentId`;
            category[key] = child.ParentId;
            key = `Category[${count}].Priority`;
            category[key] = hoverPriority.Priority;
            count += 1;
          }
        });
      } else {
        children.forEach((child) => {
          if (child.Priority <= hoverPriority.Priority && child.Priority > dragPriority.Priority) {
            let key = `Category[${count}].Id`;
            category[key] = child.Id;
            key = `Category[${count}].ParentId`;
            category[key] = child.ParentId;
            key = `Category[${count}].Priority`;
            category[key] = child.Priority - 1;
            count += 1;
          } else if (child.Priority === dragPriority.Priority) {
            let key = `Category[${count}].Id`;
            category[key] = child.Id;
            key = `Category[${count}].ParentId`;
            category[key] = child.ParentId;
            key = `Category[${count}].Priority`;
            category[key] = hoverPriority.Priority;
            count += 1;
          }
        });
      }
    }
    request.put(
      `${apiUrl}/Websites/${localStorage.getItem('websiteID')}/BlogCategoryPriority`, category,
      (response) => {
        if (!response.error) {
          this.reloadPage();
        } else {
          this.setState({
            error: response.error,
            loading: false,
          });
        }
      }
    );
  }

  updateCategory(dragId, dropId) {
    const dragedCategory = this.state.categoryList.filter((category) => category.Id === dragId);
    this.setState({ loading: true });
    let paramsBody = {};
    if (dropId === 'childToParent') {
      paramsBody = {
        Id: dragId,
        IsActive: dragedCategory[0].IsActive,
        Name: dragedCategory[0].Name,
        Description: dragedCategory[0].Description,
        ParentId: '',
      };
    } else {
      paramsBody = {
        Id: dragId,
        IsActive: dragedCategory[0].IsActive,
        Name: dragedCategory[0].Name,
        Description: dragedCategory[0].Description,
        ParentId: dropId,
      };
    }

    request.put(
      `${apiUrl}/Websites/${localStorage.getItem('websiteID')}/BlogCategory`,
      paramsBody,
      (response) => {
        if (!response.error) {
          this.reloadPage();
        } else {
          this.setState({
            error: response.error,
            loading: false,
          });
        }
      }
    );
  }

  showDeleteConfirm(deleteCategoryId) {
    this.setState({ showDeleteConfirmPopup: true, deleteCategoryId });
  }

  deleteCategory() {
    this.setState({ showDeleteConfirmPopup: false, loading: true });
    request.delete(`${apiUrl}/Websites/${localStorage.getItem('websiteID')}/BlogCategory/${this.state.deleteCategoryId}`,
      {},
      (response) => {
        if (!response.error) {
          this.setState({
            submitMessage: 'Category deleted successfully',
            deleteSuccess: true,
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

  render() {
    const popup = [];
    if (this.state.showDeleteConfirmPopup) {
      popup.push(
        <ConfirmPopup
          key="showCategoryDeleteConfirmation"
          data-automation-id="dialog-delete-category-confirmation"
          onClose={() => { this.setState({ showDeleteConfirmPopup: false }); }}
          actions={[
            <Button
              onClick={() => this.deleteCategory()}
            >Yes</Button>,
            <Button
              btnStyle="negative"
              onClick={() => { this.setState({ showDeleteConfirmPopup: false }); }}
            >No</Button>,
          ]}
        >
          <h3>Delete Category</h3>
          <div>Are you sure to delete the category?</div>
        </ConfirmPopup>
      );
    }

    if (this.state.deleteSuccess) {
      popup.push(
        <SuccessPopup
          key="showCategoryDeleteSuccess"
          data-automation-id="dialog-category-delete-success"
          onClose={() => {
            this.setState({ deleteSuccess: false,
              loading: true,
              pageForceReloadCount: this.state.pageForceReloadCount + 1,
            }, () => this.reloadPage());
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
          data-automation-id="error-category-delete-fail"
          key="Blog category Error"
          error={this.state.error}
          onClose={() => { this.setState({ error: false }); }}
        />
      );
    }

    const parents = this.state.categoryList.filter((category) => category.ParentId === null);
    const children = this.state.categoryList.filter((category) => category.ParentId !== null);
    const tableTr = [];
    const parentPriority = _.sortBy(this.state.parentPriority, (p) => p.Priority);
    const parentReorder = [];
    for (let i = 0; i < parentPriority.length; i += 1) {
      parents.forEach((parent) => {
        if (parent.Id === parentPriority[i].Id) {
          parentReorder.push(parent);
        }
      });
    }

    parentReorder.forEach((parent) => {
      tableTr.push(
        <tr key={`tr${parent.Id}`}><td colSpan="100%" style={{ padding: 0 }}>
          <CategoryItem
            data-automation-id="table-category-details"
            key={parent.Id}
            parent={parent}
            parentPriority={parentPriority.filter((priority) => priority.Id === parent.Id)[0]}
            childCategories={children.filter((child) => child.ParentId === parent.Id)}
            updatePriority={(dragPriority, hoverPriority) => this.updatePriority(dragPriority, hoverPriority)}
            updateCategory={(dragId, dropId) => this.updateCategory(dragId, dropId)}
            showDeleteConfirm={(deleteId) => this.showDeleteConfirm(deleteId)}
          />
        </td></tr>
      );
    });

    const Mobileheader = [
      { Label: 'Category Name', Name: 'Email', align: 'center' },
      { Label: 'Created By', Name: 'Role', align: 'center' },
      { Label: 'Creation Date', Name: 'CreationDate', align: 'center' },
      { Label: 'CreationDate', Name: 'Hide', align: 'center' },
      { Label: 'Status', Name: 'Status', align: 'center' },
      { Label: 'SortDisable', Name: 'SortDisable', align: 'center' },
    ];

    const Mobilebody = [
      (value) => value.Name,
      (value) => value.CreatedUser,
      (value) => (value.CreatedDate ? formatDate(value.CreatedDate) : ''),
      (value) => value.CreatedDate,
      (value) => (value.IsActive ? 'Activate' : 'Deactivate'),
      (value) => [<Link
        data-automation-id="link-category-edit"
        key="EditIcon"
        style={{ textDecoration: 'none' }}
        to={{
          pathname: '/MCAdmin/Blog/Category/CreateEditCategory',
          search: `?CategoryId=${value.Id}`,
        }}
      >
        <EditIcon />
      </Link>,
        <button
          data-automation-id="btn-category-delete"
          key="DeleteIcon"
          style={{ textDecoration: 'none', marginLeft: '10px' }}
          onClick={() => this.showDeleteConfirm(value.Id)}
        >
          <DeleteIcon />
        </button>],
    ];

    const Mobiledownloadbody = [
      (value) => value['Category Name'],
      (value) => value['Created By'],
      (value) => value['Creation Date'],
      (value) => value.Status,
    ];

    return (
      <Layout data-automation-id="page-blogcategory">
        <BreadCrumb
          breadCrumb={[
            <button data-automation-id="btn-blog-link" key="Blog" onClick={() => this.props.history.push('/MCAdmin/Blog/Blog')}>Blog</button>,
            <button data-automation-id="btn-blogcategory-link" key="Category" onClick={() => window.location.reload()}>Category</button>,
          ]}
        />
        <h2>Category</h2>
        <Box>
          <Row>
            <Col xs={12} sm={6} md={4} lg={4}>
              <Button
                data-automation-id="btn-create-category"
                onClick={() => this.props.history.push('/MCAdmin/Blog/Category/CreateEditCategory')}
              ><PlusIcon /> Create new Category</Button>
            </Col>
          </Row>
          <Row className={styles.laptopTable}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <table data-automation-id="table-categorylist">
                <thead>
                  <tr>
                    <th style={{ width: '30%' }}>Category Name</th>
                    <th style={{ width: '20%' }}>Created By</th>
                    <th style={{ width: '20%' }}>Creation Date</th>
                    <th style={{ width: '20%' }}>Status</th>
                    <th style={{ width: '10%' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {tableTr}
                  {(this.state.categoryList.length === 0 && !this.state.loading) &&
                    <tr data-automation-id="tr-category-empty">
                      <td colSpan="100%" style={{ textAlign: 'center', padding: '20px 0' }}><b>No data found</b></td>
                    </tr>
                  }
                </tbody>
              </table>
            </Col>
          </Row>
          <div className={styles.MobileTable}>
            <Table
              data-automation-id="table-categorylist-mobile"
              dataSource={`Websites/${localStorage.getItem('websiteID')}/BlogCategory`}
              header={Mobileheader}
              body={Mobilebody}
              downloadBody={Mobiledownloadbody}
              filter={[]}
              pageForceReload={this.state.pageForceReloadCount}
              hideDownLoad
              fileName="Blog Category"
            />
          </div>
          {popup}
        </Box>
        {this.state.loading && <Loading />}
      </Layout>);
  }
}

Category.propTypes = {
  history: PropTypes.object.isRequired,
};

export default DragDropContext(HTML5Backend)(Category);
