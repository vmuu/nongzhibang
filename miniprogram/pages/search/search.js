const {
  default: dbbase
} = require("../../config/dbbase");
var that
//引入插件：微信同声传译
const plugin = requirePlugin('WechatSI');
//获取全局唯一的语音识别管理器recordRecoManager
const manager = plugin.getRecordRecognitionManager();
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //胶囊按钮高度
    capsuleHeight: 0,
    //语音
    recordState: false, //录音状态
    content: '', //内容
    cache: '', //缓存语音文字
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    keyboardHeight: -100,
    //商品信息
    product: [],
    //从哪开始查询
    max: 3,
    //一次性查几条数据
    limit: 5,
    // 需要条追的商品
    hotproduct: [],
    //搜索后显示的文字
    isSearch: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    //识别语音
    this.initRecord();
    this.setData({
        capsuleHeight: wx.getMenuButtonBoundingClientRect().height // 胶囊高度
      }),
      //查询商品
      app.dbbase.queryProduct(this.data.max, this.data.limit).then((res) => {
        this.setData({
          product: res.data,
          max: this.data.limit,
        })
      })
  },
  //搜索后
  searchName(e) {
    app.utils.cl(e);
    let value = e.detail.value
    that.searchValue(value);

  },
  searchValue(value) {
    app.dbbase.queryFuzzy('product', value).then(res => {
      that.setData({
        product: res.data,
        max: this.data.limit,
        isSearch: false
      })
    })
  },
  //菜品连接
  hotproduct(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../productDetails/productDetails?id=' + e.currentTarget.dataset.id,
    })
  },
  // 手动输入内容
  conInput: function (e) {
    this.setData({
      content: e.detail.value,
    })
  },
  //识别语音 -- 初始化
  initRecord: function () {
    const that = this;
    // 有新的识别内容返回，则会调用此事件
    manager.onRecognize = function (res) {
      app.utils.cl(res)
    }
    // 正常开始录音识别时会调用此事件
    manager.onStart = function (res) {
      console.log("成功开始录音识别", res)
    }
    // 识别错误事件
    manager.onError = function (res) {
      console.error("error msg", res)
    }
    //识别结束事件
    manager.onStop = function (res) {
      app.utils.cl('录音', res);

      console.log('..............结束录音')
      console.log('录音临时文件地址 -->' + res.tempFilePath);
      console.log('录音总时长 -->' + res.duration + 'ms');
      console.log('文件大小 --> ' + res.fileSize + 'B');
      console.log('语音内容 --> ' + res.result);
      if (res.result == '') {
        wx.showModal({
          title: '提示',
          content: '听不清楚，请重新说一遍！',
          showCancel: false,
          success: function (res) {}
        })
        return;
      }
      let text = res.result;
      //处理内容,把所有标点符号替换为""空
      let reg=/[，| 。]/g
      let re = text.replace(reg, "")
      app.utils.cl('输出结果', re);

      that.setData({
        content: re
      })
      that.searchValue(re);
    }
  },
  //语音  --按住说话
  touchStart: function (e) {
    // this.setData({
    //   recordState: true  //录音状态
    // })
    // 语音开始识别
    wx.showLoading({
      title: '录音中',
    })
    manager.start({
      lang: 'zh_CN', // 识别的语言，目前支持zh_CN en_US zh_HK sichuanhua
    })
  },
  //语音  --松开结束
  touchEnd: function (e) {
    wx.hideLoading({
      success: (res) => {},
    })
    // this.setData({
    //   recordState: false
    // })
    // 语音结束识别
    manager.stop();
  },
  BackPage() {
    wx.navigateBack({
      delta: 1,
    })
  },
  focusInput(e) {
    app.utils.cl(e)
    this.setData({
      keyboardHeight: e.detail.height
    })
  },
  blurInput() {
    this.setData({
      keyboardHeight: -200
    })
  }



})