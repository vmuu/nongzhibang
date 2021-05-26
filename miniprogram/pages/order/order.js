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
    //是否显示触底提示
    showLoadMore: false,
    //从哪开始查询
    max0: 0,
    max1: 0,
    max2: 0,
    max3: 0,
    //一次性查几条数据
    limit0: 4,
    limit1: 4,
    limit2: 4,
    limit3: 4,
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
    app.dbbase.orderOpenId(app.globalData.openid,this.data.max0,this.data.limit0).then((res)=>{
      app.utils.cl("all",res.data);
      this.setData({
        allOrder:res.data,
        //初始化后从第几个开始加载
        max0: this.data.limit0
      })
    })
    //交易中订单
    app.dbbase.orderOpenIdDownStateIng(app.globalData.openid,this.data.max1,this.data.limit1).then((res)=>{
      app.utils.cl(res.data);
      this.setData({
        ingOrder:res.data,
        //初始化后从第几个开始加载
        max1: this.data.limit1
      })
    })
    //已完成订单
    app.dbbase.orderOpenIdDownState(app.globalData.openid,this.data.max2,this.data.limit2,3).then((res)=>{
      app.utils.cl(res.data);
      this.setData({
        accomplishOrder:res.data,
        //初始化后从第几个开始加载
        max2: this.data.limit2
      })
    })
    //已取消订单
    app.dbbase.orderOpenIdDownState(app.globalData.openid,this.data.max3,this.data.limit3,-1).then((res)=>{
      app.utils.cl(res.data);
      this.setData({
        cancelOrder:res.data,
        //初始化后从第几个开始加载
        max3: this.data.limit3
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
    switch(this.data.TabCur){
      case 0:{
        //是否继续加载数据？
        if (this.data.theOnReachBottom0) {
          //当数据库里还有商品时，继续请求数据库
          setTimeout(() => {
            this.setListData();
          }, 300);
        } else {
          //当数据库里没有商品时，停止请求数据库，并弹出提示
          this.setData({
            loadMoreText: "没有更多全部订单了!",
            showLoadMore: true,
          })
        }
        break;
      }
      case 1:{
        //是否继续加载数据？
        if (this.data.theOnReachBottom1) {
          //当数据库里还有商品时，继续请求数据库
          setTimeout(() => {
            this.setListData();
          }, 300);
        } else {
          //当数据库里没有商品时，停止请求数据库，并弹出提示
          this.setData({
            loadMoreText: "没有更多交易中订单了!",
            showLoadMore: true,
          })
        }
        break;
      }
      case 2:{
        //是否继续加载数据？
        if (this.data.theOnReachBottom2) {
          //当数据库里还有商品时，继续请求数据库
          setTimeout(() => {
            this.setListData();
          }, 300);
        } else {
          //当数据库里没有商品时，停止请求数据库，并弹出提示
          this.setData({
            loadMoreText: "没有更多已完成订单了!",
            showLoadMore: true,
          })
        }
        break;
      }
      case 3:{
        //是否继续加载数据？
        if (this.data.theOnReachBottom3) {
          //当数据库里还有商品时，继续请求数据库
          setTimeout(() => {
            this.setListData();
          }, 300);
        } else {
          //当数据库里没有商品时，停止请求数据库，并弹出提示
          this.setData({
            loadMoreText: "没有更多已取消订单了!",
            showLoadMore: true,
          })
        }
        break;
      }
    }
  },
  /**
   * 请求商品数据
   */
  setListData(e) {
    switch(this.data.TabCur){
      case 0:{
        app.dbbase.orderOpenId(app.globalData.openid,this.data.max0,this.data.limit0).then((res) => {
          //当数据库里商品加载完毕之后停止请求数据库
          if (res.data.length == 0) {
            this.setData({
              loadMoreText: "没有更多全部订单了!",
              showLoadMore: true,
              theOnReachBottom0: false
            })
            app.utils.hint('没有更多全部订单了!');
          }
          //当数据库里还有商品数据时，继续追加到本地数据
          else {
            this.setData({
              allOrder: this.data.allOrder.concat(res.data),
              max0: this.data.max0 + this.data.limit0
            })
          }
        })
        break;
      }
      case 1:{
        app.dbbase.orderOpenIdDownStateIng(app.globalData.openid,this.data.max1,this.data.limit1).then((res) => {
          //当数据库里商品加载完毕之后停止请求数据库
          if (res.data.length == 0) {
            this.setData({
              loadMoreText: "没有更多交易中订单了!",
              showLoadMore: true,
              theOnReachBottom1: false
            })
            app.utils.hint('没有更多交易中订单了!');
          }
          //当数据库里还有商品数据时，继续追加到本地数据
          else {
            this.setData({
              ingOrder: this.data.allOrder.concat(res.data),
              max1: this.data.max1 + this.data.limit1
            })
          }
        })
        break;
      }
      case 2:{
        app.dbbase.orderOpenIdDownStateIng(app.globalData.openid,this.data.max2,this.data.limit2).then((res) => {
          //当数据库里商品加载完毕之后停止请求数据库
          if (res.data.length == 0) {
            this.setData({
              loadMoreText: "没有更多已完成订单了!",
              showLoadMore: true,
              theOnReachBottom2: false
            })
            app.utils.hint('没有更多已完成订单了!');
          }
          //当数据库里还有商品数据时，继续追加到本地数据
          else {
            this.setData({
              accomplishOrder: this.data.allOrder.concat(res.data),
              max2: this.data.max2 + this.data.limit2
            })
          }
        })
        break;
      }
      case 3:{
        app.dbbase.orderOpenIdDownStateIng(app.globalData.openid,this.data.max3,this.data.limit3).then((res) => {
          //当数据库里商品加载完毕之后停止请求数据库
          if (res.data.length == 0) {
            this.setData({
              loadMoreText: "没有更多已取消订单了!",
              showLoadMore: true,
              theOnReachBottom3: false
            })
            app.utils.hint('没有更多已取消订单了!');
          }
          //当数据库里还有商品数据时，继续追加到本地数据
          else {
            this.setData({
              cancelOrder: this.data.allOrder.concat(res.data),
              max3: this.data.max3 + this.data.limit3
            })
          }
        })
        break;
      }
    }
    
  },
})