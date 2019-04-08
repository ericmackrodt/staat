'use strict';
/*global __dirname, require, module*/
//https://github.com/krasimir/webpack-library-starter/blob/master/webpack.config.js
const base = require('../../config/webpack.config.base');
const path = require('path');
const config = {
  ...base(__dirname, './src/index.ts', 'staat-react', 'index.js'),
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'react',
    },
    staat: {
      commonjs: 'staat',
      commonjs2: 'staat',
      amd: 'staat',
      root: 'staat',
    },
  }
};


module.exports = [{
  ...config,
  module: {
    ...config.module,
    rules: [{
      test: /(\.tsx?)$/,
      loader: 'ts-loader',
      exclude: /(node_modules|bower_components|__tests__)/,
      options: {
        configFile: 'tsconfig-web.json'
      },
    }]
  }
}, {
  ...config,
  output: {
    ...config.output,
    path: path.join(__dirname, 'native/build'),
  },
  module: {
    ...config.module,
    rules: [{
      test: /(\.tsx?)$/,
      exclude: /(node_modules|bower_components|__tests__)/,
      use: [{
        loader: 'babel-loader'
      }, {
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig-native.json'
        },
      }]
    }]
  },
}];
