// needed for regenerator-runtime
// (ES7 generator support is required by redux-saga)
import 'babel-polyfill';

// If we need to use Chai, we'll have already chaiEnzyme loaded
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
chai.use(chaiEnzyme());

// Include all .js files under `app`, except app.js, reducers.js, and routes.js.
// This is for code coverage
// ../../app/containers/Cybera/SignUp/BusinessInfoPopup
const context = require.context(
    '../../app/assets',
    true,
    /^^((?!(app|reducers|routes)).)*\.js$/
);

context.keys().forEach(context);
// require('../../app/containers/Cybera/SignUp/sagas.js');
// require('../../app/containers/Cybera/SignUp/test/sagas.test.js');
