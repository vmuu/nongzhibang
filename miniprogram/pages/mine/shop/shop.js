// miniprogram/pages/mine/shop/shop.js
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
    endTime:'22:00',
    save:false,
    id:'cbddf0af60924b600676347b2e4cb19c',
    entity:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

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
      confirmColor:'green',
      confirmColor:'red',
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
    
    if(this.data.save){
      wx.navigateTo({
        url: '../../shopManagement/shopManagement?id='+this.data.id,
      })
    }else{
      this.setData({
        save:true
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
  tapDelete() {
    wx.showModal({
      title: '给你一次后悔的机会',
      content: '人家这么可爱，确定要删除吗？',
      cancelColor: 'green',
      confirmColor: 'red',
      success: function () {
       app.utils.hint('删掉了，拜拜~')
      }
    })
  },
  conformAdd(){
    app.utils.hint('添加成功！')
    this.hideAddShowModal()
  },
  startTimeChange(e){
    app.utils.cl(e)
    this.setData({
      startTime:e.detail.value
    })
  },
  endTimeChange(e){
    app.utils.cl(e)
    this.setData({
      endTime:e.detail.value
    })
  }
})