const fs = require('fs')
const { resolve } = require('path')
const path = require('path')
const express = require('express');
const proxy = require('http-proxy-middleware')
const { createBundleRenderer } = require('vue-server-renderer')
const history = require('connect-history-api-fallback')
const LRU = require('lru-cache')

const app = express();

const serverInfo =
  `express/${require('express/package.json').version} ` +
  `vue-server-r enderer/${require('vue-server-renderer/package.json').version}`

const isProd = process.env.NODE_ENV === 'production' 

const serve = (path, cache) => express.static(resolve(__dirname ,path), {
  maxAge: 0//cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
})

function createRenderer(bundle, template) {
  return createBundleRenderer(bundle, {
    template,
    cache: new LRU({
      max: 1000,
      maxAge: 1000 * 60 * 15
    }),
    runInNewContext: false,
  });
}

function render (req, res) {
  const s = Date.now()

  res.setHeader("Content-Type", "text/html")
  res.setHeader("Server", serverInfo)

  const handleError = err => {
    if (err.url) {
      res.redirect(err.url)
    } else if(err.code === 404) {
      res.status(404).send('404 | Page Not Found')
    } else {
      // Render Error Page or Redirect
      res.status(500).send('500 | Internal Server Error')
      console.error(`error during render : ${req.url}`)
      console.error(err.stack)
    }
  }

  const context = {
    title: 'Vue',
    meta: `<meta name="keywords" content="webpack, vue, mpa, ssr, csr">`,
    url: req.url,
  }
  renderer.renderToString(context, (err, html) => {
    if (err) {
      return handleError(err)
    }
    res.send(html)
    if (!isProd) {
      console.log(`whole request: ${Date.now() - s}ms`)
    }
  })
}

let renderer
let readyPromise

// 本地开发，接口代理
if (!isProd) {
  // const options = {
  //   target: 'https://aaa.xxx.com',
  //   changeOrigin: true,               // needed for virtual hosted sites
  //   // ws: true,                         // proxy websockets
  //   pathRewrite: {
  //     '^/aaa-proxy': '/'
  //   }
  // }
  // app.use('/aaa-proxy/', proxy(options))
}

app.use(history({
  verbose: true,
  htmlAcceptHeaders: ['text/html'],
  disableDotRule: true,
  // 当前首页是ssr页面
  index: '/',
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
  // 生产环境下直接读取构造渲染器
  const bundle = require('./dist/home/vue-ssr-server-bundle.json');
  const template = fs.readFileSync(resolve('./dist/home/index.html'), 'utf-8');
  renderer = createRenderer(bundle, template);
  app.use(serve('./dist'));
} else {
  // readyPromise = require('./build/setup-dev-server')(app, homeSSRTemplatePath, (bundle, options) => {
  //   renderer = createRenderer(bundle, options)
  // })
  readyPromise = require('./build/setup-dev-server.js')(app, (bundle, template) => {
    try {
      renderer = createRenderer(bundle, template);  
    } catch (error) {
      console.log('error===', error);
    }
  });
}

// // ssr页面集，对每一个路由页都需要配置
// app.get('/', ssrRender)
// app.get('/home-list', ssrRender)
// app.get('/', isProd ? render : (req, res) => {
//   readyPromise.then(() => render(req, res))
// })
// app.get('/home-list', isProd ? render : (req, res) => {
//   readyPromise.then(() => render(req, res))
// })
app.use(['/', '/home-list'], isProd ? render : (req, res) => {
  readyPromise.then(() => render(req, res))
})

app.listen(9999, function () {
  console.log('Example app listening on port 9999!\n');
});
