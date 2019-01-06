'use strict';
/*global __dirname, require, module*/
//https://github.com/krasimir/webpack-library-starter/blob/master/webpack.config.js
const base = require('../../config/webpack.config.base');

const config = base(
  __dirname,
  './src/index.ts',
  'staat-timetravel',
  'index.js'
);

config.externals = {
  staat: {
    commonjs: 'staat',
    commonjs2: 'staat',
    amd: 'staat',
    root: 'staat'
  },
  'deep-diff': {
    commonjs: 'deep-diff',
    commonjs2: 'deep-diff',
    amd: 'deep-diff',
    root: 'deep-diff'
  }
};

module.exports = config;
