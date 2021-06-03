// miniprogram/pages/mine/admin/admin.js
const app = getApp()
var that;
var openid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopList: [],
    modalName: false,
    formData: {},
    picker: ['提交资料', '开店中', '提交审核', '审核未通过'],
    index: 0,
    showLoad:false,
    user:null,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.state()
    that.initData()
  },
  change(e) {
    app.change(e, this);
  },
  state() {
    that = this;
    openid=app.globalData.openid;
    },
  initData() {
    that.getShopList();
    that.getUser();
  },
  //查询所有店铺
  getShopList() {
    app.dbbase.queryAll('shop').then(res => {
      app.utils.cl('店铺列表', res);
      that.setData({
        shopList: res.data
      })
    })
  },
  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
  getUser(){
    app.dbbase.queryOpenId('user',openid).then(res=>{
      app.utils.cl(res);
      that.setData({
        user:res.data[0]
      })
    })
  },
  tapUpdate(e) {
    //获取点击的下标
    app.utils.cl(e);
    let index = e.currentTarget.dataset.index;
    app.utils.cl(that.data.shopList[index]);
    let shop = that.data.shopList[index]
    that.setData({
      modalName: true,
      formData: shop,
      index: shop.isShop
    })
  },
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
  },
  tapDelete(e) {
    app.utils.cl(e);
    
    
    let id=e.currentTarget.dataset.id;
    //app.utils.hint('该功能暂不支持！');
    wx.showModal({
      title:'删除提醒',
      content:'你确定要删除该店铺？',
      success(re){
        if(re.confirm){
          that.deleteShop(id)
        }
      }
    })
  },
  hideModal(e){
    this.setData({
      modalName: false
    })
  },
  hideConFrimModal(e) {
    that.setData({
      showLoad:true
    })
    let id = that.data.formData._id
    app.utils.cl(id);
    let data={
      isShop:that.data.index
    }
    app.dbbase.update('shop', id,data).then(res => {
      app.utils.cl(res);
      app.utils.hint('操作成功');
      that.initData()
      this.setData({
        modalName: false
      })
      that.setData({
        showLoad:false
      })
    })
  },
  deleteShop(id=null){
    if(app.utils.isEmpty(id)){
      app.utils.cl('id不能空');
      return;
    }
    //判断是否有删除权限
    if(that.data.user.authority!=1){
      app.utils.hint('您无权操作');
      
      return;
    }
    let data={
      isShop:-1
    }
    app.dbbase.update('shop',id,data).then(res=>{
        app.utils.hint('操作成功');   
        that.initData()     
    })
  },
})