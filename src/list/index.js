import { createApp } from 'vue'
import App from './app.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')

// import Vue from 'vue'

// import App from './app.vue'
// import router from './router'

// new Vue({
//   el: '#app',
//   router,
//   render: h => h(App)
// })

// if (module['hot']) {
//   module['hot'].accept();
// }