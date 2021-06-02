<template>
  <div id="app">
    user's login status： {{login}}
    <div class="theme">{{a}}</div>
    <router-view />
  </div>
</template>

<script>
import a from '@static/1.js'
import { mapState } from 'vuex'
// import './scss/index.scss'

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

<style lang="scss">
*{
  padding:0;
  margin: 0;
}
#app{
  font-size: 30px;
  color: blue;
}
</style>