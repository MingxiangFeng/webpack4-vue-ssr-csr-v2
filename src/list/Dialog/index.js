import { createApp } from 'vue'
import App from './confirm.vue'

let $inst

const $confirm = function(options = {}) {
  return new Promise(resolve => {
    const mountNode = document.createElement('div')
    document.body.appendChild(mountNode)

    const app = createApp(App, options)

    $inst = app.mount(mountNode)

    $inst.show()

    $inst.$watch('status', (res) => {
      resolve(res)
    })
  })
}

$confirm.close = function() {
  if ($inst) {
    $inst.handleOk()
  }
}

export default $confirm
