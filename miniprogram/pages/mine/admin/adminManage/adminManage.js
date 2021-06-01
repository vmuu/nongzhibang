// miniprogram/pages/mine/admin/admin.js
const app = getApp()
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //管理员列表
    adminList: [],
    modalName: false,
    formData: {},
    index: 0,
    showLoad:false,
    //下拉列表权限列表
    accountList:[],
    //下拉列表索引
    indexPicker:0
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
    that = this
  },
  initData() {
    that.getShopList()
  },
  //查询所有有权限的用户
  getShopList() {
    const db = wx.cloud.database()
    app.dbbase.queryWhere('user',{
      authority:db.command.gt(1)
    }).then(res => {
      app.utils.cl('管理员列表', res.data);
      that.setData({
        adminList: res.data
      })
    })
    //绑定下拉列表管理员列表accountList
    app.dbbase.queryAll('admin').then(res=>{
      for (let i = 0; i < res.data.length; i++) {
        this.setData({
          //将管理员的系统名称和中文名称绑定到下拉列表
          accountList:this.data.accountList.concat(
            (res.data[i].accountNumber+" "+
            (res.data[i].authority==3?'超级管理员':(res.data[i].authority==2?'高级管理员':'普通管理员')))
            )
        })
      }
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
  tapUpdate(e) {
    //获取点击的下标
    app.utils.cl(e);
    let index = e.currentTarget.dataset.index;
    app.utils.cl(that.data.adminList[index]);
    let admin = that.data.adminList[index]
    that.setData({
      modalName: true,
      formData: admin,
      index: admin.isShop,
    })
  },
  PickerChange(e) {
    console.log(e);
    this.setData({
      indexPicker: e.detail.value
    })
  },
  tapDelete() {
    app.utils.hint('该功能暂不支持！');
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
})