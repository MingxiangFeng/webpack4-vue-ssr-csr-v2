const path = require('path')
const express = require('express')
const compression = require('compression')
const microcache = require('route-cache')
const resolve = file => path.resolve(__dirname, file)
const history = require('connect-history-api-fallback')

const isProd = process.env.NODE_ENV === 'production'
const useMicroCache = process.env.MICRO_CACHE !== 'false'

const app = express()

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
})

app.use(history({
  verbose: true,
  htmlAcceptHeaders: ['text/html'],
  disableDotRule: true,
  // 当前首页是ssr页面
  index: '/list/index.htm',
  // 当有路由是ssr页面时，需要优先放在数组前。
  // 索引越靠前，优先匹配
  rewrites: [
    {
      from: /^\/home-list(\/)?.*/,
      to:  '/home-list'
    },
    { 
      from: /^\/detail(\/)?.*/,
      to:  '/detail/index.html'
    }, {
      from: /^\/list(\/)?.*/,
      to:  '/list/index.html'
    },
  ],
}))

if (isProd) {
  app.use(serve('./dist'));
} else {
  const webpack = require("webpack");
  const middleware = require("webpack-dev-middleware");
  const config = require('./build/webpack.dev.conf.js')
  console.log('config===', config);
  for (const key in config.entry) {
    const item = config.entry[key]
    // 官方包
    item.unshift('webpack-hot-middleware/client')
    // 民间优化包
    // item.unshift('./build/webpack-hot-middleware/client')
  }
  const compiler = webpack(config);
  app.use(middleware(compiler, { publicPath: config.output.publicPath }))
  app.use(require("webpack-hot-middleware")(compiler, {
    overlay: true
  }));
}

app.use(compression({ threshold: 0 }))
app.use(microcache.cacheSeconds(1, req => useMicroCache && req.originalUrl))

const port = process.env.PORT || 9998
app.listen(port, () => {
  console.log(`server started at localhost:${port}`)
})
