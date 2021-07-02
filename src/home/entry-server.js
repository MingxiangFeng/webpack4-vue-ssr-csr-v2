import { createApp } from './app.js'

const isDev = process.env.NODE_ENV !== 'production'

export default context => {
  return new Promise(async (resolve, reject) => {
    const s = isDev && Date.now()
    const { app, router, store } = createApp()

    const { url } = context
    // const { fullPath } = router.resolve(url).route

    // if (fullPath !== url) {
    //   return reject({ url: fullPath })
    // }

    router.push(url)

    await router.isReady();

    isDev && console.log(`data pre-fetch: ${Date.now() - s}ms`)
    context.state = store.state
    resolve(app)

    // const matchedComponents = router.getMatchedComponents()

    // if (!matchedComponents.length) {
    //   return reject({ code: 404 })
    // }

    // Promise.all(matchedComponents.map(({ asyncData }) => asyncData && asyncData({
    //   store,
    //   route: router.currentRoute
    // }))).then(() => {
    //   isDev && console.log(`data pre-fetch: ${Date.now() - s}ms`)
    //   context.state = store.state
    //   resolve(app)
    // }).catch(reject)
  })
}
