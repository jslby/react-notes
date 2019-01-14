const path = require('path');
const HWP = require('html-webpack-plugin');
const JavaScriptObfuscator = require('webpack-obfuscator');
const CnameWebpackPlugin = require('cname-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, '/src/index.js'),
  performance: { hints: false },
  output: {
    filename: 'build.js',
    path: path.join(__dirname, '/dist'),
    publicPath: '/',
  },
  module: {
    rules:[
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets:['stage-0','react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
  },
  plugins:[
    new HWP(
      {template: path.join(__dirname, '/src/index.html')}
    ),
    new CnameWebpackPlugin({
      domain: 'qoop.cc',
    })
  ]
}
