# 较前沿，稳定的，大型网站前端架构。

# 特性
- mpa, csr&ssr
- webpack4, vue2.x, babel8.x, css, scss
- 支持history模式（需在start.js中配置）
- 默认所有页面支持vw（不需要支持的页面需要在postcss.config.js中配置）
- 其他
  - 文件夹快捷引入
    - src文件夹 @
    - static文件夹 @static
  - 模板文件夹 template

# 运行
```bash
# 安装依赖
npm i
# 开发，服务启动后，访问localhost:9998
npm run dev
# 构建
npm run build
```

# 部署
使用pm2在服务器上部署, 启动命令```npm run start``` pm2指南文档：https://pm2.keymetrics.io/

# 开发问题记录
- 样式文件引入报错
  - 复现
    ```javascript
    <script>
    // 这样会报错，尚未解决，请放在<style>标签中引入
    import '../scss/index.scss';
    export default {

    }
    </script>
    ```
  - 解决方法
    - 这是vue-loader的错误导致。放在style标签中能解决此问题。
    ```css
    <style lang="scss" scoped>
    @import '../scss/index.scss'; 
    </style>
    ```
- 使用style-loader报错： [Vue warn]: TypeError: Cannot read property 'content' of null 
  - 复现步骤
    - 配置webpack的cache.type为filesystem, 开启缓存
    - 初始化一个Vue3 Typescript的项目, 建立一个根单文件组件并使用ts版setup语法糖, 建立一个子单文件组件并使用ts版setup语法糖, 在根组件中导入子组件第一次编译, 正常通过能运行
    - (补充, 这里漏了关键一步, 就是这里需要改动inside.vue的模板内容, 即让缓存失效, 然后再编译才会失败, 否则直接用缓存的话则不会失败)
    - 后续编译, 编译失败, 报下述错误: [Vue warn]: TypeError: Cannot read property 'content' of null 
  - 解决办法
    - 未解决：https://github.com/vuejs/vue-loader/issues/1747
    - 能解决： entry中引入babel-polyfill
  查询资料：https://stackoverflow.com/questions/64766001/vue-server-side-rendering-error-in-beforecreate-hook-referenceerror-document
- "node-sass": "^5.0.0", "sass-loader": "^11.1.1", 报错TypeError: this.getOptions is not a function
  - 原因
    - 版本与webpack对不上
  - 解决办法
    - 版本降级 "node-sass": "^4.14.1", "sass-loader": "^8.0.2",
- 升级vue3.x编译报错
  - ERROR in ./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js 763:13
    Module parse failed: Unexpected token (763:13)
    You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
    | }
    | class RefImpl {
    >     _rawValue;
    |     _shallow;
    |     _value;
  - 解决办法
    - raw-loader 添加.txt
    ```javascript
    {
      test: /\.(html|txt)(\?.*)?$/i,
      loader: 'raw-loader'
    }
    ```


# 其他推荐
- 使用webpack5.x和vue2.x构建csr与ssr的混合mpa架构，大型网站前端架构，前沿！https://github.com/MingxiangFeng/webpack-vue-mpa-ssr-csr-v1
- 使用webpack5.x，vue2.x搭建的大型网站前端csr架构，前沿！https://github.com/MingxiangFeng/webpack-vue-csr-mpa
- 使用webpack4.x和vue2.x搭建的服务端渲染单页应用。https://github.com/MingxiangFeng/webpack-vue-ssr-spa


# Q&S
- Q: 为什么静态渲染时，样式后渲染呢？
- S: 本架构开发环境下，静态渲染的编程过程时，没有提取样式文件，所以样式后渲染。生产环境下，样式已提取，并在html文件的head中引入，不会出现此种情况。
- Q: 什么时候支持webpack5.x，vue3.x 的架构呢？
- S: 快了，预计2021年6月底7月初能与大家见面。