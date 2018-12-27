const path = require('path');
const env = require('yargs').argv.env; // use --env with webpack 2
const CleanWebpackPlugin = require("clean-webpack-plugin");

function config(context, entry, libraryName, outputFile) {
  let plugins = [new CleanWebpackPlugin(["./build"])];
  outputFile = outputFile || 'index.js';
  const config = {
    context,
    mode: 'production',
    entry,
    devtool: 'source-map',
    output: {
      path: path.join(context, '/build'),
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
  };

  if (env === 'build') {
    config.optimization = {
      minimize: false
    };
  }

  return config;
}

module.exports = config;
