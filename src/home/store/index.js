import { createStore } from 'vuex'

export function createStoreFn () {
  return new createStore({
    state: {
      userInfo: null,
      login: false
    },
    mutations: {},
    actions: {},
  })
}
