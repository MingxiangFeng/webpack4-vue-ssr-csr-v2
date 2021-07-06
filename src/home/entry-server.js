import { createApp } from './app.js'

const isDev = process.env.NODE_ENV !== 'production'

export default context => {
  return new Promise(async(resolve) => {
    const s = isDev && Date.now()
    const { app, router, store } = createApp()

    const { url } = context

    router.push(url)

    await router.isReady()

    isDev && console.log(`data pre-fetch: ${Date.now() - s}ms`)
    context.state = store.state
    resolve(app)
  })
}
