<template>
  <div class="home">
    <h1 class="title111">page: home</h1>
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

<style lang="css" scoped>
.home{
  color: red;
}
.title111{
  font-size: 22px;
  color: gray;
}
</style>