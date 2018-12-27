'use strict';
/*global __dirname, require, module*/
//https://github.com/krasimir/webpack-library-starter/blob/master/webpack.config.js
const path = require('path');
const env = require('yargs').argv.env; // use --env with webpack 2

let libraryName = '@staat/core';

let plugins = [];
const outputFile = 'index.js';

const config = {
  mode: 'production',
  entry: __dirname + '/src/index.ts',
  devtool: 'source-map',
  output: {
    path: __dirname + '/build',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    rules: [{
      test: /(\.tsx?)$/,
      loader: 'ts-loader',
      exclude: /(node_modules|bower_components)/
    }]
  },
  resolve: {
    modules: ['node_modules', path.resolve('./src')],
    extensions: ['.json', '.ts'],
    symlinks: false,
  },
  plugins: plugins,
  externals: {
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
  }
};

if (env === 'build') {
  config.optimization = {
    minimize: false
  };
}

module.exports = config;
