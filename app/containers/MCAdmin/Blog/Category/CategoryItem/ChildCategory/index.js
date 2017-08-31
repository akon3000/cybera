import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { DragSource, DropTarget } from 'react-dnd';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import EditIcon from 'react-icons/lib/md/edit';
import DeleteIcon from 'react-icons/lib/md/delete';
import ChildIcon from 'react-icons/lib/ti/media-record';
import { ItemTypes } from '../ItemTypes';
import { formatDate } from '../../../../../../utils';
import styles from './styles.css';

const categorySource = {
  beginDrag(props) {
    return {
      childPriority: props.childPriority,
    };
  },

  endDrag(props, monitor) {
    const dragtargetChild = monitor.getItem().childPriority;
    if (dragtargetChild) {
      const didDrop = monitor.didDrop();
      if (!didDrop) {
        props.updateCategory(dragtargetChild.Id, 'childToParent');
      }
    }
  },
};

const categoryTarget = {
  canDrop(props, monitor) {
    const dragtarget = monitor.getItem().parentPriority;
    const droptarget = props.childPriority;
    let canDrop;
    if (dragtarget) {
      if (dragtarget.Id === droptarget.ParentId) {
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
    const dragtarget = monitor.getItem().childPriority;
    if (dragtarget) {
      const droptarget = props.childPriority;

      if (dragtarget.ParentId === droptarget.ParentId && dragtarget.Priority !== droptarget.Priority) {
        props.updatePriority(dragtarget, droptarget);
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

class CategoryItemChildren extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      child: props.child,
    };
  }

  render() {
    const { connectDragSource, isDragging, connectDropTarget, isOver, showDeleteConfirm } = this.props;
    return compose(connectDragSource, connectDropTarget)(
      <tr
        data-automation-id="tr-category-child"
        className={styles.tableTr}
        style={{ background: isOver ? '#B6DBEA' : '#D0E4ED',
          opacity: isDragging ? 0.9 : 1,
        }}
      >
        <td data-automation-id="td-category-child-name"><ChildIcon style={{ float: 'left', margin: '0 4px 4px 0' }} /> {this.state.child.Name}</td>
        <td data-automation-id="td-category-child-author">{this.state.child.CreatedUser}</td>
        <td data-automation-id="td-category-child-createddate">{this.state.child.CreatedDate ? formatDate(this.state.child.CreatedDate) : ''}</td>
        <td data-automation-id="td-category-child-status">{this.state.child.IsActive ? 'Activate' : 'Deactivate'}</td>
        <td style={{ width: '10%' }}><Link
          data-automation-id="link-category-edit"
          key="EditIcon"
          style={{ textDecoration: 'none' }}
          to={{
            pathname: '/MCAdmin/Blog/Category/CreateEditCategory',
            search: `?CategoryId=${this.state.child.Id}`,
          }}
        >
          <EditIcon />
        </Link>
          <button
            data-automation-id="btn-category-delete"
            key="DeleteIcon"
            style={{ textDecoration: 'none', marginLeft: '10px' }}
            onClick={() => showDeleteConfirm(this.state.child.Id)}
          >
            <DeleteIcon />
          </button></td>
      </tr>
    );
  }
}

CategoryItemChildren.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  isOver: PropTypes.bool.isRequired,
  child: PropTypes.object.isRequired,
  showDeleteConfirm: PropTypes.func.isRequired,
};

export default withRouter(compose(DragSource(ItemTypes.CATEGORY, categorySource, collectDrag),
  DropTarget(ItemTypes.CATEGORY, categoryTarget, collectDrop))(CategoryItemChildren));
