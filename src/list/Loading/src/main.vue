<template>
<div class="xes-motai-loading-container">
  <div
    :style="{'z-index': zIndex, top: customTop, position: el ? 'absolute' : 'fixed'}"
    :class="['xes-motai-loading-box', noBorder ? 'xes-motai-loading-box--no-border' : 'xes-motai-loading-box--border' ]"
  >
    <div class="xes-motai-loading__box">
      <div class="xes-motai-loading__box__mover"></div>
      <div class="xes-motai-loading__box__circle"></div>
      <div class="xes-motai-loading__box__monkey"></div>
    </div>
    <div
      v-if="showTips"
      class="xes-motai-loding_text"
    >
      <span v-if="!dangerouslyUseHTMLString">{{tips}}{{dot}}</span>
      <template v-else v-html="tips">{{dot}}</template>
    </div>
  </div>
  <div
    v-if="modal && el"
    class="xes-motai-modal"
    :style="{'z-index': zIndex-1, backgroundColor: modalBG}"
  ></div>
  <div
    v-if="modal && !el"
    class="xes-motai-screen-modal"
    :style="{'z-index': zIndex-1, backgroundColor: modalBG, height: modalHeight}"
  ></div>
</div>
</template>

<script>
function trim (string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}

function hasClass (el, cls) {
  if (!el || !cls) return false
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.')
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
  }
}

function addClass (el, cls) {
  if (!el) return
  var curClass = el.className
  var classes = (cls || '').split(' ')

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.add(clsName)
    } else if (!hasClass(el, clsName)) {
      curClass += ' ' + clsName
    }
  }
  if (!el.classList) {
    el.className = curClass
  }
};

function removeClass (el, cls) {
  if (!el || !cls) return
  var classes = cls.split(' ')
  var curClass = ' ' + el.className + ' '

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.remove(clsName)
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(' ' + clsName + ' ', ' ')
    }
  }
  if (!el.classList) {
    el.className = trim(curClass)
  }
}

export default {
  name: 'xes-motai-loading',
  props: {
    el: {
      type: Boolean || Object,
      default: false // 指定的父容器，默认是挂载在body节点, 父元素需要添加 postion: absolute / fixed
    },
    lockScroll: {
      type: Boolean,
      default: true // 是否锁定不能滚动页面，默认锁屏
    },
    customTop: {
      type: String,
      default: '50%' // 距离容器顶部的高度
    },
    dangerouslyUseHTMLString: {
      type: Boolean || String,
      default: false, // 是否使用v-html注入提示内容
    },
    showTips: {
      type: Boolean,
      default: true // 是否显示提示
    },
    tips: {
      type: String, 
      default: '加载中' // 提示内容
    },
    modal: {
      type: Boolean,
      default: true // 是否显示蒙层
    },
    modalBG: {
      type: String,
      default: 'rgba(255, 255, 255, 0)', // 蒙层颜色, 默认全透明
    },
    onClose:{ // 关闭时的回调函数
      type: Boolean || Function,
      default: false
    },
    noBorder: {
      type: Boolean,
      default: false // 无外框
    },
    zIndex: {
      type: Number,
      default: 1000, // 层级，蒙层的层级永远是该层级-1
    },
    dotIsFixed: {
      type: Boolean,
      default: false,  // 提示内容后的尾巴是否固定
    },
    dot: {
      type: String,
      default: ''
    },

  },
  data () {
    return {
      // 内置逻辑参数 【不可传】
      dotString: '',
      _lockScroll: this.lockScroll,
      scrollTop: null,
      setTop: false,
      dotTimer: null,
      modalHeight: '0px' // 蒙层的高度
    }
  },
  created () {
    if (this._lockScroll) {
      this.scrollTop = document.scrollingElement.scrollTop
      addClass(document.body, 'xes-motai-popup')
      if (!document.body.style.top) {
        this.setTop = true
        document.body.style.top = -this.scrollTop + 'px'
      }
    }

    if (this.dotIsFixed) {
      this.dotString = this.dotString
    } else {
      this.dotTimer = setInterval(() => {
        if (this.dot.length >= 3) {
          this.dotString = ''
        } else {
          this.dotString += '.'
        }
      }, 500)
    }

    this.modalHeight = Math.ceil(window.innerHeight) + 'px'
    window.addEventListener('resize', () => {
      this.modalHeight = Math.ceil(window.innerHeight) + 'px'
    })
  },
  beforeUnmount () {
    this.dotTimer = null
  },
  methods: {
    close () {
      this.$unmounted

      window.__XES__LOADING = false

      this.$el.parentNode.removeChild(this.$el)

      if (typeof this.onClose === 'function') {
        this.onClose(this)
      }

      if (this._lockScroll) {
        removeClass(document.body, 'xes-motai-popup')
        if (this.setTop) {
          document.body.style.top = null
          document.scrollingElement.scrollTop = this.scrollTop
        }
        this._lockScroll = false
      }
    }
  }

}
</script>

<style>
.xes-motai-popup{
  position: fixed;
  left: 0;
  width: 100%;
}
</style>
<style lang="scss" scoped>
@function px2vw($px) {
  @return $px / 750px * 100vw;
}

.xes-motai-loading-container{
  width: 100%;
  height: 100%;
}

@keyframes turnAround {
  from {transform:rotate(0deg);}
  to {transform:rotate(359deg);}
}

.xes-motai-loading-box {
  min-width: px2vw(180px);
  max-width: px2vw(300px);
  min-height: px2vw(170px);
  padding: 0 px2vw(25px);
  left: 50%;
  transform: translate(-50%, -50%);
  &--border{
    box-shadow: 0 px2vw(8px) px2vw(20px) 0 rgba(0, 0, 0, 0.15);
    border-radius: px2vw(8px);
    background-color: #FFFFFF;
  }
  &--no-border{
    box-shadow: none;
    border-radius: none;
    background-color: transparent;
  }
}

.xes-motai-loading__box {
  position: absolute;
  transform: translateX(-50%);
  top: px2vw(30px);
  left: 50%;
  width: px2vw(99px);
  height: px2vw(100px);
  &__circle {
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    box-sizing: border-box;
    width: px2vw(99px);
    height: px2vw(100px);
    border: px2vw(4px) solid #FFEEED;
    border-radius: 50%;
    z-index: 1;
  }
  &__mover{
    position: absolute;
    width: px2vw(99px);
    height: px2vw(100px);
    background-image: url('./mover.png');
    background-size: px2vw(99px) px2vw(100px);
    background-repeat: no-repeat;
    background-position: center;
    animation: turnAround 1s linear 0s infinite;
    z-index: 3;
  }
  &__monkey{
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    width: px2vw(70px);
    height: px2vw(48px);
    background-image: url('./monkey.png');
    background-size: px2vw(70px) px2vw(48px);
    background-position: center;
    z-index: 2;
  }
}

.xes-motai-loding_text{
  width: max-content;
  max-width: px2vw(300px);
  position: relative;
  padding-top: px2vw(150px);
  padding-bottom: px2vw(30px);
  left: 50%;
  transform: translateX(-50%);
  font-size: px2vw(24px);
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #212831;
  line-height: px2vw(26px);
  text-align: center;
}

.xes-motai-modal{
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.3);
}

.xes-motai-screen-modal{
  position: fixed;
  width: 100vw;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
