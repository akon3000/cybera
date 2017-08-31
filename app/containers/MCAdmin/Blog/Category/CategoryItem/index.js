import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { DragSource, DropTarget } from 'react-dnd';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import EditIcon from 'react-icons/lib/md/edit';
import DeleteIcon from 'react-icons/lib/md/delete';
import ParentIcon from 'react-icons/lib/ti/star';
import _ from 'lodash';
import { ItemTypes } from './ItemTypes';
import ChildCategory from './ChildCategory';
import { formatDate } from '../../../../../utils';
import styles from './styles.css';

const categorySource = {
  beginDrag(props) {
    return {
      parentPriority: props.parentPriority,
    };
  },
};

const categoryTarget = {
  canDrop(props, monitor) {
    const dragtarget = monitor.getItem().parentPriority;
    const droptarget = props.parentPriority;
    let canDrop;
    if (dragtarget) {
      if (!dragtarget.ParentId && !droptarget.ParentId && dragtarget.Priority === droptarget.Priority) {
        canDrop = false;
      } else {
        canDrop = true;
      }
    } else {
      canDrop = true;
    }
    return canDrop;
  },

  drop(props, monitor) {
    const dragtarget = monitor.getItem().parentPriority;
    const dragtargetChild = monitor.getItem().childPriority;
    const droptarget = props.parentPriority;

    if (dragtarget) {
      const dragIndex = dragtarget.Priority;
      const dropIndex = droptarget.Priority;

      if (dragIndex === dropIndex) {
        return {};
      }
      props.updatePriority(dragtarget, droptarget);
    }

    if (dragtargetChild) {
      const dragIndex = dragtargetChild.Id;
      const dropIndex = droptarget.Id;
      if (dragtargetChild.ParentId !== droptarget.Id) {
        props.updateCategory(dragIndex, dropIndex);
      }
    }

    return {};
  },
};

function collectDrag(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

function collectDrop(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  };
}

class CategoryItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      parent: props.parent,
      childCategories: props.childCategories,
      childPriority: [],
    };
  }

  componentWillMount() {
    const childPriority = [];
    this.state.childCategories.forEach((child) => {
      childPriority.push({
        Id: child.Id,
        ParentId: child.ParentId,
        Priority: child.Priority,
      });
    });
    this.setState({ childPriority });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.childCategories !== this.state.childCategories) {
      this.setState({
        childCategories: nextProps.childCategories,
      }, () => {
        const childPriority = [];
        this.state.childCategories.forEach((child) => {
          childPriority.push({
            Id: child.Id,
            ParentId: child.ParentId,
            Priority: child.Priority,
          });
        });
        this.setState({ childPriority });
      });
    }
  }

  render() {
    const tableTr = [];
    const childPriority = _.sortBy(this.state.childPriority, (c) => c.Priority);
    const childReorder = [];
    for (let i = 0; i < childPriority.length; i += 1) {
      this.state.childCategories.forEach((child) => {
        if (child.Id === childPriority[i].Id) {
          childReorder.push(child);
        }
      });
    }

    childReorder.forEach((child) => {
      tableTr.push(
        <ChildCategory
          data-automation-id="tr-childcategory"
          key={child.Id}
          child={child}
          childPriority={childPriority.filter((priority) => priority.Id === child.Id)[0]}
          updatePriority={(dragPriority, hoverPriority) => this.props.updatePriority(dragPriority, hoverPriority)}
          updateCategory={(dragId, dropId) => this.props.updateCategory(dragId, dropId)}
          showDeleteConfirm={(deleteId) => this.props.showDeleteConfirm(deleteId)}
        />
      );
    });

    const { connectDragSource, connectDropTarget, isDragging, isOver, showDeleteConfirm } = this.props;
    return compose(connectDragSource, connectDropTarget)(
      <table
        data-automation-id="table-category-oneparentwithchildren"
        style={{ margin: 0,
          tableLayout: 'fixed',
          opacity: isDragging ? 0.9 : 1,
        }}
      >
        <tbody>
          <tr style={{ background: isOver ? '#B6DBEA' : '#FFF' }} className={styles.tableTr}>
            <td data-automation-id="td-category-parent-name"><ParentIcon style={{ float: 'left', margin: '0 4px 4px 0' }} /> {this.state.parent.Name}</td>
            <td data-automation-id="td-category-parent-author">{this.state.parent.CreatedUser}</td>
            <td data-automation-id="td-category-parent-createddate">{this.state.parent.CreatedDate ? formatDate(this.state.parent.CreatedDate) : ''}</td>
            <td data-automation-id="td-category-parent-status">{this.state.parent.IsActive ? 'Activate' : 'Deactivate'}</td>
            <td style={{ width: '10%' }}><Link
              data-automation-id="link-category-edit"
              key="EditIcon"
              style={{ textDecoration: 'none' }}
              to={{
                pathname: '/MCAdmin/Blog/Category/CreateEditCategory',
                search: `?CategoryId=${this.state.parent.Id}`,
              }}
            >
              <EditIcon />
            </Link>
              <button
                data-automation-id="btn-category-delete"
                key="DeleteIcon"
                style={{ textDecoration: 'none', marginLeft: '10px' }}
                onClick={() => showDeleteConfirm(this.state.parent.Id)}
              >
                <DeleteIcon />
              </button></td>
          </tr>
          {tableTr}
        </tbody>
      </table>
    );
  }
}

CategoryItem.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  isOver: PropTypes.bool.isRequired,
  parent: PropTypes.object.isRequired,
  childCategories: PropTypes.array.isRequired,
  updatePriority: PropTypes.func.isRequired,
  updateCategory: PropTypes.func.isRequired,
  showDeleteConfirm: PropTypes.func.isRequired,
};

export default withRouter(compose(DragSource(ItemTypes.CATEGORY, categorySource, collectDrag),
  DropTarget(ItemTypes.CATEGORY, categoryTarget, collectDrop))(CategoryItem));
