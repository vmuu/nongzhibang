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
    list: [],
    load: true,
    commodityType:[
    ],
    shop:[
    ]
  },
  
  onLoad(shop) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    //调用封装的多表（2表）联查函数
    db.looKupTwo("test",shop.id,"productType","product","_id","commodityTypeId","commodity").then((res)=>{
      /*console.log(res.result.list);*/
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

    //联表查询
    // wx.cloud.callFunction({
    //   name:'test',
    //   data:{
    //     collection:'commodityType',

    //     from:'commodity',
    //     localField:'Id',
    //     foreignField:'commodityTypeId',
    //     as:'commodity',
        
    //     /*from2:'act',
    //     localField2:'department._id',
    //     foreignField2:'activity',
    //     as2:'act',*/

    //     match:{_id:app.globalData.openid}
    //   },
    //   success:res=>{
    //   console.log(res.result.list)
    //   //绑定到本地数据
    //   this.setData({commodityType:res.result.list})
    //   }
    // })
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
        let view = wx.createSelectorQuery().select("#main-" + list[i].Id);
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
          VerticalNavTop: (list[i].Id - 1) * 50,
          TabCur: list[i].Id
        })
        return false
      }
    }
  }
})