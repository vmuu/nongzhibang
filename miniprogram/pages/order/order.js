//order.js
const app = getApp()

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    orderItemHeight: 0,
    TabCur: 0,
    scrollLeft: 0,
    orderState: ['全部', '交易中', '已完成', '已取消'],
    allOrder:[],
    ingOrder:[],
    accomplishOrder:[],
    cancelOrder:[]
  },
  onLoad: function () {
    let that = this
    //设置订单盒子的高度
    let query = wx.createSelectorQuery();
    query.select('.content').boundingClientRect(rect => {
      let scrolView = rect.height;
      let height = app.globalData.sysInfo.windowHeight - this.data.CustomBar - scrolView
      that.setData({
        orderItemHeight: height
      })
    }).exec();
    //  .exec() 不加不执行

    //全部订单
    app.dbbase.queryOpenId('order',app.globalData.openid).then((res)=>{
      app.utils.cl(res.data);
      this.setData({
        allOrder:res.data
      })
    })
    //交易中订单
    app.dbbase.orderOpenIdStateIng('order',app.globalData.openid).then((res)=>{
      app.utils.cl(res.data);
      this.setData({
        ingOrder:res.data
      })
    })
    //已完成订单
    app.dbbase.orderOpenIdState('order',app.globalData.openid,3).then((res)=>{
      app.utils.cl(res.data);
      this.setData({
        accomplishOrder:res.data
      })
    })
    //已取消订单
    app.dbbase.orderOpenIdState('order',app.globalData.openid,-1).then((res)=>{
      app.utils.cl(res.data);
      this.setData({
        cancelOrder:res.data
      })
    })
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  swiperChange(e) {
    let that = this
    console.log(e.detail.current);
    that.setData({
      TabCur: e.detail.current
    })
  },
  reachBottom() {
    wx.showToast({
      title: 'title',
    })
  }

})