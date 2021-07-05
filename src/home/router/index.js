import Home from '../views/home.vue'

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
        // 因为vue3构建配置缘故，不能使用延迟加载方案，否则样式会后加载
        // 开发环境下，样式目前后加载，此问题后续跟进解决。
        component: Home
        // component: () => import('../views/home.vue')
      }, {
        name: 'home-list',
        path: '/home-list',
        component: () => import('../views/list.vue')
      }
    ]
  })
}
