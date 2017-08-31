import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './styles.css';
import message from '../../../../../Message';
import Loading from '../../../../../components/Loading';
import Validate from '../../../../../utils/validate';
import TextBox from '../../../Components/TextBox';
import request from '../../../../../utils/request';
import { apiUrl } from '../../../../../config';

class Subscribe1 extends Component {
  constructor(props) {
    super(props);
    const hostname = window.location.hostname;
    const subDomain = hostname.substring(0, hostname.indexOf('.'));
    this.state = {
      subDomain,
      email: '',
      error: null,
      success: null,
      loading: false,
    };
  }

  onSubmit(ev) {
    ev.preventDefault();
    if (!this.state.email || this.state.email === '') {
      this.setState({ error: message.format('require_enter', 'email address') });
    } else if (Validate.isEmail(this.state.email)) {
      this.setState({ loading: true });
      request.post(
        `${apiUrl}/Websites/${this.state.subDomain}/SubscriptionEmail?Email=${this.state.email}`,
        {},
        (response) => {
          if (response.data) {
            this.setState({ success: response.data, loading: false });
            setTimeout(() => {
              this.setState({ success: null });
            }, 5000);
          } else {
            this.setState({ error: response.error, loading: false });
          }
        }
      );
    } else {
      this.setState({ error: message.error.NOT_VALID_EMAIL });
    }
  }

  render() {
    const { id, title, submit, subscribe, setting, editMode } = this.props;

    const sectionTitel = setting.title.show ? (
      <div style={{ backgroundColor: setting.title.backgroundColor }}>
        <TextBox
          id={`subscribe-1-title-${id}`}
          editMode={editMode}
          sectionID={id}
          type="title"
        >{ title }</TextBox>
      </div>
    ) : null;

    const sectionForm = (
      <div className="form">
        { this.state.error &&
          <div className="text-center error">
            { this.state.error }
            <br />
          </div>
        }
        { this.state.success &&
          <div className="text-center success">
            { this.state.success }
            <br />
          </div>
        }
        <form onSubmit={(ev) => this.onSubmit(ev)}>
          <div className="padding-top padding-bottom">
            <input
              style={setting.subscribe.email}
              type="text"
              className={`subscribe-input ${this.state.error ? 'error-input' : ''}`}
              value={this.state.email}
              onClick={() => this.setState({ error: null })}
              onChange={(ev) => this.setState({ email: ev.target.value, error: null })}
              placeholder={subscribe.email}
            />
          </div>
          <div className="padding-top padding-bottom">
            <button
              type="submit"
              style={setting.submit}
              className="subscribe-submit"
            >{ submit }</button>
          </div>
        </form>
      </div>
    );

    return (
      <div
        className="subscribe-1"
        data-automation-id="section-subscribe"
        data-automation-design="subscribe-1"
        data-automation-section-id={id}
      >
        { sectionTitel }
        { sectionForm }
        { this.state.loading && <Loading inside /> }
      </div>
    );
  }
}

Subscribe1.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string,
  submit: PropTypes.string,
  subscribe: PropTypes.object,
  setting: PropTypes.object,
  editMode: PropTypes.bool,
};

Subscribe1.defaultProps = {
  title: '',
  submit: '',
  subscribe: {},
  setting: {},
  editMode: false,
};

export default Subscribe1;
