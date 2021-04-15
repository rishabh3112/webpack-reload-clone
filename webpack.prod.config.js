const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const webpackConfig = require('./webpack.config')

module.exports = env => {
  const config = webpackConfig(env)
  return [
    Object.assign(config, {
      mode: 'production',
      devtool: 'source-map',
      optimization: {
        ...config.optimization,
        minimizer: [
          // webpack@5 can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`)
          '...',
          new CssMinimizerPlugin(),
        ],
      },
    }),
  ]
}
