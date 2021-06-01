# 特性
- mpa, csr&ssr
- webpack5, vue2.x, babel8.x, css, scss
- 支持history模式（需在start.js中配置）
- 默认所有页面支持vw（不需要支持的页面需要在postcss.config.js中配置）
- 其他
  - 文件夹快捷引入
    - src文件夹 @
    - static文件夹 @static
# 运行
```bash
# 开发环境运行
npm run dev
# 生产构建
npm run build
```
# 部署
使用pm2进行部署，命令```npm run start```。关于pm2，请查看https://pm2.keymetrics.io/

# 约定
- 开发文件目录为src目录，每个目录都是一个vue单页应用。
- 按照页面的耦合程度进行判断，一个路由页作为一个单页应用还是多页路由页作为一个单页应用。
- 其他
  - 当前src中home目录为ssr页面目录

# 开发过程遇到的问题
## 无法热更新的问题 "webpack-hot-middleware": "^2.25.0",
- 系webpack5的bug
- 解决方法安装
  - "webpack-hot-middleware": "git+https://github.com/lukeapage/webpack-hot-middleware#2cdfe0d0111dab6432b8683112fd2d17a5e80572"

## [vue-server-renderer-webpack-plugin] webpack config `output.libraryTarget` should be "commonjs2".
- 解决方法
  - 修改 /node_modules/vue-server-renderer/server-plugin.js
    ```javascript
    var validate = function (compiler) {
      if (compiler.options.target !== 'node') {
        warn('webpack config `target` should be "node".');
      }
    -  if (compiler.options.output && compiler.options.output.libraryTarget !== 'commonjs2') {
    +  if (compiler.options.output && compiler.options.output.library.type !== 'commonjs2') {
        warn('webpack config `output.libraryTarget` should be "commonjs2".');
      }

      if (!compiler.options.externals) {
        tip(
          'It is recommended to externalize dependencies in the server build for ' +
          'better build performance.'
        );
      }
    };
    ```
    ```javascript
    - var entryAssets = entryInfo.assets.filter(isJS);
    + var entryAssets = entryInfo.assets.filter(file => isJS(file.name));

    if (entryAssets.length > 1) {
      throw new Error(
        "Server-side bundle should have one single entry file. " +
        "Avoid using CommonsChunkPlugin in the server config."
      )
    }

    var entry = entryAssets[0];
    - if (!entry || typeof entry !== 'string') {
    + if (!entry || typeof entry.name !== 'string') {
      throw new Error(
        ("Entry \"" + entryName + "\" not found. Did you specify the correct entry option?")
      )
    }

    var bundle = {
    + entry: entry.name,
      files: {},
      maps: {}
    }
    ```
  - 参考文档：https://github.com/vuejs/vue/issues/11718

## chunkFilename 使用[runtime]/[name].[chunkhash:8].js 导致运行时无法加载chunk文件
- 解决办法
  - 使用函数命名的形式
    - ```
      chunkFilename: (pathData) => {
        const runtimeName = pathData.chunk.runtime
        return `${runtimeName}/[name].[chunkhash:8].js`
      }
      ```
## 单独引入样式文件时，import 'style.css' 与 import('style.css') 是有差异的。
- 前者是bunddle, 后者是chunk并且将内联在js中

## import './style.css'; 报错 // style-loader: Adds some css to the DOM by adding a <style> tag
- 解决办法
  - 