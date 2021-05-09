// miniprogram/pages/mine/identification/identification.js
import utils from '../../../config/utils'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    entity: {
      trueName: null,
      id: null,
      idPhotoFront: null,
      idPhotoBack: null

    }
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
          entity: {
            idPhotoBack:that.data.entity.idPhotoBack,
            idPhotoFront: res.tempFilePaths[0],
          }
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
          entity: {
            idPhotoBack: res.tempFilePaths[0],
            idPhotoFront:that.data.entity.idPhotoFront,
          }
        })
      }
    });
  },
  tapNext(){
    wx.navigateTo({
      url: '../shop/shop',
    })
  }
})