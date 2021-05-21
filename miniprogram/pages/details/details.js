import db from '../../config/dbbase.js';
import utils from '../../config/utils.js';
const app=getApp();
Page({
  data: {
    swiperList: [{
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
    }, 
    ],
    product:[],
    productType:[],
    shop:[]
  },
  //页面加载
  onLoad(product) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    this.setData({
      picker:[]
    })
    //要跳转的商品
    db.query("product",product.id).then((res)=>{
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
})