const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {merge} = require('webpack-merge');
const base = require('./webpack.base.conf.js');
const VueSSRClientPlugin = require('./lib/client-plugin');

let config = merge(base, {
  entry: {
    'home': '/src/home/index.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Caching',
      template: '/src/home/template.html',
      filename: 'home/index.html',
      chunks: ['home'],
      inject: true,
      minify: {
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        removeAttributeQuotes: true,
        minifyCSS: true,
        minifyJS: true,
        removeComments: false
      },
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"client"',
    }),
    new VueSSRClientPlugin({ // 对home目录做ClientMainifest构建
      pageName: 'home',
      filename: 'home/vue-ssr-client-manifest.json'
    })
  ]
});

if (process.env.NODE_ENV === 'production') {
  delete config.devtool;
  config.output.filename = 'js/[name].[chunkhash:8].min.js';
  config.module.rules.push(
    {
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
    },
    {
      test: /\.s(a|c)ss$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
    }
  )
  config.plugins.push(
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css'
    })
  )
} else {
  config.module.rules.push(
    {
      test: /\.css$/,
      use: ['vue-style-loader',  'css-loader', 'postcss-loader'],
    }, 
    {
      test: /\.s(a|c)ss$/,
      use: ['vue-style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
    }
  )
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  )
}
config.optimization.splitChunks = {
  chunks: 'async',
  minSize: 30000,
  maxSize: 0,
  minChunks: 1,
  maxAsyncRequests: 5,
  maxInitialRequests: 3,
  automaticNameDelimiter: '~',
  name: true,
  // cacheGroups: {
  //   vendors: {
  //     test: /[\\/]node_modules[\\/]/,
  //     priority: -10
  //   },
  //   default: {
  //     minChunks: 2,
  //     priority: -20,
  //     reuseExistingChunk: true
  //   }
  // }
}
config.plugins = config.plugins.concat([
  new CopyWebpackPlugin({
    patterns: [
      {
        from: resolve(__dirname, '../static'),
        to: 'static',
      }
    ]
  }),
]);

module.exports = config;
