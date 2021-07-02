import { createRouter, createWebHashHistory, createWebHistory } from "vue-router"

export default new createRouter({
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