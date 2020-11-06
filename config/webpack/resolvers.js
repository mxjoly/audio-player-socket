const paths = require('../paths');

module.exports = {
  extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.css', '.sass', '.scss'],
  modules: paths.resolveModules,
  alias: {},
};
