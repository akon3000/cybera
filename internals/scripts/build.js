/*eslint-disable*/
require('./dependencies');
// require('shelljs/global');

exec('cross-env NODE_ENV=production webpack --config internals/webpack/webpack.prod.babel.js --color -p --progress')
cp('app/web.config', 'build/web.config');