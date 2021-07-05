<template>
  <div class="home">
    <h1>page: home1</h1>
    {{tips}}
    <div @click="clickMe">click me4</div>
    <div @click="toListPage">to List Page</div>
    mock.content===={{mock.content}}
  </div>
</template>

<script>
export default {
  serverPrefetch() {
    return this.$store.dispatch('mockDataFn')
  },
  data() {
    return {
      tips: ''
    }
  },
  computed: {
    mock() {
      return this.$store.state.mock
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