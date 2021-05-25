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
    allOrder:[]
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
    app.dbbase.queryOpenId('order',app.globalData.openid).then((res)=>{
      app.utils.cl(res.data);
      this.setData({
        allOrder:res.data
      })
    })
    //  .exec() 不加不执行

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