// miniprogram/pages/mine/address/address.js
var that;
var openid;
const app = getApp();
Page({
  change(e) {
    return app.change(e, this);
  },
  /**
   * 页面的初始数据
   */
  data: {
    addModel: false,
    region: ['云南省', '昆明市', '五华区'],
    address: {
      province: '云南省',
      city: '昆明市',
      county: '五华区',
      default: false
    },
    addressList: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.state()
    that.initData()
  },
  state() {
    that = this;
    openid = app.globalData.openid;
  },
  initData() {
    app.dbbase.queryOpenId('shoppingAddress', openid).then(res => {
      app.utils.cl(res.data);
      that.setData({
        addressList:res.data
      })
      app.utils.cl(that.data.addressList);
    })
  },

  /**
   * 删除地址
   */
  tapDelete() {
    wx.showModal({
      title: '删除提示',
      content: '人家这么可爱，确定要人家嘛~',
      cancelColor: "#07c160",
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '删除成功！',
            icon: 'none'
          })
        }
      }
    })
  },
  RegionChange: function (e) {
    this.setData({
      region: e.detail.value,
      ['address.province']: e.detail.value[0],
      ['address.city']: e.detail.value[1],
      ['address.county']: e.detail.value[2]
    })
  },
  //弹出添加地址
  tapAddAddress() {
    that.setData({
      addModel: true
    })
  },
  //关闭添加地址
  hideAddShowModal() {
    that.setData({
      addModel: false
    })
  },
  //确认添加
  conformAdd() {
    let payload = that.data.address;
    app.utils.cl(payload);
    app.dbbase.add('shoppingAddress', payload).then(res => {
      app.utils.cl(res);
      that.hideAddShowModal()
      app.utils.hint('添加成功！');
      that.initData()
    })
  },
  switchChange(e) {
    app.utils.cl(e.detail.value);
    that.setData({
      ['address.default']: e.detail.value
    })
    app.utils.cl(that.data.address);
  }

})