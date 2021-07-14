<template>
  <transition name="confirm-fade" @after-leave="afterLeave">
    <div class="confirm-container" v-show="visible" @click="clickShadow">
      <div class="confirm-box">
        <div class="title">{{ title }}</div>
        <div v-if="!isHTML" class="content">{{ content }}</div>
        <div v-else class="content" v-html="content"></div>
        <div class="btns" :class="{ 'show-cancel': showCancel }">
          <div class="btn cancel" @click="handleCancel" v-if="showCancel">{{cancelBtnName || '取消'}}</div>
          <div class="btn ok" @click="handleOk">{{sureBtnName || '好的'}}</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    showCancel: {
      type: Boolean,
      default: false
    }, title: {
      type: String,
      default: ''
    }, content: {
      type: String,
      default: ''
    }, sureBtnName: {
      type: String,
      default: ''
    }, cancelBtnName: {
      type: String,
      default: ''
    }, isHTML: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: false,
      status: -1
    }
  },
  methods: {
    afterLeave () {
      document.body.removeChild(this.$el.parentElement)
      this.$unmounted
    },
    show () {
      this.visible = true
    },
    hidden () {
      this.visible = false
    },
    handleCancel () {
      this.hidden()
      this.status = false
    },
    handleOk () {
      this.hidden()
      this.status = true
    },
    clickShadow () {
      if (this.showCancel) {
        this.handleCancel()
        return
      }
      this.handleOk()
    }
  }
}
</script>

<style lang="scss" scoped>
// touch 的 px 转换为 vw
@function px2vw($px) {
    @return $px / 375px * 100vw;
}

.confirm-container {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99999;

  .confirm-box {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: px2vw(300px);
    box-sizing: border-box;
    padding: px2vw(24px) px2vw(16px) px2vw(16px) px2vw(16px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
    border-radius: px2vw(4px);
    font-family: PingFangSC-Regular, PingFang SC;

    .title {
      color: #212831;
      font-size: px2vw(16px);
      line-height: px2vw(24px);
      display: inline-block;
      text-align: left;
    }

    .content{
      line-height: px2vw(20px);
      margin-top: px2vw(12px);
      font-size: px2vw(13px);
      display: inline-block;
      text-align: left;
      font-weight:400;
      color:rgba(102,102,102,1);
    }

    .btns {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: px2vw(26px);

      &.show-cancel .btn {
        width: px2vw(126px);
      }
      .btn {
        width: px2vw(160px);
        height: px2vw(28px);
        text-align: center;
        line-height: px2vw(28px);
        font-size: px2vw(14px);
        color: #ffffff;
        cursor: pointer;
        border-radius: px2vw(14px);
      }
      .btn + .btn {
        margin-left: px2vw(16px);
      }
      .btn.ok {
        background-color: #EB002A;
        &:hover {
          // background-color: rgb(197, 63, 50);
        }
      }
      .btn.cancel {
        background-color: rgba(135, 142, 154, 0.1);
        color: #212831;
        &:hover {
          // background-color: rgb(228, 228, 230);
        }
      }
    }
  }
}
.confirm-fade-enter-active, .confirm-fade-leave-active {
  transition: opacity .3s;
}

.confirm-fade-enter, .confirm-fade-leave-to {
  opacity: 0;
}

</style>
