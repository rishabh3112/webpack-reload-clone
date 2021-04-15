const path = require('path')
const environment = require('dotenv').config()
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const NodemonPlugin = require('nodemon-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
// const DefinePlugin = require('webpack').DefinePlugin
const Dotenv = require('dotenv-webpack')

if (environment.error) {
  throw environment.error
}

module.exports = env => {
  const commonConfig = {
    mode: 'development',
    entry: './server/index.js',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'server/dist'),
      publicPath: '/',
    },
    target: 'node',
    externals: [nodeExternals()],
    node: {
      // Need this when working with express, otherwise the build fails
      __dirname: false, // if you don't put this is, __dirname
      __filename: false, // and __filename return blank or /
    },
    plugins: [
      new Dotenv(),
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ['**/*'],
      }),
      new NodemonPlugin({
        watch: path.resolve(__dirname, './server/dist'),
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'server/ssl', to: 'ssl' },
          { from: 'server/public', to: 'public' },
        ],
      }),
    ],
    resolve: {
      extensions: ['.js'],
      alias: {
        libs: path.resolve(__dirname, './libs/'),
      },
      // modules: ['./', 'node_modules'],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
            },
          ],
        },
        {
          test: /\.(jpg|png|svg|gif)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 65536,
                fallback: 'file-loader',
              },
            },
          ],
        },
        {
          test: /\.(csv|tsv)$/,
          use: ['csv-loader'],
        },
        {
          test: /\.xml$/,
          use: ['xml-loader'],
        },
      ],
    },
  }
  return commonConfig
}
