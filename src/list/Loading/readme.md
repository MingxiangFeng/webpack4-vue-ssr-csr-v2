# 网校UI规范-模态登录组件

## 参数

- el: false, // 指定的父容器，默认是挂载在body节点, 父元素需要添加 postion: absolute / fixed
- lockScroll: true, // 是否锁定不能滚动页面，默认锁屏
- customTop: '50%', // 距离容器顶部的高度
- dangerouslyUseHTMLString: false, // 是否使用v-html注入提示内容
- showTips: true, // 是否显示提示
- tips: '加载中', // 提示内容
- modal: true, // 是否显示蒙层
- modalBG: 'rgba(255, 255, 255, 0)', // 蒙层颜色, 默认全透明
- onClose: null, // 关闭时的回调函数
- noBorder: false, // 无外框
- zIndex: 1000, // 层级（蒙层的层级永远是该层级-1）
- dotIsFixed: false,  // 提示内容后的尾巴是否固定
- dot: '', // 提示内容后的尾巴

## 用法示例

```
import Loading from 'path/Loading'

// 注意：1、loading加载后不会主动关闭；2、如果没有关闭上一个loading就下一个loading, 则会关闭主动销毁上一个loading

// 默认
Loading('加载中')

// 不显示蒙层, 意味着loading时还能点击页面上的元素
Loading({tips: '不显示蒙层', modal: false})

// 固定加载提示后的尾巴，默认为小数点
Loading({tips: '不显示蒙层', dotIsFixed: true, dot: '...'})

// 关闭loading
const loadingVM = Loading('提示')
loadingVM && loadingVM.close()
```
