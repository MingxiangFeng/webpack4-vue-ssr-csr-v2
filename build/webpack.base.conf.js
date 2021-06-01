'use strict';

const path = require('path')
const { resolve } = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const TerserPlugin = require('terser-webpack-plugin')

let config = {
  devtool: 'cheap-source-map',
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
        test: /\.js(\?.*)?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-transform-runtime']
        },
        include: [path.join(__dirname, '../src'), path.join(__dirname, '../node_modules/webpack-dev-server/client')],
        exclude: resolve(__dirname, '../node_modules'),
      }, 
      {
        test: /\.html$/i,
        loader: 'raw-loader'
      }, {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name(resourcePath, resourceQuery) {
            const matchs = resourcePath.split('/')
            let index = 0 
            matchs.find((item, key) => {  
              if (item === 'src') {
                index = key
              }
            })
            const rootName = matchs && matchs[index + 1]
            return `${rootName}/images/[name].[hash:7].[ext]`
          },
          esModule: false
        }
      }, {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name(resourcePath, resourceQuery) {
            const matchs = resourcePath.split('/')
            let index = 0 
            matchs.find((item, key) => {  
              if (item === 'src') {
                index = key
              }
            })
            const rootName = matchs && matchs[index + 1]
            return `${rootName}/video/[name].[hash:7].[ext]`
          },
          esModule: false
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name(resourcePath, resourceQuery) {
            const matchs = resourcePath.split('/')
            let index = 0 
            matchs.find((item, key) => {  
              if (item === 'src') {
                index = key
              }
            })
            const rootName = matchs && matchs[index + 1]
            return `${rootName}/font/[name].[hash:7].[ext]`
          },
          esModule: false
        }
      }],
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.runtime.js',
      '@': path.join(__dirname, '../src'),
      '@static': path.join(__dirname, '../static')
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../static'),
          to: 'static',
        }
      ]
    }),
    new webpack.AutomaticPrefetchPlugin()
  ]
};

module.exports = config;