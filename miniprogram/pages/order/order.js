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
    cancelOrder:[],
    //从哪开始查询
    max: 0,
    //一次性查几条数据
    limit: 4,
    //触底时是否继续请求数据库
    theOnReachBottom0: true,
    theOnReachBottom1: true,
    theOnReachBottom2: true,
    theOnReachBottom3: true,
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
    app.dbbase.orderOpenId(app.globalData.openid,this.data.max,this.data.limit).then((res)=>{
      app.utils.cl(res.data);
      this.setData({
        allOrder:res.data,
        //初始化后从第几个开始加载
        max: this.data.limit
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
    this.setData({
      showLoadMore: false
    })
    let that = this
    //console.log(e.detail.current);
    that.setData({
      TabCur: e.detail.current
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  reachBottom() {
    app.utils.cl(this.data.TabCur);
    
    //是否继续加载数据？
    if (this.data.theOnReachBottom) {
      //当数据库里还有商品时，继续请求数据库
      setTimeout(() => {
        this.setListData();
      }, 300);
    } else {
      //当数据库里没有商品时，停止请求数据库，并弹出提示
      this.setData({
        loadMoreText: "没有更多商品了!",
        showLoadMore: true,
      })
    }
  },
  /**
   * 请求商品数据
   */
  setListData(e) {
    switch(TabCur){
      case 0:{
        app.dbbase.productlist(this.data.max, this.data.limit).then((res) => {
          //当数据库里商品加载完毕之后停止请求数据库
          if (res.data.length == 0) {
            this.setData({
              loadMoreText: "没有更多商品了!",
              showLoadMore: true,
              theOnReachBottom: false
            })
            app.utils.hint('没有更多商品了!');
          }
          //当数据库里还有商品数据时，继续追加到本地数据
          else {
            this.setData({
              hotProductlist: this.data.hotProductlist.concat(res.data),
              max: this.data.max + this.data.limit
            })
          }
        })
        break;
      }
      case 1:{
        break;
      }
      case 2:{
        break;
      }
      case 3:{
        break;
      }
    }
    
  },
})