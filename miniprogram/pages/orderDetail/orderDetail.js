const app = getApp()
var that;
var openid;
// miniprogram/pages/success/success.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    basicsList: [{
      icon: 'usefullfill',
      name: '已下单'
    }, {
      icon: 'radioboxfill',
      name: '已接单'
    }, {
      icon: 'timefill',
      name: '派送中'
    }, {
      icon: 'roundcheckfill',
      name: '已完成'
    }, ],
    basics: 0,
    numList: [{
      name: '已接单'
    }, {
      name: '已出货'
    }, {
      name: '配送中'
    }, {
      name: '已完成'
    }, ],
    num: 0,
    scroll: 0,
    id: null,
    order: null,
    shoppingAddress: {},
    shopInfo: {},
    isUserOrder: true, //是否是普通用户的订单，而不是商家订单
  },
  cancelOrder() {
    return new Promise(success => {
      wx.showModal({
        title: '取消提示',
        content: '您确定要取消？',
        success(e) {
          if (e.confirm) {
            success(true)
          }
          success(false)
        }
      })
    })
  },
  basicsSteps(e) {
    let id = that.data.id;
    let where = {
      _id: that.data.id
    }
    let data = {
      orderState: 1
    }
    app.utils.cl(id, data);
    app.utils.cl("e", e.currentTarget.dataset.type);
    if (e.currentTarget.dataset.type == 0) {
      //取消订单
      wx.showModal({
        title: '取消提示',
        content: '您确定要取消？',
        success(res) {
          if (res.confirm) {
            data.orderState = -1
            that.upOrderState(id, data);
          } else {
            return false;
          }

        }
      })
    } else {
      //判断当前订单状态
      if (that.data.order.orderState == 0) {
        data.orderState = 1
        that.upOrderState(id, data);
      } else if (that.data.order.orderState == 1) {
        data.orderState = 2
        that.upOrderState(id, data);
      } else if (that.data.order.orderState == 2) {
        data.orderState = 3
        wx.showModal({
          title: '收货确认',
          content: '请确保您已经收到货~',
          success(res) {
            if (res.confirm) {
              that.upOrderState(id, data);
            } else {
              return false;
            }

          }
        })

      }
       

    }




  },
  upOrderState(id, data) {
    app.dbbase.update('order', id, data).then(res => {
      app.utils.cl(res);
      if (res.stats.updated > 0) {
        app.utils.hint('操作成功');
        that.initData()
      } else {
        app.utils.hint('修改失败');

      }
    })
  },
  numSteps() {
    this.setData({
      num: this.data.num == this.data.numList.length - 1 ? 0 : this.data.num + 1
    })
  },
  scrollSteps() {
    this.setData({
      scroll: this.data.scroll == 9 ? 0 : this.data.scroll + 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.state()
    that.data.id = options.id
    that.initData()
    app.utils.cl(options);

  },
  state() {
    that = this,
      openid = app.globalData.openid
  },
  initData() {
    that.geShopInfo()
    app.dbbase.query('order', that.data.id).then(res => {
      app.utils.cl(res);
      let data = res.data[0];
      data.addOrderDate = app.dateformat(data.addOrderDate)
      that.setData({
        order: data
      })
      this.setData({
        basics: that.data.basics = data.orderState
      })
      app.utils.cl(that.data.order, '订单');
      let addressId = that.data.order.shoppingAddressId
      app.utils.cl(addressId);
      app.dbbase.query('shoppingAddress', addressId).then(res => {
        app.utils.cl(res, '收货地址');
        that.setData({
          shoppingAddress: res.data[0]
        })

      })
    })

  },
  geShopInfo() {
    let _openid = app.globalData.openid
    app.utils.cl('openid', _openid);

    app.dbbase.queryOpenId('shop', _openid).then(res => {
      app.utils.cl('商家信息', res);
      if (res.data.length == 1) {
        that.setData({
          shopInfo: res.data[0]
        })
      } else {
        that.setData({
          shopInfo: undefined
        })
      }

    })
  },
  tapBack() {
    app.utils.cl("吃牛逼");
    wx.navigateTo({
      url: '../order/order.wxml',
    })
  }
})