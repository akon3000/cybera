/**
 * A helper comonent that renders a Route that will load a component when the Route is
 * rendered. This allows for asynchronous loading of routes, enabling code-splitting.
 *
 * Inspired by https://reacttraining.com/react-router/web/guides/code-splitting
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import auth from './utils/auth';
import { roles } from './config';
import LoadingPage from './components/LoadingPage';

/**
 * A wrapper component that will lazily render a component after it has been loaded.
 */
class Bundle extends Component {
  state = {
    // short for "module" but that's a keyword in js, so "mod"
    mod: null,
  };

  componentWillMount() {
    this.onEnter(this.props);
  }

  /* istanbul ignore next */
  componentWillReceiveProps(nextProps) {
    this.onEnter(nextProps); // change page
  }

  onEnter(nextProps) {
    const _ = this;
    if (nextProps.userRole === roles.MerchantOrCybera) {
      auth.isMerchantOrCybera((haveAdminAccess) => {
        if (haveAdminAccess) {
          _.load(nextProps);
        } else {
          _.accessDenied();
        }
      });
    } else if (nextProps.userRole !== null && nextProps.accessPermission === null) {
      if (nextProps.userRole === roles.Cybera) {
        auth.isAdmin((haveAccess) => {
          if (haveAccess) {
            _.load(nextProps);
          } else {
            _.accessDenied();
          }
        });
      } else if (nextProps.userRole === roles.Merchant) {
        auth.isMerchant((haveAccess) => {
          if (haveAccess) {
            _.load(nextProps);
          } else {
            _.accessDenied();
          }
        });
      } else {
        _.accessDenied();
      }
    } else if (nextProps.userRole !== null && nextProps.accessPermission !== null) {
      auth.getAccesses(nextProps.userRole, (accesses) => {
        if (!accesses || (accesses && accesses.indexOf(nextProps.accessPermission) === -1)) {
          _.accessDenied();
        } else {
          _.load(nextProps);
        }
      });
    } else if (nextProps.userRole === null && nextProps.accessPermission === null) {
      _.load(nextProps);
    }
  }

  accessDenied() {
    window.location = '/AccessDenied';
  }

  load(props) {
    const _ = this;
    _.setState({
      mod: null,
    });
    props.load((mod) => {
      _.setState({
          // handle both es imports and cjs
        mod: mod.default ? mod.default : mod,
      });
    });
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { load, ...otherProps } = this.props;
    return this.state.mod ? <this.state.mod {...otherProps} /> : <LoadingPage />;
  }
}

Bundle.propTypes = {
  children: PropTypes.node,
  load: PropTypes.func.isRequired,
  userRole: PropTypes.string,
  accessPermission: PropTypes.string,
};

Bundle.defaultProps = {
  children: null,
  userRole: null,
  accessPermission: null,
};

// wrap <Route> and use this everywhere instead, then when
// sub routes are added to any route it'll work
const AsyncRoute = ({ path, load, accessPermission, userRole }) => (
  <Route
    path={path}
    render={(props) => (
      <Bundle load={load} {...props} userRole={userRole} accessPermission={accessPermission} />
    )}
  />
);

AsyncRoute.propTypes = {
  path: PropTypes.string.isRequired,
  load: PropTypes.func.isRequired,
  userRole: PropTypes.string,
  accessPermission: PropTypes.string,
};

AsyncRoute.defaultProps = {
  userRole: null,
  accessPermission: null,
};

export default AsyncRoute;
