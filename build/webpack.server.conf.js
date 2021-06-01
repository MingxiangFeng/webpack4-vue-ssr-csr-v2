'use strict';

const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const base = require('./webpack.base.conf');
const nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');

const node_env = process.env.NODE_ENV == 'development' ? 'development' : 'production'
const isProd = process.env.NODE_ENV === 'production'

const config = merge(base, {
  mode: node_env,
  target: 'node',
  devtool: 'cheap-source-map',
  entry: path.join(__dirname, '../src/home/entry-server.js'),
  output: {
    path: path.resolve(__dirname, '../dist/home'),
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  },
  externals: nodeExternals({
    allowlist: [/\.(s)?css$/],
  }),
  module: {
    rules:[
      {
        test: /\.(s)?css$/,
        use: ['css-loader'],
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(node_env),
      'process.env.VUE_ENV': JSON.stringify('server')
    }),
    new VueSSRServerPlugin({
      filename: 'vue-ssr-server-bundle.json'
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  ]
})

if (isProd) {
  delete config.devtool
}

module.exports = config;