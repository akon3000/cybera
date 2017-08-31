import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';

import styles from './styles.css';
import overwriteTheme from './overwriteTheme';
import Routes from '../../routes';
import { makeSelectLocation } from './selectors';

injectTapEventPlugin();

class App extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(overwriteTheme)}>
        <div className={styles.container}>
          <Routes />
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  location: makeSelectLocation(),
});

export default withRouter(connect(mapStateToProps)(App));
