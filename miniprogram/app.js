//app.js
import http from './config/http'
import utils from './config/utils'
import dbbase from './config/dbbase'
import webstock from './plugins/webstock'

var that;


App({
  /**
   * 全局js
   */
  utils: utils,
  dbbase: dbbase,
  http: http,
  change: utils.change,
  isEmpty: utils.isEmpty,
  dateformat: utils.dateformat,
  webstock: webstock,
  /**
   * 程序全局变量
   */
  globalData: {
    orderPage: undefined,
    newOrderBeep: null,
    showLoad: true
  },
  async onLaunch() {
    that = this;
    //判断是否支持云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      return
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'cloud1-3gtxx3hfcd0cc5a0',
        traceUser: true,
      })
    };
    this.globalData.showLoad = true
    that.initData()

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
        this.globalData.openid = value;
        utils.cl('[缓存]获取openid成功：', value)
      } else {
        utils.ce('[缓存]获取openid为空，跳转到登录页面')
        //登录
        await this.onGetOpenid()
      }
    } catch (e) {
      utils.ce('[缓存]获取openid失败', e)
    }

    let re = await this.getShopInfo();
    this.utils.cl(re);
    if (re == 1) {
      //已经开通店铺
      //that.onGetOpenid();
      //启动数据库监听
      this.monitor();
    }

  },
 async  monitor() {

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
             
            }
          })
        }
      }
    })
    await this.onGetOpenid()


    const db = wx.cloud.database()
    const watcher = db.collection('order')
      // 按 progress 降序
      .orderBy('addOrderDate', 'desc')
      // 取按 orderBy 排序之后的前 1 个
      .limit(1)
      .where({
        shopId: that.globalData.shopInfo._id
      })
      .watch({
        onChange: function (snapshot) {
          utils.cl(snapshot);

          utils.cl(snapshot.docs)
          utils.cl('改变的事件：', snapshot.docChanges)
          utils.cl('查询到的数据：', snapshot.docs)
          utils.cl('是否是初始化数据：', snapshot.type === 'init')
          if (!snapshot.type) {
            if (snapshot.docs.length > 0) {
              if (snapshot.docChanges[0].dataType === "add") {
                if (!that.utils.isEmpty(that.globalData.orderPage)) {
                  that.globalData.orderPage.refreshOrder();
                }
                const backgroundAudioManager = wx.getBackgroundAudioManager()
                backgroundAudioManager.title = '新订单提醒~'
                // backgroundAudioManager.epname = '此时此刻'
                // backgroundAudioManager.singer = '许巍'
                backgroundAudioManager.coverImgUrl = 'https://cloud.xiaoxingbobo.top/nongzhibang/20210429/1107491622257669573'
                // 设置了 src 之后会自动播放
                backgroundAudioManager.src = that.globalData.newOrderBeep
                // 'https://cloud.xiaoxingbobo.top/nongzhibang/20210429/2113351622294015379'
                wx.hideLoading({
                  success: (res) => {},
                })
                wx.showModal({
                  content: '您有新订单啦~',
                  showCancel: false,
                  confirmText: '好的',
                  success() {

                  },
                  fail() {

                  }
                })
              } else if (snapshot.docChanges[0].dataType === "update") {
                if (snapshot.docs[0].orderState == -1) {
                  const backgroundAudioManager = wx.getBackgroundAudioManager()
                  backgroundAudioManager.title = '您的订单已取消~'
                  // backgroundAudioManager.epname = '此时此刻'
                  // backgroundAudioManager.singer = '许巍'
                  backgroundAudioManager.coverImgUrl = 'https://cloud.xiaoxingbobo.top/nongzhibang/20210429/1107491622257669573'
                  // 设置了 src 之后会自动播放
                  backgroundAudioManager.src = that.globalData.appConfig.cancelOrderBeep
                  // 'https://cloud.xiaoxingbobo.top/nongzhibang/20210429/2113351622294015379'
                  wx.hideLoading({
                    success: (res) => {},
                  })
                  wx.showModal({
                    content: '您的订单已取消~',
                    showCancel: false,
                    confirmText: '知道了',
                    success() {

                    },
                    fail() {

                    }
                  })
                }
              }

            }
          }
        },
        onError: function (err) {
          console.error('数据库监听发生错误：', err)
          utils.ce('重试启动监听');
          watcher.close()
         //that.monitor()
        }
      })
  },
  //查询用户是否开通店铺
  getShopInfo() {
    let where = {
      _openid: this.globalData.openid,
    }
    return new Promise(success => {
      this.dbbase.queryWhere('shop', where).then(res => {
        this.utils.cl('查询到的shop信息：', res);
        if (res.data.length > 0) {
          this.utils.cl('开通的');
          this.utils.cl(res.data[0].isShop);

          that.globalData.isShop = res.data[0].isShop
          that.globalData.shopInfo = res.data[0]
          success(res.data[0].isShop)
        } else {
          that.globalData.isShop = -1
          that.globalData.shopInfo = null
          success(-1);
        }

      })
    })
  },

  /**
   * 获取openid
   */
  async onGetOpenid() {
    let that = this
    wx.showLoading({
      title: '信息获取中...',
    })
    // 调用云函数
    return new Promise(success => {

      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: async res => {
          //注册
          await this.register(res.result.openid)
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
          success()

        },
        fail: err => {
          utils.ce('[云函数] [login] 调用失败', err)
          wx.navigateTo({
            url: '../deployFunctions/deployFunctions',
          })
        }
      })
    })

  },
  show() {
    this.utils.cl('调取成功')
  },
  /**
   * 注册用户
   */
  register(value) {
    let that = this
    that.utils.cl('注册');

    this.dbbase.queryOpenId('user', value).then(res => {
      that.utils.cl(res, '查询用户');

      if (res.data.length != 0) {
        //已经注册
      } else {
        let payload = {
          isShop: false
        }
        wx.showLoading({
          title: '注册中...',
        })
        //注册
        that.dbbase.add('user', payload).then(res => {
          that.utils.cl(res)
          wx.hideLoading({
            success: (res) => {
              wx.showToast({
                title: '注册成功',
                icon: 'none'
              })
            },
          })
        })
      }
    })
  },
  getAppConfig() {
    //查询小程序提示音
    const db = wx.cloud.database()
    return new Promise((success, error) => {
      db.collection('app').get({
        success: res => {
          return success(res)
        },
        fail: err => {
          console.error('[数据库] [查询记录] 失败：', err)
          error(err)
        }
      })
    })
  },
  async initData() {
    that.getAppConfig().then(res => {
      that.globalData.newOrderBeep = res.data[0].newOrderBeep
      that.globalData.appConfig=res.data[0]
      that.utils.cl('小程序配置', res);
      that.utils.cl(res.data[0].newOrderBeep);
    })
  }
})