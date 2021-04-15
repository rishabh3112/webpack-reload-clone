const environment = require('dotenv').config()
const path = require('path')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin')
const DefinePlugin = require('webpack').DefinePlugin
const Dotenv = require('dotenv-webpack')

if (environment.error) {
  throw environment.error
}

module.exports = env => {
  const common = {
    mode: 'development',
    entry: './src/app/index.jsx',
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
    },
    plugins: [
      new NodePolyfillPlugin({
        excludeAliases: ['console'],
      }),
      new Dotenv(),
      new CleanWebpackPlugin({
        cleanStaleWebpackAssets: false,
        cleanOnceBeforeBuildPatterns: ['**/*'],
      }),
      new HtmlWebpackPlugin({
        title: '',
        favicon: './favicon.ico',
        cache: true,
        template: 'index.template.html',
      }),
      new MiniCssExtractPlugin({
        filename: '[name].alpha.css',
      }),
      new ErrorOverlayPlugin(),
      new DefinePlugin({
        VERSION: JSON.stringify(require('./package.json').version),
      }),
    ],
    devtool: 'inline-source-map',
    devServer: {
      // contentBase: path.resolve(__dirname, 'dist'),
      contentBase: './dist',
      watchContentBase: true,
      https: true,
      host: '0.0.0.0',
      disableHostCheck: true,
      port: process.env.PORT || 8001,
      openPage: `https://localhost:${process.env.PORT || 8001}`,
      historyApiFallback: true,
      stats: 'errors-only',
      overlay: true,
    },
    optimization: {
      emitOnErrors: false,
      splitChunks: {
        chunks: 'all',
        minSize: 30000,
        maxSize: 3000000,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '.',
        name: false,
        name: (module, chunks, cacheGroup) => {
          const allChunksNames = chunks.map(item => item.name).join('-')
          return `${cacheGroup}-${allChunksNames}`
        },
        cacheGroups: {
          core: {
            test: /[\\/]core[\\/]/,
            priority: 100,
            enforce: true,
          },
          externals: {
            test: /[\\/]node_modules[\\/]/,
            priority: 100,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
        libs: path.resolve(__dirname, './libs/'),
        root: path.resolve(__dirname, './src/'),
        'popper.js': path.resolve(
          __dirname,
          './node_modules/popper.js/dist/esm/popper'
        ),
      },
      modules: ['./', 'node_modules'],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
            },
          ],
        },
        {
          test: /\.(css|scss)$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: 'babel-loader',
            },
            {
              loader: 'react-svg-loader',
              options: {
                jsx: true, // true outputs JSX tags
              },
            },
          ],
        },
        {
          test: /\.(jpg|png|gif)$/,
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
      ],
    },
  }

  return common
}
