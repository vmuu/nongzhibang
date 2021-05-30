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
      default: true
    },
    addressList: [],
    isUpdate: false,
    productId: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.state()
    app.utils.cl(options);
    if (options.id) {
      that.setData({
        productId: options.id
      })
    }

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
        addressList: res.data
      })
      app.utils.cl(that.data.addressList);
    })
  },

  /**
   * 删除地址
   */
  tapDelete(e) {
    let id = e.currentTarget.dataset.id;
    app.utils.cl(e);
    wx.showModal({
      title: '删除提示',
      content: '人家这么可爱，确定要人家嘛~',
      cancelColor: "#07c160",
      success: (res) => {
        if (res.confirm) {
          app.dbbase.delete('shoppingAddress', id).then(res => {
            app.utils.hint('删除成功');
            that.initData()
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
    if (!that.data.isUpdate) {
      let isDefault=false;
      if(that.data.addressList.length==0){
        isDefault=true
      }
      that.setData({
        address: {
          province: '云南省',
          city: '昆明市',
          county: '五华区',
          default: isDefault
        },
        addModel: true
      })
      return
    }
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
  //确认添加/修改
  async conformAdd() {
    let payload = that.data.address;
    app.utils.cl(payload);
    let id = that.data.address._id;
    //判断是否把当前位置设置为默认地址
    if (that.data.address.default) {
      //是
      //先清除其他的默认地址，传入当前需要设置
      await that.setAllDefaulFalse()
    }
    if (that.data.isUpdate) {
      app.dbbase.update('shoppingAddress', id, payload).then(res => {
        app.utils.cl(res);
        that.hideAddShowModal()
        app.utils.hint('修改成功');
        that.initData()
      })
      that.setData({
        isUpdate: false
      })
      return
    }
    app.dbbase.add('shoppingAddress', payload).then(res => {
      app.utils.cl(res);
      that.hideAddShowModal()
      app.utils.hint('添加成功');
      that.initData()
    })
  },
  switchChange(e) {
    app.utils.cl(e.detail.value);
    app.utils.cl('asdf');
    
    if(that.data.addressList.length<=1){
      app.utils.hint('至少一个默认地址');
      that.setData({
        ['address.default']:true
      })
      return false
    }
    that.setData({
      ['address.default']: e.detail.value
    })
    app.utils.cl(that.data.address);
  },
  tapEditAddres(e) {
    app.utils.cl('修改');
    let item = e.currentTarget.dataset.item;
    app.utils.cl(e);
    that.setData({
      addModel: true,
      address: item,
      isUpdate: true
    })
  },
  tapSetDefault(e) {
    app.utils.cl(e);
    let id = e.currentTarget.dataset.id
    let updatePayload = {
      default: true
    }
    //先把所有收货地址修改为不是默认
    that.setAllDefaulFalse().then(res => {
      //把当前点击的地址设置为默认
      app.dbbase.update('shoppingAddress', id, updatePayload).then(res => {
        app.utils.cl(res);
        that.hideAddShowModal()
        app.utils.hint('修改成功');
        that.initData()
      })
    })

  },
  setAllDefaulFalse() {

    // app.utils.cl(where);
    //先把所有收货地址修改为不是默认
    return new Promise((success) => {
      let where = {
        _openid: openid
      }
      let payload = {
        default: false
      }
      app.dbbase.updateWhere('shoppingAddress', where, payload).then(res => {
        app.utils.cl('修改所有地址为false');
        app.utils.cl(res);
        return success(res)
      })
    })

  },
  tapSelectThis(e) {
    app.utils.cl(e);
    let addressId=e.currentTarget.dataset.id
    if (that.data.productId) {
      wx.redirectTo({
        url: '../../confirmOrder/confirmOrder?id='+that.data.productId+'&addressId='+addressId,
      })
    }
  }

})