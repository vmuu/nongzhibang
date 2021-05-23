
import db from '../../../config/dbbase.js';
import utils from '../../../config/utils.js';
const app = getApp();
// miniprogram/pages/index/merchants.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Shop:[],
    loadMoreText:"加载中.....",
    showLoadMore:false,
    max:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.queryShop(this.data.max,8).then((res)=>{
      this.setData({
        Shop:res.data,
        max:8
      })
    })
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
		setTimeout(() => {
			this.setListData();
		}, 300);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  setListData() {
    app.utils.cl(this.data.max);
    
    db.queryShop(this.data.max,8).then((res)=>{
      this.setData({
        Shop:this.data.Shop.concat(res.data)
      })
      app.utils.cl(this.data.Shop);
      
    })
  }
})