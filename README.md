# 特性
- mpa, csr&ssr
- webpack5, vue2.x, babel8.x, css, scss
- 支持history模式（需在start.js中配置）
- spa, ssr, webpack4.x, vue2.x

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

# 其他推荐
- webpack5构建csr与ssr的混合mpa架构，大型网站前端架构，最前沿！https://github.com/MingxiangFeng/webpack-vue-mpa-ssr-csr-v1
- 使用webpack4.x和vue2.x搭建的服务端渲染单页应用。https://github.com/MingxiangFeng/webpack-vue-ssr-spa
- 使用webpack5.x，vue2.x搭建的大型网站前端csr架构。https://github.com/MingxiangFeng/webpack-vue-csr-mpa