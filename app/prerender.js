import React from 'react';
import ReactDOMServer from 'react-dom/server';
import AppContainer from './app';

const prerender = () => ReactDOMServer.renderToString(<AppContainer />);

export { prerender };
