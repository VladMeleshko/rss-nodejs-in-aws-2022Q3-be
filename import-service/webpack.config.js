	
const slsw = require('serverless-webpack');
const path = require('path');
const webpack = require('webpack')

module.exports = {
  entry: slsw.lib.entries,
  plugins: [
    new webpack.IgnorePlugin({resourceRegExp: /^pg-native$/})
  ],
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js'
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: __dirname,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}