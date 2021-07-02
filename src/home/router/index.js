const {
  createRouter,
  createMemoryHistory,
  createWebHistory,
} = require('vue-router');

const isServer = typeof window === 'undefined';

let history = isServer ? createMemoryHistory() : createWebHistory();

export function createRoutFn () {
  return new createRouter({
    history,
    routes: [
      {
        name: 'home',
        path: '/',
        component: () => import('../views/home.vue')
      }, {
        name: 'home-list',
        path: '/home-list',
        component: () => import('../views/list.vue')
      }
    ]
  })
}
