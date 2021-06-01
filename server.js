const fs = require('fs')
const path = require('path')
const LRU = require('lru-cache')
const express = require('express')
// const favicon = require('serve-favicon')
const compression = require('compression')
const microcache = require('route-cache')
const resolve = file => path.resolve(__dirname, file)
const { createBundleRenderer } = require('vue-server-renderer')
const history = require('connect-history-api-fallback')

const isProd = process.env.NODE_ENV === 'production'
const useMicroCache = process.env.MICRO_CACHE !== 'false'
const serverInfo =
  `express/${require('express/package.json').version} ` +
  `vue-server-r enderer/${require('vue-server-renderer/package.json').version}`

const app = express()

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
})

function createRenderer(bundle, template) {
  return createBundleRenderer(bundle, {
    template,
    cache: require('lru-cache')({
        max: 1000,
        maxAge: 1000 * 60 * 15,
    }),
    basedir: resolve('./dist'),
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
    url: req.url
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
  readyPromise = require('./build/setup-dev-server.js')(app, (bundle, template) => {
    try {
      renderer = createRenderer(bundle, template);  
    } catch (error) {
      console.log('error===', error);
    }
  });
}

app.use(compression({ threshold: 0 }))
app.use(microcache.cacheSeconds(1, req => useMicroCache && req.originalUrl))

// app.get('*', isProd ? render : (req, res) => {
//   readyPromise.then(() => render(req, res))
// })
app.use(['/', '/home-list'], isProd ? render : (req, res) => {
  readyPromise.then(() => render(req, res))
})

const port = process.env.PORT || 9998
app.listen(port, () => {
  console.log(`server started at localhost:${port}`)
})
