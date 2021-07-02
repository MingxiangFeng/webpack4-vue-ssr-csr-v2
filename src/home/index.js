import { createApp } from './app.js'
// import ProgressBar from './components/ProgressBar.vue'

// const bar = Vue.prototype.$bar = new Vue(ProgressBar).$mount()
// document.body.appendChild(bar.$el)

// // a global mixin that calls `asyncData` when a route component's params change
// Vue.mixin({
//   beforeRouteUpdate (to, from, next) {
//     const { asyncData } = this.$options
//     if (asyncData) {
//       asyncData({
//         store: this.$store,
//         route: to
//       }).then(next).catch(next)
//     } else {
//       next()
//     }
//   }
// })

const { app, router, store } = createApp()

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

(async (r, a) => {
  await r.isReady();
  // r.beforeResolve((to, from, next) => {
  //   const matched = r.getMatchedComponents(to)
  //   const prevMatched = r.getMatchedComponents(from)
  //   let diffed = false
  //   const activated = matched.filter((c, i) => {
  //     return diffed || (diffed = (prevMatched[i] !== c))
  //   })
  //   const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _)
  //   if (!asyncDataHooks.length) {
  //     return next()
  //   }

  //   bar.start()
  //   Promise.all(asyncDataHooks.map(hook => hook({ store, route: to })))
  //     .then(() => {
  //       bar.finish()
  //       next()
  //     })
  //     .catch(next)
  // })
  a.mount('#app', true);
})(router, app);
