const path = require('path');
const webpack = require('webpack');

const AssetsManifestPlugin = require('webpack-assets-manifest');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const envBuilder = require('../env');
const paths = require('../paths');

const env = envBuilder();

const isProfilerEnabled = () => process.argv.includes('--profile');
const isDev = () => process.env.NODE_ENV === 'development';

const shared = [
  // This plugin extracts CSS into separate files. It creates a CSS file per JS file which contains CSS.
  // It supports On-Demand-Loading of CSS and SourceMaps.
  new MiniCssExtractPlugin({
    filename: isDev() ? '[name].css' : '[name].[contenthash].css',
    chunkFilename: isDev() ? '[id].css' : '[id].[contenthash].css',
  }),
  // This Webpack plugin enforces the entire path of all required modules match the exact case
  // of the actual path on disk. Using this plugin helps alleviate cases where developers working on OSX,
  // which does not follow strict path case sensitivity, will cause conflicts with other developers or build
  // boxes running other operating systems which require correctly cased paths.
  new CaseSensitivePathsPlugin(),
  // Hot Module Replacement (HMR) exchanges, adds, or removes modules while an application is running, without a full reload
  isDev() && new webpack.HotModuleReplacementPlugin(),
].filter(Boolean);

const client = [
  // new webpack.ProgressPlugin(), // make this optional e.g. via `--progress` flag
  new webpack.DefinePlugin(env.stringified),
  new webpack.DefinePlugin({
    __SERVER__: 'false',
    __BROWSER__: 'true',
  }),
  // Simplifies creation of HTML files to serve the webpack bundles
  new HtmlWebpackPlugin({
    publicPath: paths.publicPath,
    template: paths.appTemplate,
    filename: path.join(paths.clientBuild, 'index.html'),
    inject: false,
    minify: !isDev(),
    favicon: paths.favicon,
    meta: {
      charset: { charset: 'utf-8' },
      viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
    },
  }),
  // Webpack plugin for generating an assets manifest.
  new AssetsManifestPlugin({
    fileName: 'manifest.json',
    publicPath: paths.publicPath,
  }),
  // Generate Chrome profile file which includes timings of plugins execution.
  isProfilerEnabled() && new webpack.debug.ProfilingPlugin(),
  // Copy the public folder to the client build
  new CopyPlugin({
    patterns: [
      {
        from: paths.musics,
        to: path.join(paths.clientBuild, paths.publicAssets, 'musics'),
      },
    ],
  }),
].filter(Boolean);

const server = [
  new webpack.DefinePlugin({
    __SERVER__: 'true',
    __BROWSER__: 'false',
  }),
].filter(Boolean);

module.exports = {
  shared,
  client,
  server,
};
