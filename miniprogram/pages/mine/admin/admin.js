// miniprogram/pages/mine/admin/admin.js
const app = getApp()
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.state()
    that.initData()
  },
  initData() {

  },
  state() {
    that=this;
  },
  tapShopManage() {
    wx.navigateTo({
      url: './shopManage/shopManage',
    })
  },
  tapAdminManage() {
    wx.navigateTo({
      url: './adminManage/adminManage',
    })
  }

})