// import Vue from 'vue'
// import VueRouter from 'vue-router'

// Vue.use(VueRouter)

// export default new VueRouter({
//   base: '/list/',
//   mode: 'history',
//   routes: [
//     {
//       name: 'a',
//       path: '/',
//       component: () => import('./views/a.vue')
//     }
//     , {
//       name: 'b',
//       path: '/b',
//       component: () => import('./views/b.vue')
//     }
//   ]
// })

import { createRouter as CreateRouter, createWebHistory } from 'vue-router'

export default new CreateRouter({
  history: createWebHistory('/list/'),
  routes: [
    {
      name: 'a',
      path: '/',
      component: () => import('./views/a.vue')
    }
    , {
      name: 'b',
      path: '/b',
      component: () => import('./views/b.vue')
    }
  ]
})
