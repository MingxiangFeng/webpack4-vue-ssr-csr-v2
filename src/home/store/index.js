import { createStore } from 'vuex'

export function createStoreFn () {
  return new createStore({
    state: {
      userInfo: null,
      login: false,
      mock: null
    },
    mutations: {
      setMockData(state, payload) {
        state.mock = payload
      }
    },
    actions: {
      async mockDataFn({commit}) {
        return new Promise(resolve => {
          const mock = {
            content: 'mock home data!'
          }
          setTimeout(() => {
            resolve(mock)
            commit('setMockData', mock)
          }, 1000)
        })
      }
    },
  })
}
