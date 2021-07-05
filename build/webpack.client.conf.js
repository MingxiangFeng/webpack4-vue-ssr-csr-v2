const fs = require('fs');
const glob = require('glob')
const path = require('path');
const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {merge} = require('webpack-merge');
const base = require('./webpack.base.conf.js');
const VueSSRClientPlugin = require('./lib/client-plugin');

const isPro = process.env.NODE_ENV === 'production'

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
        if (pageName === 'home' && isPro) return

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
      
      entry[pageName] = [entryPath];

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
            removeComments: pageName == 'home' ? false: true // home不能移除tempalte.html中的注释
          },
        })
      );
    });

  return {
    entry,
    htmlWebpackPlugins
  }
}

const { entry, htmlWebpackPlugins } = setMPA();

!isPro && htmlWebpackPlugins.push(new VueSSRClientPlugin({ // 对home目录做ClientMainifest构建
  pageName: 'home',
  filename: 'home/vue-ssr-client-manifest.json'
}))

let config = merge(base, {
  entry,
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"client"',
    }),
  ].concat(htmlWebpackPlugins),
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
  cacheGroups: {
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      priority: -10
    },
    default: {
      minChunks: 2,
      priority: -20,
      reuseExistingChunk: true
    }
  }
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
