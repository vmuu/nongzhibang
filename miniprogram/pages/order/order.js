//order.js
import db from '../../config/dbbase.js';
const app = getApp()
var that;
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    orderItemHeight: 0,
    TabCur: 0,
    scrollLeft: 0,
    orderState: ['全部', '交易中', '已完成', '已取消'],
    allOrder: [],
    ingOrder: [],
    accomplishOrder: [],
    cancelOrder: [],
    //showload:app.globalData.showload,
    //是否显示弹窗
    showload:false,
    //是商家还是个人
    isShopOrUserOrder:"我的个人订单",
    //是否加载
    ifselect:true,
    //商店_id
    shop_id: "",
    //身份状态
    status: false,
    //样式状态
    switchState: true,
    //是否显示触底提示
    showLoadMore: false,
    isShop: -1,
    shopInfo: null,
    refresherTriggered: false,
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
    //从哪开始查询
    Merchantmax0: 0,
    Merchantmax1: 0,
    Merchantmax2: 0,
    Merchantmax3: 0,
    //一次性查几条数据
    Merchantlimit0: 4,
    Merchantlimit1: 4,
    Merchantlimit2: 4,
    Merchantlimit3: 4,
    //触底时是否继续请求数据库
    MerchanttheOnReachBottom0: true,
    MerchanttheOnReachBottom1: true,
    MerchanttheOnReachBottom2: true,
    MerchanttheOnReachBottom3: true,
    MerchantallOrder: [],
    MerchantingOrder: [],
    MerchantaccomplishOrder: [],
    MerchantcancelOrder: [],
  },

  onShow() {

  },
  refreshOrder() {
    this.initstate();
    app.utils.cl('刷新了订单');
    that.reachBottom();
  },
  async onLoad() {
    app.utils.cl("你直接",app.globalData.isShop);
    that = this;
    app.globalData.orderPage = this;
    that.setData({
      showload:true
    })

    //设置订单盒子的高度
    let query = wx.createSelectorQuery();
    query.select('#scrollView').boundingClientRect(rect => {
      let scrolView = rect.height;
      let height = parseInt(app.globalData.sysInfo.windowHeight) - parseInt(this.data.CustomBar) - parseInt(scrolView)
      app.utils.cl(app.globalData.sysInfo.windowHeight, '可视窗口高');
      app.utils.cl(this.data.CustomBar, 'custom高');
      app.utils.cl(scrolView, '滚动高');
      that.setData({
        orderItemHeight: height
      })
    }).exec(); //  .exec() 不加不执行

    that.setData({
      isShop:app.globalData.isShop,
      shopInfo:app.globalData.shopInfo
    })
    await that.initData()
    that.setData({
      showload:false
    })
  },
  onReady(){
  },
  getShopInfo() {
    app.dbbase.queryOpenId("shop", app.globalData.openid).then((res) => {
      if (res.data.length > 0) {
        this.setData({
          shop_id: res.data[0]._id,
          isShop: res.data[0].isShop
        })
      } else {
        this.setData({
          isShop: -1
        })
      }

      app.utils.cl("shop_id", this.data.shop_id);
      app.utils.cl(that.data.isShop);

      if (that.data.isShop === 1) {
        //开通了店铺
      }
    })
  },
  async initData() {
    await that.getShopInfo()
    await that.getOrderList()
  },
  getOrderList() {
    return new Promise(success => {
      //商家的订单
      if (this.data.status) {
        //全部订单
        app.dbbase.orderMerchantOpenId(this.data.shop_id, this.data.Merchantmax0, this.data.Merchantlimit0).then((res) => {
          app.utils.cl("all", res.data);
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].addOrderDate = app.dateformat(res.data[i].addOrderDate)
          }
          this.setData({
            MerchantallOrder: res.data,
            //初始化后从第几个开始加载
            Merchantmax0: this.data.Merchantlimit0
          })
          success()
        })
        //交易中订单
        app.dbbase.orderMerchantOpenIdDownStateIng(app.globalData.openid, this.data.Merchantmax1, this.data.Merchantlimit1).then((res) => {
          app.utils.cl(res.data);
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].addOrderDate = app.dateformat(res.data[i].addOrderDate)
          }
          this.setData({
            MerchantingOrder: res.data,
            //初始化后从第几个开始加载
            Merchantmax1: this.data.Merchantlimit1
          })
          success()
        })
        //已完成订单
        app.dbbase.orderMerchantOpenIdDownState(app.globalData.openid, this.data.Merchantmax2, this.data.Merchantlimit2, 3).then((res) => {
          app.utils.cl(res.data);
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].addOrderDate = app.dateformat(res.data[i].addOrderDate)
          }
          this.setData({
            MerchantaccomplishOrder: res.data,
            //初始化后从第几个开始加载
            Merchantmax2: this.data.Merchantlimit2
          })
          success()
        })
        //已取消订单
        app.dbbase.orderMerchantOpenIdDownState(app.globalData.openid, this.data.Merchantmax3, this.data.Merchantlimit3, -1).then((res) => {
          app.utils.cl(res.data);
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].addOrderDate = app.dateformat(res.data[i].addOrderDate)
          }
          this.setData({
            MerchantcancelOrder: res.data,
            //初始化后从第几个开始加载
            Merchantmax3: this.data.Merchantlimit3
          })
          success()
        })
      }
      //个人的订单
      else {
        //全部订单
        app.dbbase.orderOpenId(app.globalData.openid, this.data.max0, this.data.limit0).then((res) => {
          app.utils.cl("all", res.data);
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].addOrderDate = app.dateformat(res.data[i].addOrderDate)
          }
          this.setData({
            allOrder: res.data,
            //初始化后从第几个开始加载
            max0: this.data.limit0
          })
          success()
        })
        //交易中订单
        app.dbbase.orderOpenIdDownStateIng(app.globalData.openid, this.data.max1, this.data.limit1).then((res) => {
          app.utils.cl(res.data);
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].addOrderDate = app.dateformat(res.data[i].addOrderDate)
          }
          this.setData({
            ingOrder: res.data,
            //初始化后从第几个开始加载
            max1: this.data.limit1
          })
          success()
        })
        //已完成订单
        app.dbbase.orderOpenIdDownState(app.globalData.openid, this.data.max2, this.data.limit2, 3).then((res) => {
          app.utils.cl(res.data);
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].addOrderDate = app.dateformat(res.data[i].addOrderDate)
          }
          this.setData({
            accomplishOrder: res.data,
            //初始化后从第几个开始加载
            max2: this.data.limit2
          })
          success()
        })
        //已取消订单
        app.dbbase.orderOpenIdDownState(app.globalData.openid, this.data.max3, this.data.limit3, -1).then((res) => {
          app.utils.cl(res.data);
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].addOrderDate = app.dateformat(res.data[i].addOrderDate)
          }
          this.setData({
            cancelOrder: res.data,
            //初始化后从第几个开始加载
            max3: this.data.limit3
          })
          success()
        })
      }
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
    if(this.data.ifselect)
    switch (this.data.TabCur) {
      case 0: {
        //是否继续加载数据？
        if (this.data.theOnReachBottom0) {
          this.setData({
            showLoad:true,
            ifselect:false
          })
          //当数据库里还有商品时，继续请求数据库
          setTimeout(() => {
            this.setListData();
            this.setData({
              showLoad:false,
              ifselect:true
            })
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
      case 1: {
        //是否继续加载数据？
        if (this.data.theOnReachBottom1) {
          this.setData({
            showLoad:true,
            ifselect:false
          })
          //当数据库里还有商品时，继续请求数据库
          setTimeout(() => {
            this.setListData();
            this.setData({
              showLoad:false,
              ifselect:true
            })
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
      case 2: {
        //是否继续加载数据？
        if (this.data.theOnReachBottom2) {
          this.setData({
            showLoad:true,
            ifselect:false
          })
          //当数据库里还有商品时，继续请求数据库
          setTimeout(() => {
            this.setListData();
            this.setData({
              showLoad:false,
              ifselect:true
            })
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
      case 3: {
        //是否继续加载数据？
        if (this.data.theOnReachBottom3) {
          this.setData({
            showLoad:true,
            ifselect:false
          })
          //当数据库里还有商品时，继续请求数据库
          setTimeout(() => {
            this.setListData();
            this.setData({
              showLoad:false,
              ifselect:true
            })
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
    if (this.data.status) {
      switch (this.data.TabCur) {
        case 0: {
          app.utils.cl(this.data.max0);
          app.utils.cl(this.data.limit0);
          app.dbbase.orderMerchantOpenId(this.data.shop_id, this.data.max0, this.data.limit0).then((res) => {
            //当数据库里商品加载完毕之后停止请求数据库
            if (res.data.length == 0) {
              app.utils.cl(this.data.allOrder.length);
              this.setData({
                loadMoreText: "没有更多全部订单了!",
                showLoadMore: true,
                theOnReachBottom0: false
              })
              app.utils.hint('没有更多全部订单了!');
            }
            //当数据库里还有商品数据时，继续追加到本地数据
            else {
              for (let i = 0; i < res.data.length; i++) {
                res.data[i].addOrderDate = app.dateformat(res.data[i].addOrderDate)
              }
              this.setData({
                allOrder: this.data.allOrder.concat(res.data),
                max0: this.data.max0 + this.data.limit0
              })
              app.utils.cl(this.data.allOrder);
              
            }
          })
          break;
        }
        case 1: {
          app.dbbase.orderMerchantOpenIdDownStateIng(this.data.shop_id, this.data.max1, this.data.limit1).then((res) => {
            //当数据库里商品加载完毕之后停止请求数据库
            if (res.data.length == 0) {
              app.utils.cl(this.data.ingOrder.length);
              this.setData({
                loadMoreText: "没有更多交易中订单了!",
                showLoadMore: true,
                theOnReachBottom1: false
              })
              app.utils.hint('没有更多交易中订单了!');
            }
            //当数据库里还有商品数据时，继续追加到本地数据
            else {
              for (let i = 0; i < res.data.length; i++) {
                res.data[i].addOrderDate = app.dateformat(res.data[i].addOrderDate)
              }
              this.setData({
                ingOrder: this.data.ingOrder.concat(res.data),
                max1: this.data.max1 + this.data.limit1
              })
            }
          })
          break;
        }
        case 2: {
          app.dbbase.orderMerchantOpenIdDownState(this.data.shop_id, this.data.max2, this.data.limit2, 3).then((res) => {
            //当数据库里商品加载完毕之后停止请求数据库
            if (res.data.length == 0) {
              app.utils.cl(this.data.accomplishOrder.length);
              this.setData({
                loadMoreText: "没有更多已完成订单了!",
                showLoadMore: true,
                theOnReachBottom2: false
              })
              app.utils.hint('没有更多已完成订单了!');
            }
            //当数据库里还有商品数据时，继续追加到本地数据
            else {
              for (let i = 0; i < res.data.length; i++) {
                res.data[i].addOrderDate = app.dateformat(res.data[i].addOrderDate)
              }
              this.setData({
                accomplishOrder: this.data.accomplishOrder.concat(res.data),
                max2: this.data.max2 + this.data.limit2
              })
            }
          })
          break;
        }
        case 3: {
          app.dbbase.orderMerchantOpenIdDownState(this.data.shop_id, this.data.max3, this.data.limit3, -1).then((res) => {
            //当数据库里商品加载完毕之后停止请求数据库
            if (res.data.length == 0) {
              app.utils.cl(this.data.cancelOrder.length);
              this.setData({
                loadMoreText: "没有更多已取消订单了!",
                showLoadMore: true,
                theOnReachBottom3: false
              })
              app.utils.hint('没有更多已取消订单了!');
            }
            //当数据库里还有商品数据时，继续追加到本地数据
            else {
              for (let i = 0; i < res.data.length; i++) {
                res.data[i].addOrderDate = app.dateformat(res.data[i].addOrderDate)
              }
              this.setData({
                cancelOrder: this.data.cancelOrder.concat(res.data),
                max3: this.data.max3 + this.data.limit3
              })
            }
          })
          break;
        }
      }
    } else {
      switch (this.data.TabCur) {
        case 0: {
          app.dbbase.orderOpenId(app.globalData.openid, this.data.max0, this.data.limit0).then((res) => {
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
              for (let i = 0; i < res.data.length; i++) {
                res.data[i].addOrderDate = app.dateformat(res.data[i].addOrderDate)
              }
              this.setData({
                allOrder: this.data.allOrder.concat(res.data),
                max0: this.data.max0 + this.data.limit0
              })
            }
          })
          break;
        }
        case 1: {
          app.dbbase.orderOpenIdDownStateIng(app.globalData.openid, this.data.max1, this.data.limit1).then((res) => {
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
              for (let i = 0; i < res.data.length; i++) {
                res.data[i].addOrderDate = app.dateformat(res.data[i].addOrderDate)
              }
              this.setData({
                ingOrder: this.data.ingOrder.concat(res.data),
                max1: this.data.max1 + this.data.limit1
              })
            }
          })
          break;
        }
        case 2: {
          app.dbbase.orderOpenIdDownState(app.globalData.openid, this.data.max2, this.data.limit2, 3).then((res) => {
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
              for (let i = 0; i < res.data.length; i++) {
                res.data[i].addOrderDate = app.dateformat(res.data[i].addOrderDate)
              }
              this.setData({
                accomplishOrder: this.data.accomplishOrder.concat(res.data),
                max2: this.data.max2 + this.data.limit2
              })
            }
          })
          break;
        }
        case 3: {
          app.dbbase.orderOpenIdDownState(app.globalData.openid, this.data.max3, this.data.limit3, -1).then((res) => {
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
              for (let i = 0; i < res.data.length; i++) {
                res.data[i].addOrderDate = app.dateformat(res.data[i].addOrderDate)
              }
              this.setData({
                cancelOrder: this.data.cancelOrder.concat(res.data),
                max3: this.data.max3 + this.data.limit3
              })
            }
          })
          break;
        }
      }
    }

  },

  SetShadow(e) {
    this.setData({
      showLoad:true
    })
    app.utils.cl(e);
    this.initstate();
    if (e.currentTarget.dataset.value) {
      this.setData({
        //商家deliver_fill
        status: true,
        switchState: false,
        isShopOrUserOrder:"我的商家订单"
      })
      //全部订单
      app.utils.cl("cnm",this.data.shop_id);
      
      app.dbbase.orderMerchantOpenId(this.data.shop_id, this.data.max0, this.data.limit0).then((res) => {
        app.utils.cl("all", res.data);
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].addOrderDate = app.dateformat(res.data[i].addOrderDate)
        }
        this.setData({
          allOrder: res.data,
          //初始化后从第几个开始加载
          max0: this.data.limit0
        })
      })
      //交易中订单
      app.dbbase.orderMerchantOpenIdDownStateIng(this.data.shop_id, this.data.max1, this.data.limit1).then((res) => {
        app.utils.cl(res.data);
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].addOrderDate = app.dateformat(res.data[i].addOrderDate)
        }
        this.setData({
          ingOrder: res.data,
          //初始化后从第几个开始加载
          max1: this.data.limit1
        })
      })
      //已完成订单
      app.dbbase.orderMerchantOpenIdDownState(this.data.shop_id, this.data.max2, this.data.limit2, 3).then((res) => {
        app.utils.cl(res.data);
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].addOrderDate = app.dateformat(res.data[i].addOrderDate)
        }
        this.setData({
          accomplishOrder: res.data,
          //初始化后从第几个开始加载
          max2: this.data.limit2
        })
      })
      //已取消订单
      app.dbbase.orderMerchantOpenIdDownState(this.data.shop_id, this.data.max3, this.data.limit3, -1).then((res) => {
        app.utils.cl(res.data);
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].addOrderDate = app.dateformat(res.data[i].addOrderDate)
        }
        this.setData({
          cancelOrder: res.data,
          //初始化后从第几个开始加载
          max3: this.data.limit3
        })
      })
    } else {
      this.setData({
        //个人people
        status: false,
        switchState: true,
        isShopOrUserOrder:"我的个人订单"
      })

      //全部订单
      app.dbbase.orderOpenId(app.globalData.openid, this.data.max0, this.data.limit0).then((res) => {
        app.utils.cl("all", res.data);
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].addOrderDate = app.dateformat(res.data[i].addOrderDate)
        }
        this.setData({
          allOrder: res.data,
          //初始化后从第几个开始加载
          max0: this.data.limit0
        })
      })
      //交易中订单
      app.dbbase.orderOpenIdDownStateIng(app.globalData.openid, this.data.max1, this.data.limit1).then((res) => {
        app.utils.cl(res.data);
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].addOrderDate = app.dateformat(res.data[i].addOrderDate)
        }
        this.setData({
          ingOrder: res.data,
          //初始化后从第几个开始加载
          max1: this.data.limit1
        })
      })
      //已完成订单
      app.dbbase.orderOpenIdDownState(app.globalData.openid, this.data.max2, this.data.limit2, 3).then((res) => {
        app.utils.cl(res.data);
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].addOrderDate = app.dateformat(res.data[i].addOrderDate)
        }
        this.setData({
          accomplishOrder: res.data,
          //初始化后从第几个开始加载
          max2: this.data.limit2
        })
      })
      //已取消订单
      app.dbbase.orderOpenIdDownState(app.globalData.openid, this.data.max3, this.data.limit3, -1).then((res) => {
        app.utils.cl(res.data);
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].addOrderDate = app.dateformat(res.data[i].addOrderDate)
        }
        this.setData({
          cancelOrder: res.data,
          //初始化后从第几个开始加载
          max3: this.data.limit3
        })
      })
    }
    this.setData({
      showLoad:false
    })
  },
  refresherrefresh() {
    this.initstate();
    that.setData({
      showLoad: true
    })
    setTimeout(() => {
      that.reachBottom();
      that.setData({
        showLoad: false
      })
      that.setData({
        refresherTriggered: false
      })
    }, 1000);
  },
  initstate(){
    that.setData({
      allOrder: [],
      ingOrder: [],
      accomplishOrder: [],
      cancelOrder: [],
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
    })//714114
  },
  cancel(e){
    app.utils.cl("已取消",e.detail.currentTarget.dataset.id);
    wx.showModal({
      title: '注意',
      content: '确定要取消这个订单吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.initstate();
          //更新数据
          db.productupdate("order",{
            id:e.detail.currentTarget.dataset.id,
            orderState:-1,
            success: function (res) {
              wx.showLoading({
                title: '取消中...',
              })
            }
          }).then((res) => {
            wx.showToast({
              title: '取消成功',
              icon: 'none'
            })
            //that.reachBottom();
            that.onLoad()
          })
        }
      }
    })  
  }
})