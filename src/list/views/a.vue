<template>
  <div>
    <h1 class="aa">a</h1>
    <h2>green23</h2>
    <div v-for="i in 100" :key="i">{{i}}</div>
  </div>
</template>

<script>
import './../css/index.css'
import { app } from '../index'
// import Loading from '../Loading'
// import Dialog from '../Dialog'
import Toast from '../Toast'
export default {
  async mounted() {
    this.$bus.on('sendMsg', (res) => {
      console.log('reseive msg:', res)
    })
    // const l = Loading({
    //   tips: '一些提示',
    //   lockScroll: true
    // })
    // setTimeout(() =>{
    //   l.close()
    // }, 2000)
    // const dialogRes = await new Dialog({
    //   title: 'title',
    //   content: 'content',
    //   showCancel: true,
    // })
    // console.log('dialogRes==', dialogRes)
    Toast('message')
    // const app = createApp()
    app.config.globalProperties.$aaa = '12333'
    console.log('this.====', this.$aaa)
    console.log('this.$isApp===', this.$isApp)
  }
}
</script>

<style lang="css" scoped>
.aa{
  font-size: 32px;
  color: red;
}
</style>
