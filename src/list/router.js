import { createRouter as CreateRouter, createWebHistory as CreateWebHistory } from 'vue-router'

export default new CreateRouter({
  history: CreateWebHistory('/list/'),
  routes: [
    {
      name: 'a',
      path: '/',
      component: () => import('./views/a.vue')
    }, {
      name: 'b',
      path: '/b',
      component: () => import('./views/b.vue')
    }
  ]
})
