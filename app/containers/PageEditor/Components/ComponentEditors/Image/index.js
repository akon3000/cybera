import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ImageIcon from 'react-icons/lib/fa/image';
import ChainIcon from 'react-icons/lib/fa/chain';
import TrashIcon from 'react-icons/lib/fa/trash-o';

import styles from './styles.css';

import Button from '../../Button';

import { showFileManager, showHyperLink, deleteImageComponent } from '../../../actions';

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      id, type, sectionID,
      sectionGroup,
      onShowHyperLink,
      onShowFileManager,
      deletable,
      link,
      onDeleteImageComponent,
      allowLink,
    } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.buttons}>
          <Button
            icon={<ImageIcon />}
            onClick={() => onShowFileManager(id, type, sectionID, sectionGroup)}
          />
          { allowLink &&
            <Button
              icon={<ChainIcon />}
              onClick={() => onShowHyperLink(id, type, sectionID, link)}
            />
          }
          { deletable &&
            <Button
              icon={<TrashIcon />}
              onClick={() => onDeleteImageComponent(id, type, sectionID, sectionGroup)}
            />
          }
        </div>
      </div>
    );
  }
}

Editor.propTypes = {
  id: PropTypes.number,
  type: PropTypes.string,
  sectionID: PropTypes.number.isRequired,
  sectionGroup: PropTypes.string.isRequired,
  onShowHyperLink: PropTypes.func.isRequired,
  onShowFileManager: PropTypes.func.isRequired,
  deletable: PropTypes.bool,
  allowLink: PropTypes.bool,
  link: PropTypes.object,
  onDeleteImageComponent: PropTypes.func.isRequired,
};

Editor.defaultProps = {
  deletable: true,
  allowLink: true,
  link: null,
  id: null,
  type: '',
};

function mapStateToProps(reducer) {
  const state = reducer.get('pageEditor');
  return {
    popup: state.get('popup'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onShowFileManager: (id, type, sectionID, sectionGroup) => dispatch(showFileManager(id, type, sectionID, sectionGroup)),
    onShowHyperLink: (id, type, sectionID, link) => dispatch(showHyperLink(id, type, sectionID, link)),
    onDeleteImageComponent: (id, type, sectionID, sectionGroup) => dispatch(deleteImageComponent(id, type, sectionID, sectionGroup)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);

