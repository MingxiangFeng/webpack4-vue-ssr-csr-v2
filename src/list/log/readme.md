
# 引入及初始化
```javascript
import initLog from '@util/log/index.js'

const logParams = {} // 公共参数
initLog(Vue, logParams); // 初始化埋点配置
```
## pageLoad 展示日志
- post方式：
```javascript
this.$xesLogger.cacheUploader({params: {
  key: 'xxx'
}}, 'a', 'pv');
```
- get方式：（建议，但是字段不能过多）
```javascript
window.__XES_LOG__.loadMsg({
  key: 'xes-mall-sidebar-show'
})
```
或者
```javascript
this.$xesLogger.loadMsg({
  key: 'xes-mall-sidebar-show'
})
```




## click 交互日志（需求中的'show'类型也使用交互日志的方式去打）
post方式：
```javascript
this.$xesLogger.cacheUploader({params: {
  key: 'xxx',
  clickid: 'xxx'
}}, 'b', 'pv');
```
get方式：（建议，但是字段不能过多）
```javascript
window.__XES_LOG__.clickMsg({ params: { 
  key: 'xes-mall-home', 
  clickid: '3.0' 
}})
```
或者
```javascript
this.$xesLogger.clickMsg({ params: { 
  key: 'xes-mall-home', 
  clickid: '3.0' 
}})
```
