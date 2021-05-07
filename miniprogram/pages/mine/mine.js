//index.js
import utils from '../../config/utils'

const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    hasUserInfo: false,
    logged: false,
    takeSession: false,
    requestResult: '',
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl'), // 如需尝试获取用户信息可改为false
    gridCol: 3,
    gridBorder: false,
    iconList: [{
      id: 0,
      icon: 'locationfill',
      color: 'red',
      badge: 0,
      name: '收货地址'
    }, {
      id: 1,
      icon: 'favorfill',
      color: 'orange',
      badge: 0,
      name: '我的收藏'
    }, {
      id: 2,
      icon: 'noticefill',
      color: 'olive',
      badge: 20,
      name: '消息'
    }],
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'http://cdn.xiaoxingbobo.top/nongzhibang/202144/235421620143642072'
    }, {
      id: 1,
      type: 'image',
      url: 'http://cdn.xiaoxingbobo.top/nongzhibang/202145/1126161620185176238',
    }, {
      id: 2,
      type: 'image',
      url: 'http://cdn.xiaoxingbobo.top/nongzhibang/202145/1126421620185202773'
    }, {
      id: 3,
      type: 'image',
      url: 'http://cdn.xiaoxingbobo.top/nongzhibang/202145/127171620187637650'
    }, {
      id: 4,
      type: 'image',
      url: 'http://cdn.xiaoxingbobo.top/nongzhibang/202145/123681620189368172'
    }],
  },

  onLoad: function () {
    //判断是否支持云函数
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    //判断是否有权使用用户信息
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
      })
    }
  },
  /**
   * 获取用户信息
   */
  getUserProfile() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          avatarUrl: res.userInfo.avatarUrl,
          userInfo: res.userInfo,
          hasUserInfo: true,
        })
      }
    })
  },

  onGetUserInfo: function (e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
      })
    }
  },
  
  tapSetting() {
    wx.navigateTo({
      url: '/pages/mine/setting/setting',
    })
  },
  tapBtnMenu(value) {
    utils.cl(value)
    let type = value.currentTarget.dataset.item.id;
    if (type == 0) {
      wx.navigateTo({
        url: './address/address',
      })
    } else if (type == 1) {

    } else {

    }
  }

})