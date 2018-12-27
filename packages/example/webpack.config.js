'use strict';
/*global __dirname, require, module*/
//https://github.com/krasimir/webpack-library-starter/blob/master/webpack.config.js
const path = require('path');
const env = require('yargs').argv.env; // use --env with webpack 2
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

let plugins = [
  new CleanWebpackPlugin(["build"]),
  new HtmlWebpackPlugin({
    template: "./src/index.html",
    filename: "./index.html",
  }),
];
const outputFile = 'index.js';

const config = {
  mode: 'development',
  entry: __dirname + '/src/index.tsx',
  devtool: 'source-map',
  output: {
    path: __dirname + '/build',
    filename: outputFile,
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
  devServer: {
    noInfo: true,
    port: 3000,
    open: true,
    publicPath: '/',
  },
};

module.exports = config;
