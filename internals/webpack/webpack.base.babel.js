/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require('path');
const webpack = require('webpack');

// PostCSS plugins
const cssnext = require('postcss-cssnext');
const postcssFocus = require('postcss-focus');
const postcssReporter = require('postcss-reporter');
module.exports = (options) => ({
  entry: options.entry,
  output: Object.assign({ // Compile into js/build.js
    path: path.resolve(process.cwd(), 'build'),
    publicPath: '/',
  }, options.output), // Merge with env dependent settings
  module: {
    loaders: [{
      test: /\.js$/, // Transform all .js files required somewhere with Babel
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: options.babelQuery,
    }, {
      // Transform our own .css files with PostCSS and CSS-modules
      test: /\.css$/,
      // exclude: /node_modules/,
      exclude: [
        /node_modules/,
        path.resolve(process.cwd(), 'app/containers/Websites'),
        path.resolve(process.cwd(), 'app/components/Video'),
        path.resolve(process.cwd(), 'app/assets'),
      ],
      loader: options.cssLoaders,
    }, {
      test: /\.css$/,
      include: [
        path.resolve(process.cwd(), 'app/containers/Websites'),
        path.resolve(process.cwd(), 'app/components/Video'),
      ],
      loader: ['style-loader', 'css-loader'],
    }, {
      // Do not transform vendor's CSS with CSS-modules
      // The point is that they remain in global scope.
      // Since we require these CSS files in our JS or CSS files,
      // they will be a part of our compilation either way.
      // So, no need for ExtractTextPlugin here.
      test: /\.css$/,
      include: /node_modules/,
      loaders: ['style-loader', 'css-loader'],
      exclude: /flexboxgrid/,
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader?modules',
      include: /flexboxgrid/,
    }, {
      // test: /\.(eot|svg|ttf|woff|woff2)$/,
      // loader: 'file-loader',
      test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
      loader: 'file-loader',
    },
    // {
    //   test: /\.(jpg|png|gif)$/,
    //   loaders: [
    //     'file-loader',
    //     'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}',
    //   ],
    // },
    {
      // Transform our own .css files with PostCSS and CSS-modules
      test: /\.css$/,
      // exclude: /node_modules/,
      include: path.resolve(process.cwd(), 'app/assets'),
      loader: ['style-loader', 'css-loader'],
    },
    {
      test: /\.(jpg|png|gif)$/,
      loaders: 'file-loader',
    }, {
      test: /\.html$/,
      loader: 'html-loader',
    }, {
      test: /\.json$/,
      loader: 'json-loader',
    }, {
      test: /\.(mp4|webm)$/,
      loader: 'url-loader?limit=10000',
    }, {
      test: /\.(config)$/,
      loaders: 'file-loader',
    }],
  },
  plugins: options.plugins.concat([
    new webpack.ProvidePlugin({
      // make fetch available
      fetch: 'exports-loader?self.fetch!whatwg-fetch',
    }),

    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; UglifyJS will automatically
    // drop any unreachable code.
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
         // 'context' needed for css-loader see
         // https://github.com/mxstbr/react-boilerplate/pull/1032#issuecomment-249821676
        context: __dirname,
        postcss: () => [
          postcssFocus(), // Add a :focus to every :hover
          cssnext({ // Allow future CSS features to be used, also auto-prefixes the CSS...
            browsers: ['last 2 versions', 'IE > 10'], // ...based on this browser list
          }),
          postcssReporter({ // Posts messages from plugins to the terminal
            clearMessages: true,
          }),
        ],
      },
    }),
  ]),
  resolve: {
    modules: ['app', 'node_modules'],
    extensions: [
      '.js',
      '.jsx',
      '.react.js',
    ],
    mainFields: [
      'main',
      'jsnext:main',
    ],
  },
  devtool: options.devtool,
  target: 'web', // Make web variables accessible to webpack, e.g. window
  stats: false, // Don't show stats in the console
  node: {
    fs: 'empty',
  },
  externals: [
    {
      './cptable': 'var cptable',
    },
  ],
});
