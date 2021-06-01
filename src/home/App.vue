<template>
  <div id="app">
    user's login status： {{login}}
    {{a}}
    <router-view />
  </div>
</template>

<script>
import a from '@static/1.js'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      a
    }
  },
  computed: {
    ...mapState({
      login: state => state.login
    })
  }
}
</script>

<style lang="css">
#app{
  font-size: 26px;
  color: blue;
}
</style>