import { createSSRApp } from 'vue'
import { createStoreFn } from './store'
import { createRoutFn } from './router'
import App from './App.vue'
import { sync } from 'vuex-router-sync'

export function createApp() {
  const store = createStoreFn()
  const router = createRoutFn()

  sync(store, router)

  const app = createSSRApp(App)
  app
    .use(router)
    .use(store)

  return { app, router, store }
}
