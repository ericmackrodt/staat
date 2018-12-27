'use strict';
/*global __dirname, require, module*/
//https://github.com/krasimir/webpack-library-starter/blob/master/webpack.config.js
const path = require('path');
const env = require('yargs').argv.env; // use --env with webpack 2

let libraryName = '@staat/react';

let plugins = [];
const outputFile = 'index.js';

const config = {
  mode: 'production',
  entry: __dirname + '/src/index.tsx',
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
    extensions: ['.json', '.ts', '.tsx', '.js'],
    symlinks: false,
  },
  plugins: plugins,
  externals: {
    'react': {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'react',
    },
    'create-react-context': {
      commonjs: 'create-react-context',
      commonjs2: 'create-react-context',
      amd: 'create-react-context',
      root: 'create-react-context',
    },
    '@staat/core': {
      commonjs: '@staat/core',
      commonjs2: '@staat/core',
      amd: '@staat/core',
      root: '@staat/core',
    },
  }
};

if (env === 'build') {
  config.optimization = {
    minimize: false
  };
};

module.exports = config;
