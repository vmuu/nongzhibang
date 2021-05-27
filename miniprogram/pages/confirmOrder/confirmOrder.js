// miniprogram/pages/good/good.js
import db from '../../config/dbbase.js';
import utils from '../../config/utils.js';
const app = getApp()
var that;
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
    shop:[],
    payType:'offline'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
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
    if(that.data.payType=='weixin'){
      app.utils.hint('该功能暂不支持');
      return
    }
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../orderDetail/orderDetail?id='+e.currentTarget.dataset.id,
    })
  },
  tapSelectPay(e){
    app.utils.cl(e);
    let type= e.currentTarget.dataset.type
    that.setData({
      payType:type
    })
  }
})