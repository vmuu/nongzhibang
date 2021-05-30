import dbbase from '../../config/dbbase.js';
// const { default: dbbase } = require("../../config/dbbase");
import db from '../../config/dbbase.js'
import utils from '../../config/utils.js';

const app = getApp();
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    MainCur: 0,
    heighttop:(app.globalData.StatusBar)+40,
    VerticalNavTop: 0,
    //商品对象图片索引
    imgList: [],
    index_x: null,
    checkbox: [{
      value: 0,
      name: '10元',
      checked: false,
      hot: false,
    }, {
      value: 1,
      name: '20元',
      checked: true,
      hot: false,
    }, {
      value: 2,
      name: '30元',
      checked: true,
      hot: true,
    }, {
      value: 3,
      name: '60元',
      checked: false,
      hot: true,
    }, {
      value: 4,
      name: '80元',
      checked: false,
      hot: false,
    }, {
      value: 5,
      name: '100元',
      checked: false,
      hot: false,
    }],
    list: [],
    load: true,
    //商品分类
    commodityType:[],
    //商店
    shop:[],
    //商品对象
    product:[],
  },
  
  onLoad(shop) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let list = [{}];
    for (let i = 0; i < 3; i++) {
      list[i] = {};
      list[i].name = String.fromCharCode(65 + i);
      list[i].id = i;
    }
    this.setData({
      list: list,
      listCur: list[0]
    })
    //调用封装的多表（2表）联查函数
    db.looKupTwo("looKupProductOrProductType",shop.id,"productType","product","_id","commodityTypeId","commodity").then((res)=>{
      app.utils.cl(res.result.list);
      this.setData({
        commodityType:res.result.list
      })
    })
    
    
    //要跳转的商家
    dbbase.query("shop",shop.id).then((res)=>{
      this.setData({
        shop:res.data[0]
      })
    })
  },
  onReady() {
    wx.hideLoading()
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
  //下拉逻辑
  VerticalMain(e) {
    let that = this;
    let list = this.data.commodityType;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + i);
        view.fields({
          size: true
        }, data => {
          list[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          list[i].bottom = tabHeight;
        }).exec();
      }
      that.setData({
        load: false,
        list: list
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        that.setData({
          VerticalNavTop: (i - 1) * 50,
          TabCur: i
        })
        return false
      }
    }
  },
  productdesc(e) {
    wx.navigateTo({
      url: '../productDetails/productDetails?id='+e.currentTarget.dataset.id,
    })
  },
  showShopAnnouncement(e) {
    app.utils.hint(e.currentTarget.dataset.showshopannouncement,3000);
  },
  shopDescribe(e){
    app.utils.hint(e.currentTarget.dataset.shopdescribe,3000);
  },
  showAddress(e) {
    app.utils.cl(e);
    app.utils.hint(e.currentTarget.dataset.showaddress,3000);
  },
})