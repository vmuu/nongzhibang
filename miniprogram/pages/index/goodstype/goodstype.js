// miniprogram/pages/index/goods/goods.js
import db from '../../../config/dbbase.js';
import utils from '../../../config/utils.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //商家对象
    Produck:[],
    //触底时的提示
    loadMoreText:"加载中.....",
    //是否显示触底提示
    showLoadMore:false,
    //从哪开始查询
    max:0,
    //一次性查几条数据
    limit:10,
    //触底时是否继续请求数据库
    theOnReachBottom:true,
    //页面名称
    tablename:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
        tablename:options.name,
        tableid:options.id
    })
    //第一次数据加载
    db.productwherelist(this.data.tableid,this.data.max,this.data.limit).then((res)=>{
      this.setData({
        Produck:res.data,
        max:this.data.limit
      })
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
    //是否继续加载数据？
    if(this.data.theOnReachBottom){
      //当数据库里还有商家时，继续请求数据库
      setTimeout(() => {
        this.setListData();
      }, 300);
    }
    else{
      //当数据库里没有商家时，停止请求数据库，并弹出提示
      this.setData({
        loadMoreText:"没有更多店铺了!",
        showLoadMore:true,
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
   /**
   * 请求商家数据
   */
  setListData() {
    db.productwherelist(this.data.tableid,this.data.max,this.data.limit).then((res)=>{
      //当数据库里商家加载完毕之后停止请求数据库
      if(res.data.length==0){
        this.setData({
          loadMoreText:"没有更多店铺了!",
          showLoadMore:true,
          theOnReachBottom:false
        })
        app.utils.hint('没有更多店铺了!');
      }
      //当数据库里还有商家数据时，继续追加到本地数据
      else{
        this.setData({
          Produck:this.data.Produck.concat(res.data),
          max:this.data.max+this.data.limit
        })
      }
    })
  },
  /**
   * 商品下单页面跳转
   */
  tapProduct(e){
    wx.navigateTo({
      url: '../../productDetails/productDetails?id='+e.currentTarget.dataset.id,
    })
  }
})