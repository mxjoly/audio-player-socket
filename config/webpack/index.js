module.exports = (env = 'production') => {
  if (env.match(/(development|production)/)) {
    process.env.NODE_ENV = env;
  } else {
    process.env.NODE_ENV = 'production';
  }
  return [require('./client.config'), require('./server.config')];
};
