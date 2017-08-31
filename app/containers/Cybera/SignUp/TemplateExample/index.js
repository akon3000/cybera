import React from 'react';
import PropTypes from 'prop-types';
import CloseIcon from 'react-icons/lib/md/close';
import DesktopIcon from 'react-icons/lib/md/desktop-windows';
import TabletIcon from 'react-icons/lib/md/tablet-android';
import PhoneIcon from 'react-icons/lib/md/phone-android';

import styles from './styles.css';
import LogoBlack from '../../../../assets/image/logoBlack.png';

class TemplateExample extends React.Component {
  constructor() {
    super();
    this.state = {
      display: 'Desktop',
      delaying: true,
    };
  }

  componentDidMount() {
    const self = this;
    setTimeout(() => {
      self.setState({ delaying: false });
    }, 600);
  }

  render() {
    return (
      <div className={styles.container} data-automation-id={`template-example-${this.props.templateName.toLowerCase()}`}>
        <div className={styles.topTool} data-automation-id="container-tool">
          <img className={styles.logo} src={LogoBlack} alt="presentation" data-automation-id="image-logo" />
          <div className={styles.rightTool}>
            <button
              id="desktopPreview"
              data-automation-id="btn-preview-desktop"
              className={styles.desktopIcon}
              onClick={() => this.setState({ display: 'Desktop' })}
            ><DesktopIcon /></button>
            <button
              id="tabletPreview"
              data-automation-id="btn-preview-tablet"
              className={styles.tabletIcon}
              onClick={() => this.setState({ display: 'Tablet' })}
            ><TabletIcon /></button>
            <button
              id="mobilePreview"
              data-automation-id="btn-preview-mobile"
              className={styles.phoneIcon}
              onClick={() => this.setState({ display: 'Mobile' })}
            ><PhoneIcon /></button>
            <button
              id="selectFromTemplateExample"
              data-automation-id="btn-select"
              className={styles.selectBtn}
              onClick={this.props.onClickSelect}
            >Select</button>
            <button
              id="closeTemplateExample"
              data-automation-id="btn-close"
              className={styles.closeBtn}
              onClick={this.props.onClose}
            ><CloseIcon /></button>
          </div>
        </div>
        { this.state.display === 'Desktop' && !this.state.delaying &&
          <div id="desktopPreview" className={styles.iframeDesktop} data-automation-id="option-desktop">
            <iframe src={this.props.WebUrl} data-automation-id="ifram-preview"></iframe>
          </div>
        }
        { this.state.display === 'Tablet' && !this.state.delaying &&
          <div id="tabletPreview" className={styles.iframeTablet} data-automation-id="option-tablet">
            <div>
              <iframe src={this.props.WebUrl} data-automation-id="ifram-preview"></iframe>
            </div>
          </div>
        }
        { this.state.display === 'Mobile' && !this.state.delaying &&
          <div id="mobilePreview" className={styles.iframeMobile} data-automation-id="option-mobile">
            <div>
              <iframe src={this.props.WebUrl} data-automation-id="ifram-preview"></iframe>
            </div>
          </div>
        }
      </div>);
  }
}

TemplateExample.propTypes = {
  onClickSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  WebUrl: PropTypes.string.isRequired,
  templateName: PropTypes.string,
};

TemplateExample.defaultProps = {
  templateName: '',
};

export default TemplateExample;
