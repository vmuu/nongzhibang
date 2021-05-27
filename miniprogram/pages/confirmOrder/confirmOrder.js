// miniprogram/pages/good/good.js
import db from '../../config/dbbase.js';
import utils from '../../config/utils.js';
const app = getApp()
var that;
var openid;
Page({

  /**
   * 页面的初始数据
   */
  data: {

    items: [{
        name: 'USA',
        value: '线上支付'
      },
      {
        name: 'CHN',
        value: '线下支付',
        checked: 'true'
      },

    ],
    product: {},
    productType: {},
    shop: {},
    payType: 'offline',
    shoppingAddress: {},
    id: null,
    addressId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.state()
    that.data.id = options.id
    if (options.addressId) {
      that.data.addressId = options.addressId
    }
    app.utils.cl(that.data.addressId,'店址');


    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    await this.initData()
    wx.hideLoading({
      success: (res) => {},
    })

  },
  state() {
    that = this;
    openid = app.globalData.openid;
  },
  onShow() {
    let addressWhere;
    app.utils.cl(that.data.addressId,'店址');
    //查询收货默认地址
    if (that.data.addressId) {
      addressWhere = {
        _id: that.data.addressId,
        _openid: openid
      }
    } else {
      addressWhere = {
        default: true,
        _openid: openid
      }
    }
    app.dbbase.queryWhere('shoppingAddress', addressWhere).then(res => {
      app.utils.cl(res);
      that.setData({
        shoppingAddress: res.data[0]
      })
    })
  },
  initData() {
    
    //查询产品信息
    db.query("product", that.data.id).then((res) => {
      app.utils.cl(res);
      this.setData({
        product: res.data[0]
      })
      //要跳转的商品的分类
      db.query("productType", res.data[0].commodityTypeId).then((res) => {
        this.setData({
          productType: res.data[0]
        })
      })
      //要跳转的商品的店铺
      db.query("shop", res.data[0].shopId).then((res) => {
        this.setData({
          shop: res.data[0]
        })
      })
    })
  },
  AddressNavigateTo(e) {
    wx.navigateTo({
      url: '../mine/address/address?id=' + that.data.id
    })
  },
  OrderNavigateTo(e) {
    if (that.data.payType == 'weixin') {
      app.utils.hint('该功能暂不支持');
      return
    }
    wx.navigateTo({
      url: '../orderDetail/orderDetail?id=' + e.currentTarget.dataset.id,
    })
  },
  tapSelectPay(e) {
    app.utils.cl(e);
    let type = e.currentTarget.dataset.type
    that.setData({
      payType: type
    })
  }
})