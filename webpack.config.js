const environment = require('dotenv').config()
const path = require('path')
const fs = require('fs')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VirtualModulesPlugin = require('webpack-virtual-modules')
const { ApplicationManifest } = require('./src/core/core.generator.js')
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin')
const DefinePlugin = require('webpack').DefinePlugin
const Dotenv = require('dotenv-webpack')

if (environment.error) {
  throw environment.error
}

module.exports = env => {
  console.log('Environment variables: ', env)
  if (!env || !env.app || typeof env.app !== 'string') {
    throw new Error(
      '\x1b[31mCannot find application variable, make sure to specify --env.app="application_name"\x1b[0m'
    )
  }
  const manifest = ApplicationManifest(env.app)
  const common = {
    mode: 'development',
    entry: {}, // generated dynamically based on manifest.application
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
      // new CleanWebpackPlugin({
      //   cleanStaleWebpackAssets: false,
      //   cleanOnceBeforeBuildPatterns: ['**/*'],
      // }),
      new HtmlWebpackPlugin({
        title: '',
        favicon: './favicon.ico',
        cache: true,
        template: 'index.template.html',
      }),
      new MiniCssExtractPlugin({
        filename: '[name].alpha.css',
      }),
      new VirtualModulesPlugin({
        'src/core/index.js': manifest.coreScript,
      }),
      // new VirtualModulePlugin({
      //   moduleName: 'src/core/index.js',
      //   contents: manifest.coreScript,
      // }),
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
          // type: 'asset',
          // parser: {
          //   dataUrlCondition: {
          //     maxSize: 65536
          //   }
          // }
        },
        // {
        //   test: /\.(csv|tsv)$/,
        //   use: ['csv-loader']
        // },
        // {
        //   test: /\.xml$/,
        //   use: ['xml-loader'],
        // },
      ],
    },
  }

  let output = common

  function recursiveIssuer(m) {
    if (m.issuer) {
      return recursiveIssuer(m.issuer)
    }
    if (m.name) {
      return m.name
    }
    return false
  }

  {
    const dir = './src/app/'
    const app = fs
      .readdirSync(dir)
      .filter(
        el =>
          ['manifest.json', 'core'].indexOf(el) === -1 && el === manifest.application
      )
      .map(name => {
        return { name, path: dir + name }
      })

    output = app.reduce((config, app) => {
      const cfg = { ...config }
      cfg.entry[app.name] = app.path
      cfg.optimization.splitChunks.cacheGroups[`${app.name}Style`] = {
        name: app.name,
        test: (m, c, entry = app.name) =>
          m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
        chunks: 'all',
        enforce: true,
      }
      return cfg
    }, common)
  }

  return output
}
