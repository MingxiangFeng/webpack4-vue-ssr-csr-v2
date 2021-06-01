<template>
  <div class="home">
    <h1>page: home1</h1>
    {{tips}}
    <div @click="clickMe">click me4</div>
    <div @click="toListPage">to List Page</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tips: ''
    }
  },
  methods: {
    clickMe() {
      this.tips = 'i am home!'
    },
    toListPage() {
      this.$router.push({name: 'home-list'})
    }
  }
}
</script>

<style scoped>
.home{
  color: pink;
}
</style>