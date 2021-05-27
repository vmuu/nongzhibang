// miniprogram/pages/good/good.js
import db from '../../config/dbbase.js';
import utils from '../../config/utils.js';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      {name: 'USA', value: '线上支付'},
      {name: 'CHN', value: '线下支付', checked: 'true'},
    
    ],
    product:[],
    productType:[],
    shop:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      app.utils.hint('暂不支持该功能！')
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      //要跳转的商品
      db.query("product",options.id).then((res)=>{
        app.utils.cl(res);
        this.setData({
          product:res.data[0]
        })
        //要跳转的商品的分类
        db.query("productType",res.data[0].commodityTypeId).then((res)=>{
          this.setData({
            productType:res.data[0]
          })
        })
        //要跳转的商品的店铺
        db.query("shop",res.data[0].shopId).then((res)=>{
          this.setData({
            shop:res.data[0]
          })
        })
      })
      wx.hideLoading({
        success: (res) => {},
      })
  },
  AddressNavigateTo(e){
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../mine/address/address'
    })
  },
  OrderNavigateTo(e){
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../orderDetail/orderDetail?id='+e.currentTarget.dataset.id,
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})