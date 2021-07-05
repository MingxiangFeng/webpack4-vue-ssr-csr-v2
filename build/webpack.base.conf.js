const { resolve, join } = require('path');
const nodeModulesPath = resolve(__dirname, '../node_modules');
const TerserPlugin = require('terser-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

const isPro = process.env.NODE_ENV === 'production'

const optimization = {
  minimize: true,
  minimizer: [
    new TerserPlugin({
      parallel: 4,
      terserOptions: {
        compress: {
          drop_console: true,
          collapse_vars: true,
          reduce_vars: true,
        },
        format: {
          comments: false,
        },
        ecma: 5
      },
      extractComments: false,
    }),
  ],
}

const config = {
  mode: isPro ? 'production' : 'development',
  devtool: 'cheap-module-eval-source-map',
  output: {
    path: join(__dirname, '../dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  optimization: isPro ? optimization : {},
  externals: {
    simplemde: 'SimpleMDE',
  },
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        loaders: {
          css: ['vue-style-loader', 'css-loader'],
        },
      },
    }, {
      test: /\.(html|txt)(\?.*)?$/i,
      loader: 'raw-loader'
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: nodeModulesPath,
    }, {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'img/[name].[hash:7].[ext]',
      },
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'fonts/[name].[hash:7].[ext]',
      },
    }],
  },
  plugins: [new VueLoaderPlugin()],
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      '@': resolve('src'),
      '@static': resolve('static'),
      vue: 'vue/dist/vue.runtime.esm-bundler.js'
    },
  },
};

module.exports = config;
