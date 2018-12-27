'use strict';
/*global __dirname, require, module*/
//https://github.com/krasimir/webpack-library-starter/blob/master/webpack.config.js
const base = require('../../config/webpack.config.base');

const config = base(__dirname, './src/index.ts', '@staat/core', 'index.js');

config.externals = {
  'deep-diff': {
    commonjs: 'deep-diff',
    commonjs2: 'deep-diff',
    amd: 'deep-diff',
    root: 'deepDiff',
  },
  'deep-freeze': {
    commonjs: 'deep-freeze',
    commonjs2: 'deep-freeze',
    amd: 'deep-freeze',
    root: 'deepFreeze',
  }
};

module.exports = config;
