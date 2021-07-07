<template>
  <div>
    <p class="list">list</p>
    <router-view />
  </div>
</template>

<script>
// import Bus from './bus'
export default {
  created() {
    console.log('11111');
    console.log('=====', this.$isApp);
    this.$xesLogger.loadMsg({
      key: 'xes-mall-sidebar-show'
    })
    setTimeout(() => {
      this.$bus.emit('sendMsg', 'something')  
    }, 1000);
    console.log('parent com');
  }
}
</script>

<style lang="css" scoped>
*{
  margin: 0;
  padding: 0;
}
.list{
  font-size: 25px;
}
</style>
