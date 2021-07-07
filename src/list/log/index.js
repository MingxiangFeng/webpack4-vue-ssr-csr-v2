import XesLoggerSDK from '@xes/xes_fe_log'

function initLog(app, params) {
  app.use(XesLoggerSDK, {
    cacheUploader: {
      interval: 10,
      batch: 1
    },
    common: {
      eventid: 'malltouch'
    },
    hashchange: {
      open: false,
      pvid: 'hash',
      pageuid: {}
    },
    loadMsg: {
      open: false
    },
    appid: {
      'localhost:9998': {
        appid: '1000022',
        appkey: 'c33a49e00a39a5030345dc69fc1f58d2'
      },
      'iii.xueersi.com': {
        appid: '1000022',
        appkey: 'c33a49e00a39a5030345dc69fc1f58d2'
      },
      'touch.xueersi.com': {
        appid: '1000022',
        appkey: 'c33a49e00a39a5030345dc69fc1f58d2'
      }
    },
    param: params
  })
}

export default initLog
