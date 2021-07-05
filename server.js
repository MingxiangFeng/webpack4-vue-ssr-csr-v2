const path = require('path')
const express = require('express')
const compression = require('compression')
const microcache = require('route-cache')
const resolve = file => path.resolve(__dirname, file)
const { createBundleRenderer } = require('vue-bundle-renderer');
const history = require('connect-history-api-fallback')
const serialize = require('serialize-javascript');

const isProd = process.env.NODE_ENV === 'production'
const useMicroCache = process.env.MICRO_CACHE !== 'false'

const app = express()

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
})

function createRenderer(bundle, clientManifest) {
  return createBundleRenderer(bundle, {
    runInNewContext: false,
    basedir: resolve('./dist'),
    clientManifest,
    vueServerRenderer: require('@vue/server-renderer'), // .renderToString
  });
}

// ssr渲染处理函数
async function render (req, res) {
  const s = Date.now()

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

  const renderState = (context) => {
    const contextKey = 'state';
    const windowKey = '__INITIAL_STATE__';
    const state = serialize(context[contextKey]);
    const autoRemove =
      ';(function(){var s;(s=document.currentScript||document.scripts[document.scripts.length-1]).parentNode.removeChild(s);}());';
    var nonceAttr = context.nonce ? ' nonce="' + context.nonce + '"' : '';
    return context[contextKey]
      ? '<script' +
          nonceAttr +
          '>window.' +
          windowKey +
          '=' +
          state +
          autoRemove +
          '</script>'
      : '';
  };

  const context = { title: 'Vue', url: req.url }

  let page;
  try {
    page = await renderer.renderToString(context); // 新版本@vue/server-renderer，只返回data部分
    if (!isProd) {
      console.log(`whole request: ${Date.now() - s}ms`)
    }
  } catch (err) {
    handleError(err);
  }

  let { renderStyles, renderResourceHints, renderScripts } = context;
  const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${renderResourceHints()}
  ${renderStyles()}
  <title>SSR Vue 3</title>
  </head>
  <body>
    <div id="app">${page}</div>
    ${renderScripts()}
    ${renderState(context)}
    </body>
</html>
`;
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
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
    }, { 
      from: /^\/detail(\/)?.*/,
      to:  '/detail/index.html'
    }, {
      from: /^\/list(\/)?.*/,
      to:  '/list/index.html'
    },
  ],
}))

if (isProd) {
  const bundle = require('./dist/home/vue-ssr-server-bundle.json');
  const clientManifest = require('./dist/home/vue-ssr-client-manifest.json');
  renderer = createRenderer(bundle, clientManifest);
  app.use(serve('./dist'));
} else {
  readyPromise = require('./build/setup-dev-server.js')(app, (bundle, clientManifest) => {
    renderer = createRenderer(bundle, clientManifest);  
  });
}

app.use(compression({ threshold: 0 }))
app.use(microcache.cacheSeconds(1, req => useMicroCache && req.originalUrl))

app.use(['/', '/home-list'], isProd ? render : (req, res) => {
  readyPromise.then(() => render(req, res))
})

const port = process.env.PORT || 9998
app.listen(port, () => {
  console.log(`server started at localhost:${port}`)
})
