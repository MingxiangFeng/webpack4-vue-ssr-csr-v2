<template>
  <transition name="fade" @after-leave="distroyFn">
    <div :style="{'z-index': zIndex}" :class="['alert__component', icon ? 'alert__component--icon' : '' ]" v-show="visible">
      <div class="alert__component_box">
        <div v-if="icon" :class="['alert__icon', `alert__icon--${icon}`]"></div>
        <div class="alert__msg">{{ msg }}</div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
// 可传参数
    msg: {
      type: String,
      default: ''
    },
    cancelHide: {
      type: Boolean,
      default: false
    },
    delay: {
      type: Number,
      default: 2000
    },
    icon: {
      type: String,
      default: ''
    },
    zIndex: {
      type: Number,
      default: 9999
    }
  },
  data() {
    return {
      visible: false  
    }
  },
  methods: {
    open() {
      this.visible = true
    },
    close() {
      this.visible = false
      document.body.removeChild(this.$el.parentElement)
      this.$unmounted
    }
  }
}
</script>

<style lang="scss" scoped>
@function px2vw($px){
  @return $px / 750px * 100vw;
}

.alert__component {
  min-width: px2vw(250px);
  max-width: px2vw(600px);
  padding: px2vw(32px);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: px2vw(8px);
  background-color: rgba(0,0,0,0.8);
  &--icon{
    min-width: px2vw(480px);
    max-width: px2vw(600px);
  }
  &_box{
    width: max-content;
  }
}

.alert__component .alert__icon {
  margin: 0 auto;
  margin-bottom: 20px;
  width: px2vw(88px);
  height: px2vw(88px);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  &--success{
    background-image: url('./success.png');
  }
  &--fail{
    background-image: url('./error.png');
  }
}

.alert__component .alert__msg {
  box-sizing: border-box;
  font-size: px2vw(32px);
  text-align: center;
  color: #ffffff;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
