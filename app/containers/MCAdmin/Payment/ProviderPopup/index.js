import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';
import Dialog from '../../../../components/Dialog';

/** Icon Payment-Provider */
import anzIcon from '../../../../assets/icon-payment-provider/anz.jpg';
import commonIcon from '../../../../assets/icon-payment-provider/common.jpg';
import ewayIcon from '../../../../assets/icon-payment-provider/eway.jpg';
import merchantIcon from '../../../../assets/icon-payment-provider/merchant.jpg';
import nabIcon from '../../../../assets/icon-payment-provider/nab.jpg';
import paypalIcon from '../../../../assets/icon-payment-provider/paypal.jpg';
import paystreamIcon from '../../../../assets/icon-payment-provider/paystream.jpg';
import SecurePayIcon from '../../../../assets/icon-payment-provider/SecurePay.jpg';
import stripeIcon from '../../../../assets/icon-payment-provider/stripe.jpg';

class ProviderPopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      providerImg: [
        paypalIcon,
        nabIcon,
        SecurePayIcon,
        paystreamIcon,
        merchantIcon,
        stripeIcon,
        ewayIcon,
        anzIcon,
        commonIcon,
      ],
    };
  }

  render() {
    const provider = [];
    this.props.provider.forEach((x, idx) => {
      if (!this.props.providerSelect[x.Name]) {
        provider.push(
          <button
            key={`line_${x.Id}`}
            data-automation-id={`btn-provider-${x.Name}`}
            className={styles.provider}
            onClick={() => this.props.onSelect(x)}
          >
            <div style={{ textAlign: 'center' }}>
              <img alt={x.Name} src={this.state.providerImg[idx]} />
            </div>
          </button>
        );
      }
    });

    return (
      <Dialog open={this.props.open} title="Select Payment Method" onClose={this.props.onClose}>
        <div className={styles.paymentProvider}>
          {provider}
        </div>
      </Dialog>
    );
  }
}

ProviderPopUp.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  provider: PropTypes.array,
  open: PropTypes.bool.isRequired,
  providerSelect: PropTypes.object,
};

ProviderPopUp.defaultProps = {
  provider: [],
  providerSelect: {},
};

export default ProviderPopUp;
