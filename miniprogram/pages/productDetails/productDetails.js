import db from '../../config/dbbase.js';
import utils from '../../config/utils.js';
const app = getApp();
var that;
var openid;
Page({
  data: {
    swiperList: [{
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
    }, ],
    product: {},
    productType: {},
    shop: {},
    id: null,
    myShop:null,
    showLoad:true
  },
  //页面加载
  async onLoad(product) {
    that = this;
    that.state()
    that.data.id = product.id
    //要跳转的商品
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
        app.utils.cl('店铺', res.data[0]);
      })
    })
    await that.getMyShop()
    that.setData({
      showLoad:false
    })
  },
  state() {
    that = this
    openid = app.globalData.openid
  },
  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  getMyShop() {
    return new Promise((success,error) => {
      app.dbbase.queryOpenId('shop', openid).then(res => {
        app.utils.cl('我的店铺', res);
        if (res.data.length == 1) {
          that.setData({
            myShop: res.data[0]
          })
          return success()
        }
       return success()
      })
    })

  },
  goodNavigateTo(e) {
    if(!app.utils.isEmpty(that.data.myShop)){
      if(that.data.myShop._id==that.data.shop._id){
        app.utils.hint('您不可以订购自己的商品');
        return
      }
    }
    wx.navigateTo({
      url: '../confirmOrder/confirmOrder?id=' + that.data.id,
    })
  }
})