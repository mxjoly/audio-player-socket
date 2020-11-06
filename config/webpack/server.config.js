const path = require('path');
const nodeExternals = require('webpack-node-externals');

const paths = require('../paths');
const resolvers = require('./resolvers');
const plugins = require('./plugins');
const { server: serverLoaders } = require('./loaders');

const isDev = process.env.NODE_ENV === 'development';

const config = {
  name: 'server',
  target: 'node',
  mode: isDev ? 'development' : 'production',
  entry: {
    server: [
      path.resolve(paths.srcServer),
      // // https://babeljs.io/docs/en/babel-polyfill
      require.resolve('core-js/stable'),
      require.resolve('regenerator-runtime/runtime'),
    ],
  },
  output: {
    path: paths.serverBuild,
    filename: 'server.js',
    publicPath: paths.publicPath,
  },
  externals: [
    nodeExternals({
      // we still want imported css from external files to be bundled otherwise 3rd party packages
      // which require us to include their own css would not work properly
      allowlist: /\.css$/,
    }),
  ],
  resolve: resolvers,
  module: {
    rules: serverLoaders,
  },
  plugins: [...plugins.shared, ...plugins.server],
  performance: {
    hints: isDev ? false : 'warning',
  },
  stats: 'minimal',
  node: {
    __dirname: false,
  },
};

module.exports = config;
