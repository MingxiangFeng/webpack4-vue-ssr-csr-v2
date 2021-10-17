const webpack = require('webpack')
const { resolve, join } = require('path');
const nodeModulesPath = resolve(__dirname, '../node_modules');
const TerserPlugin = require('terser-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const glob = require('glob')
const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const isPro = process.env.NODE_ENV === 'production'

const optimization = {
  minimize: true,
  minimizer: [
    new TerserPlugin({
      parallel: 4,
      terserOptions: {
        ecma: undefined,
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
      
      // 'babel-polyfill',
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
            removeComments: pageName == 'home' ? false: true
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

const config = {
  mode: isPro ? 'production' : 'development',
  devtool: 'cheap-module-eval-source-map',
  entry,
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
      test: /\.html$/i,
      loader: 'raw-loader'
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: nodeModulesPath,
    }, 
    {
      test: /\.css$/,
      use: ['vue-style-loader', 'css-loader', 'postcss-loader'],
    },
    {
      test: /\.s(a|c)ss$/,
      use: ['vue-style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
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
  plugins: [
    new VueLoaderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
    new webpack.ProgressPlugin({})
  ].concat(htmlWebpackPlugins),
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
