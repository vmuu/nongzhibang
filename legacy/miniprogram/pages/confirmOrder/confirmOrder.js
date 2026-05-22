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
    shoppingAddress: null,
    id: null,
    addressId: null,
    order: {},
    orderBtnDisable: false,
    shopInfo: {},
    shopId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.state()
    that.data.id = options.id
    app.utils.cl(options.id);

    if (options.addressId) {
      that.data.addressId = options.addressId
    }
    app.utils.cl(that.data.addressId, '店址');


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
    app.utils.cl(that.data.addressId, '店址');
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
      app.utils.cl('123', res);
      if (res.data.length == 1) {
        that.setData({
          shoppingAddress: res.data[0],
          shopId: res.data[0].shopId
        })
      } else {
        wx.showModal({
          title: '添加收货地址',
          content: '您还未添加收货地址',
          confirmText: '立即添加',
          showCancel: false,
          success(e) {
            if (e.confirm) {
              wx.navigateTo({
                url: '../mine/address/address?id=' + that.data.id
              })
            }
          }
        })
      }

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
  getShopInfo() {
    let id = that.data.shopId;
    app.dbbase.query('shop', id).then(res => {
      app.utils.cl(res);
      that.setData({
        shopInfo: res.data[0]
      })

    })
  },
  AddressNavigateTo(e) {
    wx.navigateTo({
      url: '../mine/address/address?id=' + that.data.id
    })
  },
  async OrderNavigateTo(e) {
    if (that.data.payType == 'weixin') {
      app.utils.hint('该功能暂不支持');
      return
    }
    //确认下单
    let orderInfo = await that.confirmOrder();
    app.utils.cl(orderInfo, '阿斯蒂芬');

    wx.showLoading({
      title: '正在处理中',
      mask: true
    })


    app.dbbase.add('order', orderInfo).then(res => {
      app.utils.cl(res);
      app.utils.cl(res._id, 'id');

      wx.hideLoading({
        success: (res) => {},
      })
      wx.redirectTo({
        url: '../orderDetail/orderDetail?id=' + res._id,
      })
    })
  },
  getOrderNumber() {
    //获取当前时间，转换成文件名
    let year = "",
      month = "",
      day = "",
      timestamp = "",
      hours = "",
      minutes = "",
      seconds = "";
    let date = new Date();
    year = date.getFullYear().toString();
    month = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth();
    day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    //获取时间戳
    timestamp = (new Date()).valueOf();
    hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    //生成订单
    let orderNumber = year + month + day + hours + minutes + seconds + timestamp;
    return orderNumber;
  },
  async confirmOrder() {
    //生成订单号
    let orderNo = await this.getOrderNumber();
    let shoppingAddress = that.data.shoppingAddress;
    //店铺地址
    let shopAddress = shoppingAddress.province + shoppingAddress.city + shoppingAddress.county + shoppingAddress.address;
    //
    app.utils.cl(that.data.product);
    app.utils.cl(that.data.shop);

    let order = {
      img: that.data.product.image,
      productDesc: that.data.product.desc,
      shopName: that.data.shop.shopName,
      shopId: that.data.shop._id,
      orderState: 0,
      productName: that.data.product.name,
      productTypeName: that.data.productType.name,
      addOrderDate: new Date(),
      orderNumber: orderNo,
      payType: "offline",
      startPrice: that.data.shop.startPrice,
      howMoney: that.data.product.currentPrice,
      shopAddress: shopAddress, //店铺地址
      shoppingAddressId: shoppingAddress._id, //收货地址id
      // orderUserId: null,
      // orderUserName: null,
      shopImage: that.data.shop.shopImage,
      productId: that.data.product._id
    }
    app.utils.cl(that.data.order);
    return order;

  },
  tapSelectPay(e) {
    app.utils.cl(e);
    let type = e.currentTarget.dataset.type
    that.setData({
      payType: type
    })
  }
})