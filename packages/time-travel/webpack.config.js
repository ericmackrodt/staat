'use strict';
/*global __dirname, require, module*/
//https://github.com/krasimir/webpack-library-starter/blob/master/webpack.config.js
const base = require('../../config/webpack.config.base');

const config = base(
  __dirname,
  './src/index.ts',
  '@staat/time-travel',
  'index.js'
);

config.externals = {
  '@staat/core': {
    commonjs: '@staat/core',
    commonjs2: '@staat/core',
    amd: '@staat/core',
    root: '@staat/core'
  }
};

module.exports = config;
