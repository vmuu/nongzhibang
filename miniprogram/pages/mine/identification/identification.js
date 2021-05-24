// miniprogram/pages/mine/identification/identification.js
import utils from '../../../config/utils'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    entity: {
      trueName: null,
      identity: null,
      idPhotoFront: null,
      idPhotoBack: null,
      businessLicense: null,
      isShop: -1
    },
    shopInfo: null
  },
  change(e) {
    app.change(e, this)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初始化数据
    this.initData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //初始化数据
  initData() {
    let that = this
    let openid = app.globalData.openid
    app.dbbase.queryOpenId('shop', openid).then(res => {
      app.utils.cl(res)
      if (res.data.length != 0) {
        that.setData({
          entity: res.data[0],
          ['entity.isShop']:0
        })
      }
    })
  },
  tapCancel() {
    wx.navigateBack()
  },
  tapFront() {
    //从全局获取七牛云授权token
    let token = app.globalData.qiniuToken
    let that = this
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        app.utils.upload(res.tempFilePaths[0], token).then(res => {
          app.utils.cl(res)
          that.setData({
            ['entity.idPhotoFront']: res.fileURL,
          })
        })
      }
    });
  },
  tapBack() {
    //从全局获取七牛云授权token
    let token = app.globalData.qiniuToken
    let that = this
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        app.utils.upload(res.tempFilePaths[0], token).then(res => {
          app.utils.cl(res)
          that.setData({
            ['entity.idPhotoBack']: res.fileURL
          })
        })

      }
    });
  },
  tapNext() {
    //提交数据
    app.utils.cl(this.data.entity)
    wx.showLoading({
      title: '提交中...',
    })
    if(this.data.entity.isShop==0){
      app.utils.hint('执行修改')
      return
    }
    app.dbbase.add('shop', this.data.entity).then(res => {
      wx.hideLoading({
        success: (res) => {
          wx.navigateTo({
            url: '../shop/shop',
          })
        },
      })
    })

  },
  tapBusinessLicense() {
    //从全局获取七牛云授权token
    let token = app.globalData.qiniuToken
    let that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        app.utils.cl(res)
        app.utils.upload(res.tempFilePaths[0], token).then(res => {
          app.utils.cl(res)
          that.setData({
            ['entity.businessLicense']: res.fileURL
          })
        })

      }
    })
  },

})