import React from 'react';
import PropTypes from 'prop-types';

import Dialog from '../Dialog';
import { PositiveButton, NegativeButton } from '../Dialog/Buttons';


class ConfirmDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { title, children, onConfirm, onCancel } = this.props;
    return (
      <Dialog
        title={title}
        onClose={() => onCancel()}
        contentStyle={{ width: '928px' }}
        actions={[
          <PositiveButton onClick={() => onConfirm()}>Confirm</PositiveButton>,
          <NegativeButton onClick={() => onCancel()}>Cancel </NegativeButton>,
        ]}
      >
        {children}
      </Dialog>
    );
  }
}

ConfirmDialog.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

ConfirmDialog.defaultProps = {};

export default ConfirmDialog;
