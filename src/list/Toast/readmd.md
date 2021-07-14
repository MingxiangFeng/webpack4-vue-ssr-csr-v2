# 使用文档
## toast提示组件
### 参数
msg 提示内容 [string] 默认： ’‘
delay 停留时长 [numer] 默认： 2000（单位：ms）
zIndex 层级 [nummber] 默认：9999
cancelHide 是否取消隐藏 [boolean] 默认：false
icon 图标 [string] 可选参数 成功：’success', 失败：'fail'， 空：’‘ 默认：''

### 用法示例
```javascript
import Toast form 'path/Toast'

methods: {
  showToast() {
    // 直接将字符串作为参数，则该参数被选为msg
    Toast('提示')
    // 传入对象
    Toast({msg: '提示', delay: 3000})
    // 手动控制隐藏
    const toast = Toast({msg: '一些消息', cancelHdie: true})
    toast.close() // 关闭Toast
  }
}
```

### 关于icon

- success图标 cdn链接： https://activity.xueersi.com/oss/error-ea01a.png
- error图标 cdn链接： https://activity.xueersi.com/oss/success-8fcd7.png