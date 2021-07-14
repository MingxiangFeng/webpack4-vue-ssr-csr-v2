import { createApp } from 'vue'
import App from './toast.vue'

let prev = null
let timer = null

export default function $toast(options) {
  options = options || {}
  if (typeof options === 'string') {
    options = {
      msg: options
    }
  }

  if (prev) {
    clearTimeout(timer)
    prev.close()
  }

  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  const app = createApp(App, options)
  const vm = app.mount(mountNode)

  vm.open()
  prev = vm

  if (!options.cancelHide) {
    let delay = 2000
    if (options.delay && +options.delay) {
      delay = +options.delay
    }

    timer = setTimeout(() => {
      vm.close()
      prev = null
      timer = null
    }, delay)
  }

  return vm
}
