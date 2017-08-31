/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */
import 'babel-polyfill';

/* eslint-disable */
// Load the favicon, the manifest.json file and the .htaccess file
/* eslint-disable import/no-webpack-loader-syntax */
import '!file-loader?name=[name].[ext]!./favicon.ico';
import '!file-loader?name=[name].[ext]!./manifest.json';
import 'file-loader?name=[name].[ext]!./.htaccess'; // eslint-disable-line import/extensions
/* eslint-enable import/no-webpack-loader-syntax */


// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import { parse as parseQueryString } from 'querystring';
import configureStore from './store';

// Import the CSS reset, which HtmlWebpackPlugin transfers to the build folder
import 'sanitize.css/sanitize.css';
import './app.css';

import App from './containers/App';

// Create redux store with history
const initialState = {};
const history = createHistory();
const store = configureStore(initialState, history);


// helper to add parsed query-property to history.location
function addLocationQuery(historyObject) {
  historyObject.location = Object.assign(
    historyObject.location,
    // slice(1) removes the `?` at the beginning of `location.search`
    { query: parseQueryString(historyObject.location.search.slice(1)) },
  )
}

// parse query-parameters at first page load
addLocationQuery(history)


history.listen((location, action) => {
  addLocationQuery(history); // add parsing for all following history-changes.
  // history.go(); // Force reload.
});

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <AppContainer>
          <App />
        </AppContainer>
      </ConnectedRouter>
    </Provider>,
    document.getElementById('app')
  );
};

render();

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
import { install } from 'offline-plugin/runtime';
install();
/* eslint-enable */
