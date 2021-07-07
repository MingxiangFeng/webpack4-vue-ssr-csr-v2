import { createApp } from 'vue'
import App from './main.vue'

let $inst
const loading_queue = []

// 挂载组件实例
const createMount = (opts) => {
  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  let props = {
    id: opts.id || 'Loading'
  }
  if (typeof opts === 'string') {
    props.tips = opts
  } else {
    props = Object.assign(props, opts)
  }
  const app = createApp(App, {
    ...props,
    modelValue: true,
    remove() {
      app.unmount(mountNode)
      document.body.removeChild(mountNode)
    }
  })
  return app.mount(mountNode)
}

// 创建组件实例
export default function Loading(options = {}) {
  $inst = createMount(options)
  loading_queue.push($inst)
  if (loading_queue.length > 1) {
    loading_queue[0].close()
    loading_queue.shift()
  }
  return $inst
}

// 全局注册
Loading.install = app => {
  app.component('Loading', App)
  app.provide('Loading', App)
}
