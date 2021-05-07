//app.js
import http from 'config/http.js'
import utils from './config/utils'

App({
  /**
   * 程序全局变量
   */
  globalData: {

  },
  onLaunch: function () {
    //判断是否支持云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    };

    
    //获取七牛云授权
    http.get('/api/File/Token').then((res) => {
      this.globalData.qiniuToken = res.data.token
    })
    //获取系统信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.sysInfo = e;
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
    //从缓存中获取openid
    try {
      var value = wx.getStorageSync('openid')
      if (value) {
        utils.cl('[缓存]获取openid成功：', value)
      } else {
        utils.ce('[缓存]获取openid为空，跳转到登录页面')
       //登录
       this.onGetOpenid()
      }
    } catch (e) {
      utils.ce('[缓存]获取openid失败', e)
    }
  },
  /**
   * 获取openid
   */
  onGetOpenid: function () {
    wx.showLoading({
      title: '登录中...',
    })
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        utils.cl('[云函数] [login] user openid: ', res.result.openid)
        this.globalData.openid = res.result.openid
        //异步方式缓存openid
        try {
          wx.setStorageSync('openid', res.result.openid)
        } catch (e) {
          utils.ce('缓存失败')
        }
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '登录成功',
              icon: 'none'
            })
          },
        })
      },
      fail: err => {
        utils.ce('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },
})