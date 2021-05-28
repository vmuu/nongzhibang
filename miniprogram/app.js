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

  },
  async onShow() {
    let re = await this.getShopInfo();
    this.utils.cl(re);
    if (re) {
      //启动数据库监听
      // this.monitor();
    }
  },
  monitor() {
    const db = wx.cloud.database()
    const watcher = db.collection('order')
      // 按 progress 降序
      .orderBy('addOrderDate', 'desc')
      // 取按 orderBy 排序之后的前 1 个
      .limit(1)
      // .where({
      //   _openid:app.globalData.openid
      // })
      .watch({
        onChange: function (snapshot) {
          utils.cl(snapshot.docs)
          utils.cl('改变的事件：', snapshot.docChanges)
          utils.cl('查询到的数据：', snapshot.docs)
          utils.cl('是否是初始化数据：', snapshot.type === 'init')
        },
        onError: function (err) {
          console.error('数据库监听发生错误：', err)
        }
      })
  },
  //查询用户是否开通店铺
  getShopInfo() {
    let where = {
      _openid: this.globalData.openid,
      isShop: 1
    }
    return new Promise(success => {
      this.dbbase.queryWhere('shop', where).then(res => {
        this.utils.cl('查询到的shop信息：', res);
        if (res.data.length > 0) {
          this.utils.cl('asdf');
          success(true)
        } else {
          success(false)
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

      },
      fail: err => {
        utils.ce('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
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
})