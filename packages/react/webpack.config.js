'use strict';
/*global __dirname, require, module*/
//https://github.com/krasimir/webpack-library-starter/blob/master/webpack.config.js
const base = require('../../config/webpack.config.base');

const config = base(__dirname, './src/index.ts', 'staat-react', 'index.js');

config.externals = {
  react: {
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
  staat: {
    commonjs: 'staat',
    commonjs2: 'staat',
    amd: 'staat',
    root: 'staat',
  },
};

module.exports = config;
