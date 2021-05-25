// miniprogram/pages/mine/shop/shop.js
var QQMapWX = require('../../../plugins/qqmap-wx-jssdk.min');
var qqmapsdk;
const app = getApp()


Page({

 that(){
    return this
  },

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
      _id: null,
      address: null,
      province: null,
      city: null,
      county: null,
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
    productTypeList: [],
    addProductType: {}
  },
  change(e) {
    app.change(e, this)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options){
    let that = this


    //接收参数
    if (options.id) {
      that.setData({
        ['entity._id']: options.id
      })
      await this.initData()
      app.utils.cl('判断是否已经有地址');
      if(this.data.entity.province==null){
        //获取位置
        app.utils.cl('获取位置');
      this.getLocation()
      }
    } 

  },
  initData() {
    app.utils.cl('初始化');
    
    let that = this
    let id = this.data.entity._id
    return new Promise((success) => {
      //查询产品类型
      this.geProductTypeList()
      app.dbbase.query('shop', id).then(res => {
        app.utils.cl(res, '输出')
        if (res.data.length != 0) {
          that.setData({
            entity: res.data[0],
            region:[res.data[0].province,res.data[0].city,res.data[0].county]
          })
          success()
        }
      })
    });

  },
  geProductTypeList(){
    let that=this
    let openid=app.globalData.openid
    app.dbbase.queryOpenId('productType', openid).then(res => {
      app.utils.cl(res, '输出')
      if (res.data.length != 0) {
        that.setData({
          productTypeList: res.data,
        })
      }
    })
  },

  getLocation() {
    let that = this
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
              ['entity.province']:province,
              ['entity.city']:city,
              ['entity.county']:district,
              ['entity.address']: res.result.address_reference.landmark_l2.title
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
    let that=this
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
            //上传头像
    //从全局获取七牛云授权token
    let token = app.globalData.qiniuToken
        app.utils.cl(res.tempFilePaths[0], '店铺头像')
        app.utils.upload(res.tempFilePaths[0], token).then((re) => {
          that.setData({
            ['entity.shopImage']: re.fileURL
          })
        })

          
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
    let that=this
    wx.showModal({
      title: '给你一次后悔的机会',
      content: '人家这么可爱，确定要删除吗？',
      cancelText: '不要',
      confirmColor: 'green',
      confirmColor: 'red',
      confirmText: '拜拜~',
      success: res => {
        if (res.confirm) {
          app.utils.qiniuDelete(that.data.entity.shopImage).then(res=>{
            app.utils.cl(res);
            
            that.setData({
              ['entity.shopImage']: null
            })
          })
        }
      }
    })
  },
  tapShopManage() {

    let that = this

    let temp = this.data.entity
    let region = this.data.region
    //把省市区分开赋值
    temp.province = region[0]
    temp.city = region[1]
    temp.county = region[2]
    //获取修改id
    let id = that.data.entity._id

    app.utils.cl(temp);
    //提交数据
    wx.showLoading({
      title: '装修中，请等待',
    })

    
      //修改数据
      let regions=this.data.region
      temp.province=regions[0];
      temp.city=regions[1];
      temp.county=regions[2];
      app.utils.cl(temp,'输出修改数据');
      
      app.dbbase.update('shop', id, temp).then(res => {
        wx.hideLoading({
          success: (res) => {
            wx.navigateTo({
              url: '../../shopManagement/shopManagement',
            })
          },
        })
      });
    if (this.data.save) {
      wx.navigateTo({
        url: '../../shopManagement/shopManagement?id=' + this.data.entity._id,
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
      addProductType: null,
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
    let that = this
    app.utils.cl(value);
    app.utils.cl(value.currentTarget.dataset.index);
    let index = value.currentTarget.dataset.index
    let temp = that.data.productTypeList;
    let id=value.currentTarget.dataset.id
    temp = JSON.parse(JSON.stringify(temp))

    wx.showModal({
      title: '给你一次后悔的机会',
      content: '人家这么可爱，确定要删除吗？',
      cancelColor: 'green',
      confirmColor: 'red',
      success: function (e) {
        if (e.confirm) {
          // temp.splice(index, 1)
          // that.setData({
          //   productTypeList: temp
          // })
          app.dbbase.delete('productType',id).then(res=>{
            //app.utils.cl(res);
            app.utils.hint('删掉了，拜拜~')
            that.geProductTypeList();
          })
         
        }

      }
    })
  },
  conformAdd() {
    let that = this
    var tempProductType = this.data.addProductType;
    //转换为json格式，必须的，不然会报错
    // tempProductType = JSON.parse(JSON.stringify(tempProductType))
    // app.utils.cl(tempProductType);
    // var list = this.data.productTypeList;
    // list = JSON.parse(JSON.stringify(list))
    // var temp = [...list, tempProductType];
    // this.setData({
    //   productTypeList: temp
    // })

    app.utils.cl(this.data.addProductType);

    //添加分类
    let payload = {
      name: that.data.addProductType.name,
      shopId: that.data.entity._id
    }
    app.dbbase.add('productType', payload).then(res => {
      that.geProductTypeList()
      that.hideAddShowModal()
      app.utils.hint('添加成功！')

    })
    
  },
  startTimeChange(e) {
    app.utils.cl(e)
    this.setData({
      startTime: e.detail.value,
      ['entity.startTime']:e.detail.value
    })
  },
  endTimeChange(e) {
    app.utils.cl(e)
    this.setData({
      endTime: e.detail.value,
      ['entity.endTime']:e.detail.value
    })
  },
  RegionChange(e){
    app.utils.cl(e);
    let that =this;
    that.setData({
      ['entity.province']:e.detail.value[0],
      ['entity.city']:e.detail.value[1],
      ['entity.county']:e.detail.value[2],
      region:e.detail.value
    })
    
  },
})