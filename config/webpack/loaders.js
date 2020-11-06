const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

require('dotenv').config();

const isDev = process.env.NODE_ENV === 'development';
const generateSourceMap = process.env.SOURCEMAP === 'true' ? true : false;

const cssRegex = /\.css$/;
const sassRegex = /\.s[ac]ss$/;
const imageRegex = /\.(jpe?g|png|gif|svg)$/i;

const babelLoader = {
  test: /\.(js|jsx|ts|tsx)$/i,
  exclude: /(node_modules|bower_components)/,
  use: {
    loader: require.resolve('babel-loader'),
    options: {
      presets: [
        '@babel/preset-env',
        '@babel/preset-react',
        '@babel/preset-typescript',
      ],
      plugins: [],
      cacheDirectory: !isDev,
      cacheCompression: !isDev,
    },
  },
};

const cssLoaderClient = {
  test: cssRegex,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
      },
    },
    {
      loader: require.resolve('css-loader'),
      options: { importLoaders: 1 },
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        sourceMap: generateSourceMap,
      },
    },
  ],
};

const sassLoaderClient = {
  test: sassRegex,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
      },
    },
    {
      loader: require.resolve('css-loader'),
      options: { importLoaders: 1 },
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        sourceMap: generateSourceMap,
      },
    },
    require.resolve('sass-loader'),
  ],
};

const imageLoaderClient = {
  test: imageRegex,
  loader: require.resolve('url-loader'),
  options: {
    name(resourcePath) {
      const relativePath = path.relative(paths.srcShared, resourcePath);
      const dir = path.dirname(relativePath);
      if (!dir.startsWith('assets')) {
        console.log(
          chalk.yellow(
            chalk.bold('WARNING') +
              ' You must only set your images in the folder named assets.'
          )
        );
      }
      return path.join(
        dir,
        isDev ? '[name].[ext]' : '[name].[contenthash:8].[ext]'
      );
    },
    limit: 2048, // the maximum size of a file in bytes
  },
};

const fileLoaderClient = {
  exclude: [/\.(js|jsx|ts|tsx|css|mjs|html|ejs|json)$/],
  loader: require.resolve('file-loader'),
  options: {
    name(resourcePath) {
      const relativePath = path.relative(process.cwd(), resourcePath);
      const dir = path.dirname(relativePath);
      if (dir.startsWith('node_modules/')) {
        return path.join(
          'assets',
          isDev ? '[name].[ext]' : '[name].[contenthash:8].[ext]'
        );
      }
      return path.join(
        dir,
        isDev ? '[name].[ext]' : '[name].[contenthash:8].[ext]'
      );
    },
  },
};

const cssLoaderServer = {
  test: cssRegex,
  use: [MiniCssExtractPlugin.loader, 'css-loader'],
};

const sassLoaderServer = {
  test: sassRegex,
  use: [
    MiniCssExtractPlugin.loader,
    require.resolve('css-loader'),
    require.resolve('postcss-loader'),
    require.resolve('sass-loader'),
  ],
};

const imageLoaderServer = {
  ...imageLoaderClient,
  options: {
    ...imageLoaderClient.options,
    emitFile: false,
  },
};

const fileLoaderServer = {
  ...fileLoaderClient,
  options: {
    ...fileLoaderClient.options,
    emitFile: false,
  },
};

const client = [
  {
    // "oneOf" will traverse all following loaders until one will
    // match the requirements. When no loader matches it will fall
    // back to the "file" loader at the end of the loader list.
    oneOf: [
      babelLoader,
      cssLoaderClient,
      sassLoaderClient,
      imageLoaderClient,
      fileLoaderClient,
    ],
  },
];

const server = [
  {
    oneOf: [
      babelLoader,
      cssLoaderServer,
      sassLoaderServer,
      imageLoaderServer,
      fileLoaderServer,
    ],
  },
];

module.exports = { client, server };
