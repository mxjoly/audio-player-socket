const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const paths = {
  appTemplate: resolveApp('config/webpack/template.ejs'),
  clientBuild: resolveApp('build/public'),
  serverBuild: resolveApp('build'),
  dotenv: resolveApp('.env'),
  src: resolveApp('src'),
  srcClient: resolveApp('src/client'),
  srcServer: resolveApp('src/server'),
  srcShared: resolveApp('src/shared'),
  favicon: resolveApp('src/shared/assets/logo.png'),
  musics: resolveApp('music'),
  publicPath: '/',
  publicAssets: 'assets/',
};

paths.resolveModules = [
  paths.srcClient,
  paths.srcServer,
  paths.srcShared,
  paths.src,
  'node_modules',
];

module.exports = paths;
