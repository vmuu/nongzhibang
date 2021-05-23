// miniprogram/pages/mine/shop/shop.js
var QQMapWX = require('../../../plugins/qqmap-wx-jssdk.min');
var qqmapsdk;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['云南省', '昆明市', '五华区'],
    modalName: null,
    textareaBValue: null,
    imgList: [],
    startTime: '08:00',
    endTime: '22:00',
    save: false,
    id: 'cbddf0af60924b600676347b2e4cb19c',
    entity: {
      address: null,
      location: null,
      salesVolume: null,
      shopAnnouncement: null,
      shopBackground: null,
      shopDescribe: null,
      shopImage: null,
      shopName: null,
      startTime: '08:00',
      endTime: '22:00',
    },
    latitude: "",
    longitude: "",
    address: "",
    productTypeList:[],
    addProductType:{
      name:null
    }
  },
  change(e) {
    app.change(e, this)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'YBCBZ-TD4KF-PVYJ3-J7EXP-ZGOA6-TWBVH'
    }); //获取当前的地理位置、速度
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      isHighAccuracy: true,
      success: function (res) {
        app.utils.cl(res);

        //赋值经纬度
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
            app.utils.cl("解析地址成功");
            // 省
            let province = res.result.ad_info.province;
            // 市
            let city = res.result.ad_info.city;
            // 区
            let district = res.result.ad_info.district;

            that.setData({
              region: [province, city, district],
              ['entity.location']: res.result.address_reference.landmark_l2.title
            })
          },
          fail: function (res) {
            wx.showToast({
              title: '定位失败',
              duration: 2000,
              icon: "none"
            })
            console.log(res);
          },
          complete: function (res) {
            console.log(res);
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  tapPrevious() {
    wx.navigateBack({
      delta: 1,
    })
  },
  textareaBInput(e) {
    this.setData({
      textareaBValue: e.detail.value
    })
  },
  ChooseImage() {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '给你一次后悔的机会',
      content: '人家这么可爱，确定要删除吗？',
      cancelText: '不要',
      confirmColor: 'green',
      confirmColor: 'red',
      confirmText: '拜拜~',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  tapShopManage() {

app.utils.cl(this.data.entity);


    return

    if (this.data.save) {
      wx.navigateTo({
        url: '../../shopManagement/shopManagement?id=' + this.data.id,
      })
    } else {
      this.setData({
        save: true
      })
    }

  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  tapAddShowModel(e) {
    this.setData({
      addModel: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  hideAddShowModal() {
    this.setData({
      addModel: null
    })
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  tapDelete(value) {
    let that=this
    app.utils.cl(value);
    app.utils.cl(value.currentTarget.dataset.index);
    let index=value.currentTarget.dataset.index
    
    wx.showModal({
      title: '给你一次后悔的机会',
      content: '人家这么可爱，确定要删除吗？',
      cancelColor: 'green',
      confirmColor: 'red',
      success: function () {
        that.setData({
          productTypeList:that.data.productTypeList.splice(index,1)
        })
        app.utils.hint('删掉了，拜拜~')
      }
    })
  },
  conformAdd() {
    let that=this
    this.setData({
      productTypeList:that.data.productTypeList.concat(that.data.addProductType)
    })
    app.utils.hint('添加成功！')
    this.hideAddShowModal()
  },
  startTimeChange(e) {
    app.utils.cl(e)
    this.setData({
      startTime: e.detail.value
    })
  },
  endTimeChange(e) {
    app.utils.cl(e)
    this.setData({
      endTime: e.detail.value
    })
  }
})