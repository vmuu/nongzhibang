// miniprogram/pages/mine/admin/admin.js
const app = getApp()
var that;
var openid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //管理员列表
    adminList: [],
    modalName: null,
    formData: {},
    index: 0,
    showLoad: false,
    //下拉列表权限列表
    accountList: [],
    //下拉列表索引
    indexPicker: 0,
    //角色列表
    roleList: [],
    addAdminId: null
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
    openid = app.globalData.openid
  },
  initData() {
    that.getAdminList()
    that.getRoleList()
  },
  //查询所有有权限的用户
  getAdminList() {
    const db = wx.cloud.database()
    app.dbbase.queryWhere('user', {
      authority: db.command.gt(0)
    }).then(res => {
      app.utils.cl('管理员列表', res.data);
      that.setData({
        adminList: res.data
      })
    })

  },
  getRoleList() {
    //绑定下拉列表管理员列表accountList
    app.dbbase.queryAll('role').then(res => {
      app.utils.cl('role', res.data);

      that.setData({
        roleList: res.data
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
  tapUpdate(e) {
    //获取点击的下标
    app.utils.cl(e);
    let index = e.currentTarget.dataset.index;
    app.utils.cl(that.data.adminList[index]);
    let admin = that.data.adminList[index]
    let indexPicker = that.data.adminList[index].authority
    //比对自己是否有权修改其他人的权限
    if(!that.compare(admin)){
      return false;
  }
    that.setData({
      modalName: 'modalUpdate',
      formData: admin,
      index: index,
      indexPicker: parseInt(indexPicker) - 1
    })
  },
  PickerChange(e) {
    console.log(e);
    this.setData({
      indexPicker: e.detail.value
    })
  },
  tapDelete(e) {

    app.utils.cl(e);
    let indexPicker = that.data.indexPicker
    let authority = that.data.adminList[e.currentTarget.dataset.index]
    //比对自己是否有权修改其他人的权限
    if(!that.compare(authority)){
        return false;
    }
    

    that.setData({
      showLoad: true
    })
    let data = {
      authorityId: null,
      authority: 0
    }
    app.dbbase.update('user', authority._id, data).then(res => {
      app.utils.cl(res);
      that.initData()
      that.setData({
        showLoad: false
      })
      app.utils.hint('操作成功');
    })

  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  hideConFrimModal(e) {
    that.setData({
      modalName: null,
      showLoad: true
    })
    let id = that.data.formData._id
    app.utils.cl(id);
    app.utils.cl("that.data.index" + that.data.indexPicker);
    app.utils.cl(that.data.adminList[that.data.indexPicker]);
    app.utils.cl(that.data.adminList);
    
    let data = {
      authorityId: that.data.roleList[that.data.indexPicker]._id,
      authority: parseInt(that.data.indexPicker) + 1
    }
    app.utils.cl(data);
    app.dbbase.update('user', id, data).then(res => {
      app.utils.cl(res);

      that.initData()

      that.setData({
        showLoad: false
      })
      app.utils.hint('操作成功');
    })
  },
  getMyRole() {
    let authority = null;
    for (let i = 0; i < that.data.adminList.length; i++) {
      if (that.data.adminList[i]._openid == openid) {
        authority = that.data.adminList[i].authority;
      }
    }
    return authority;
  },
  //判断是否有权修改
  compare(authority) {
    let myCode = that.getMyRole();
    if (myCode >= authority.authority) {
      app.utils.hint('您无权操作该用户');
      return false;
    }
    return true;
  },
  tapAddAdmin() {
    that.setData({
      modalName: 'modalAdd'
    })
  },
  hideConfirmAdd() {
    app.utils.cl(that.data.addAdminId);
    let adminId = that.data.formData._id;
    if (app.utils.isEmpty(adminId)) {
      app.utils.hint('ID不能为空');
      return
    }
    if (adminId.length != 32) {
      app.utils.hint('管理员ID格式不正确');
      return
    }
    that.hideConFrimModal();
  }
})