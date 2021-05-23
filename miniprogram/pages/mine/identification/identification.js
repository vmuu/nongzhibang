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
      id: null,
      idPhotoFront: null,
      idPhotoBack: null,
      businessLicense: null,
      isShop:false
    }
  },
  change(e) {
    app.change(e, this)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  tapCancel() {
    wx.navigateBack()
  },
  tapFront() {
    let that = this
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        that.setData({

          ['entity.idPhotoFront']: res.tempFilePaths[0],
        })
      }
    });
  },
  tapBack() {
    let that = this
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        that.setData({

          ['entity.idPhotoBack']: res.tempFilePaths[0],
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
    app.dbbase.add('user',this.data.entity).then(res=>{
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
    let that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        app.utils.cl(res)
        that.setData({
          ['entity.businessLicense']: res.tempFilePaths[0]
        })
      }
    })
  },

})