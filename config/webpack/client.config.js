const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const paths = require('../paths');
const resolvers = require('./resolvers');
const plugins = require('./plugins');
const { client: clientLoaders } = require('./loaders');

const isDev = process.env.NODE_ENV === 'development';
const generateSourceMap = process.env.SOURCEMAP === 'true' ? true : false;

const config = {
  name: 'client',
  target: 'web',
  mode: isDev ? 'development' : 'production',
  entry: {
    bundle: [
      paths.srcClient,
      // https://babeljs.io/docs/en/babel-polyfill
      require.resolve('core-js/stable'),
      require.resolve('regenerator-runtime/runtime'),
    ],
  },
  output: {
    path: path.join(paths.clientBuild, paths.publicPath),
    filename: isDev ? '[name].js' : '[name].[contenthash:8].js',
    publicPath: paths.publicPath,
    chunkFilename: '[name].[chunkhash:8].chunk.js',
  },
  module: {
    rules: clientLoaders,
  },
  resolve: resolvers,
  devtool: generateSourceMap
    ? isDev
      ? '#cheap-module-eval-source-map'
      : '#source-map'
    : false,
  devServer: {
    compress: true,
    port: process.env.PORT || 8500,
    overlay: true,
    open: true,
    historyApiFallback: true, // needed for react-router
  },
  plugins: [...plugins.shared, ...plugins.client],
  performance: {
    hints: isDev ? false : 'warning',
  },
  stats: 'minimal',
};

if (!isDev) {
  config.optimization = {
    minimize: true,
    minimizer: [
      // TerserPlugin config is taken entirely from react-scripts
      // https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/config/webpack.config.js
      new TerserPlugin({
        terserOptions: {
          parse: {
            // We want terser to parse ecma 8 code. However, we don't want it
            // to apply any minification steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending further investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          // Added for profiling in devtools
          keep_classnames: !isDev,
          keep_fnames: !isDev,
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true,
          },
        },
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
    moduleIds: 'named',
    emitOnErrors: false,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  };
}

module.exports = config;
