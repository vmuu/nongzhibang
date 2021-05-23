
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
    max:0,
    limit:10,
    theOnReachBottom:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.queryShop(this.data.max,this.data.limit).then((res)=>{
      this.setData({
        Shop:res.data,
        max:this.data.limit
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
    if(this.data.theOnReachBottom){
      setTimeout(() => {
        this.setListData();
      }, 300);
    }
    else{
      this.setData({
        loadMoreText:"没有更多店铺了!",
        showLoadMore:true,
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  setListData() {
    db.queryShop(this.data.max,this.data.limit).then((res)=>{
      if(res.data.length==0){
        this.setData({
          loadMoreText:"没有更多店铺了!",
          showLoadMore:true,
          theOnReachBottom:false
        })
        app.utils.hint('没有更多店铺了!');
      }
      else{
        this.setData({
          Shop:this.data.Shop.concat(res.data),
          max:this.data.max+this.data.limit
        })
      }
    })
  }
})