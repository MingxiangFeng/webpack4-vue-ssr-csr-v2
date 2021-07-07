<template>
  <div>
    <h1 class="aa">a</h1>
    <h2>green23</h2>
    <div v-for="i in 100" :key="i">{{i}}</div>
  </div>
</template>

<script>
import './../css/index.css'
import Loading from '../Loading'
export default {
  mounted() {
    this.$bus.on('sendMsg', (res) => {
      console.log('reseive msg:', res)
    })
    console.log('child com')
    const l = Loading({
      tips: '一些提示',
      lockScroll: true
    })
    setTimeout(() =>{
      l.close()
    }, 2000)
  }
}
</script>

<style lang="css" scoped>
.aa{
  font-size: 32px;
  color: red;
}
</style>
