'use strict';

const fs = require('fs');
const glob = require('glob')
const webpack = require('webpack');
const baseWebpackConfig = require('./webpack.base.conf')
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { merge } = require('webpack-merge');
// const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

const node_env = process.env.NODE_ENV === 'development' ? 'development' : 'production'
const isProd = process.env.NODE_ENV === 'production'

const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(__dirname, '../src/*/index.js'));

  Object.keys(entryFiles)
    .map((index) => {
      const entryFile = entryFiles[index];
      const match = entryFile.match(/src\/(.*)\/index\.js/);
      
      let pageName = ''
      let entryPath = ''
      let templatePath = ''

      if (match && match[1]) {
        pageName = match && match[1]
        entryPath = entryFile

        const p = `../src/${pageName}/template.html`

        const hasTemplatePath = path.join(__dirname, p)

        if (!fs.existsSync(hasTemplatePath)) {
          const filepath = path.join(__dirname, p)
          fs.writeFileSync(filepath, `
            <!DOCTYPE html>
                <html lang="zh">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta http-equiv="X-UA-Compatible" content="ie=edge">
                    <title>Document</title>
                </head>
                <body>
                    <div id="app"></div>
                </body>
                </html>
            `)
          templatePath = filepath    
        } else {
          templatePath = path.join(__dirname, p)
        }
      }

      entry[pageName] = entryPath;

      htmlWebpackPlugins.push(
        new HtmlWebpackPlugin({
          title: 'Caching',
          template: templatePath,
          filename: `${pageName}/index.html`,
          chunks: [pageName],
          inject: true,
          minify: {
            html5: true,
            collapseWhitespace: true,
            preserveLineBreaks: false,
            removeAttributeQuotes: true,
            minifyCSS: true,
            minifyJS: true,
            removeComments: pageName == 'home' ? false: true
          },
        })
      );

      // if (pageName == 'home') {
      //   htmlWebpackPlugins.push(new VueSSRClientPlugin({filename: 'home/vue-ssr-client-manifest.json'}))
      // }
    });

  return {
    entry,
    htmlWebpackPlugins
  }
}
  
const { entry, htmlWebpackPlugins } = setMPA();

const config = merge(baseWebpackConfig, {
  mode: node_env,
  entry,
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name]/[id].[chunkhash:8].js',
    chunkFilename: 'chunk/js/[id].[chunkhash:8].js',
    // chunkFilename: (pathData) => {
    //   const runtimeName = pathData.chunk.runtime
    //   return `${runtimeName}/[name].[chunkhash:8].js`
    // },
		publicPath: '/'
  },
  module: {
    rules: [
      // {
      //   test: /\.scss$/,
      //   // 'postcss-loader'
      //   use: isProd ? [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'] 
      //     : ['vue-style-loader', 'css-loader', 'sass-loader'],
      // },
      {
        test: /\.css$/,
        // 'postcss-loader'
        use: isProd ? [MiniCssExtractPlugin.loader, 'css-loader'] 
          : ['vue-style-loader', 'css-loader'],
      }
    ]
  },
  plugins: [
		new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(node_env)
    }),
    // new webpack.ProgressPlugin({
    //   activeModules: false,
    //   entries: true,
    //   handler(percentage, message, ...args) {
    //     // e.g. Output each progress message directly to the console:
    //     // console.info('percentage==', percentage, 'message==', message, 'args===', ...args);
    //   },
    //   modules: true,
    //   modulesCount: 5000,
    //   profile: false,
    //   dependencies: true,
    //   dependenciesCount: 10000,
    //   percentBy: null,
    // }),
  ].concat(htmlWebpackPlugins),
})

if (isProd) {
  delete config.devtool;
  config.plugins.push(
    new MiniCssExtractPlugin(
      {
        filename: '[name]/style.[contenthash:8].css',
        chunkFilename: 'chunk/css/[name].[chunkhash:8].css',
        // chunkFilename: ({chunk}) => {
        //   return `${chunk.runtime}/[id].[contenthash:8].css`
        // }
      }
    )
  )
} else {
  config.output.filename = '[name].js',
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  )
}
console.log('isProd===', isProd);

module.exports = config;