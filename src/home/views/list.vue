<template>
  <div id="list">
    <h1>page: list</h1>
    <p class="theme">theme</p>
  </div>
</template>

<script>
// 这样会报错，尚未解决，请放在<style>标签中引入
// import '../scss/index.scss';
export default {

}
</script>

<style lang="scss" scoped>
@import '../scss/index.scss';
#list{
  color: red;
}
</style>
