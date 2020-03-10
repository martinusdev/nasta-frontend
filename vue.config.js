const path = require('path');

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/nasta-frontend/' : '/',
  outputDir: path.resolve(__dirname, 'docs'),
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'Nasta';
      return args;
    });
  },
};
