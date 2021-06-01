const { resolve, join } = require('path');
const nodeModulesPath = resolve(__dirname, '../node_modules');
const TerserPlugin = require('terser-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

const isPro = process.env.NODE_ENV === 'production'

const config = {
  mode: isPro ? 'production' : 'development',
  devtool: 'cheap-module-eval-source-map',
  // entry: {
  //   'home': [
  //     'babel-polyfill',
  //     resolve(__dirname, '../src/home/entry-client.js'),
  //   ],
  // },
  output: {
    path: join(__dirname, '../dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: 4,
        terserOptions: {
          ecma: undefined,
          compress: {
            drop_console: true, // 删除所有的 `console` 语句, 还可以兼容ie浏览器
            collapse_vars: true, // 内嵌定义了但是只用到一次的变量
            reduce_vars: true, // 提取出出现多次但是没有定义成变量去引用的静态值
          },
          format: {
            comments: false,
          },
          ecma: 5
        },
        extractComments: false,
      }),
    ],
  },
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
      test: /\.html$/i,
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
      vue: 'vue/dist/vue.esm.js'
    },
  },
};

module.exports = config;
