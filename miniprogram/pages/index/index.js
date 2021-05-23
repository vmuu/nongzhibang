
import db from '../../config/dbbase.js';
import utils from '../../config/utils.js';

const app = getApp();
Page({
  data: {
    //胶囊按钮高度
    capsuleHeight:0,
    // 滚动图的
    cardCur: 0,
    value:'',
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'http://cdn.xiaoxingbobo.top/nongzhibang/202145/1125271620185127484'
    }, {
      id: 1,
        type: 'image',
        url: 'http://cdn.xiaoxingbobo.top/nongzhibang/202145/1126161620185176238',
    }, {
      id: 2,
      type: 'image',
      url: 'http://cdn.xiaoxingbobo.top/nongzhibang/202145/1126421620185202773'
    }, {
      id: 3,
      type: 'image',
      url: 'http://cdn.xiaoxingbobo.top/nongzhibang/202145/127171620187637650'
    }, {
      id: 4,
      type: 'image',
      url: 'http://cdn.xiaoxingbobo.top/nongzhibang/202145/123681620189368172'
    }],
    //搜索框style
    CustomBar: app.globalData.CustomBar,
    //自定义头部的
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    // 选择校区
    picker: ['茭菱校区', '小哨校区'],
    index:null,
    //推荐店铺列表
    shop:[],
    //热门商品列表
    hotproduct:[],
    //全部商品列表
    hotProductlist:[],
    //触底时的提示
    loadMoreText:"加载中.....",
    //是否显示触底提示
    showLoadMore:false,
    //从哪开始查询
    max:0,
    //一次性查几条数据
    limit:8,
    //触底时是否继续请求数据库
    theOnReachBottom:true
  },

  // input输入事件
  doInput(e){
    
    wx.navigateTo({
      url: '../search/search',
      })
 },
  onLoad: function () {
    //推荐店铺
    db.indexProductOrShop().then((res)=>{
      app.utils.cl(res.result.list);
      this.setData({
        shop:res.result.list
      })
    })
    //热门商品与全部商品首次加载
    db.productlist(this.data.max,this.data.limit).then((res)=>{
      this.setData({
        hotproduct:res.data,
        hotProductlist:res.data,
        index:res.data.length,
        //初始化后从第几个开始加载
        max:this.data.limit
      })
    })
    this.setData({
      capsuleHeight:wx.getMenuButtonBoundingClientRect().height  // 胶囊高度
    })
    this.setData({
      msgList: [
        { title: '你有一笔奖励待发放' },
        { title: '1.8元津贴到账，快点去打车吧' },
        { title: '单单八折赢iPhone，一路迎春“发”' }
      ],
      // 下拉列表
      option1: [
        { text: '综合排序', value: 0 },
        { text: '营业状态', value: 1 },
        { text: '单量排序', value: 2 },
        { text: '优惠活动', value: 3 }
      ],
      value1: 0,
      // 商家标题
      imageURL:"https://img01.yzcdn.cn/vant/ipad.jpeg",
    })
    
  },
  //轮播图切换放大
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  //触发结束选择
  tEnd() {
    this.setData({
      hidden: true,
      listCurID: this.data.listCur
    })
  },
  //校区选择
  selectSchool(e){
    app.utils.cl(e);
      this.setData({
        index: e.detail.value
      })
  },
  indexSelect(e) {
    let that = this;
    let barHeight = this.data.barHeight;
    let list = this.data.list;
    let scrollY = Math.ceil(list.length * e.detail.y / barHeight);
    for (let i = 0; i < list.length; i++) {
      if (scrollY < i + 1) {
        that.setData({
          listCur: list[i],
          movableY: i * 20
        })
        return false
      }
    }
  },
  focuseSearch(){
    
  },
  // 按钮的点击事件
  enterDeliciousFood(e){
    app.utils.cl(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: 'goods/goods'
    })
    wx.showToast({
      title: '当前按钮ID：'+e.currentTarget.dataset.id,
    })
  },
  //跳转到商家界面
  tapShop(e){
    wx.navigateTo({
      url: '../shopManagement/shopManagement?id='+e.currentTarget.dataset.id,
    })
  },
  // 更多商品
  more_merchants(e){
    wx.navigateTo({
      url: 'merchants/merchants'
    })
  },
  more_goods(e){
    wx.navigateTo({
      url: 'goods/goods'
    })
  },
  //热门菜品连接
  hotproduct(e){
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../details/details?id='+e.currentTarget.dataset.id,
    })
  },
  
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //是否继续加载数据？
    if(this.data.theOnReachBottom){
      //当数据库里还有商品时，继续请求数据库
      setTimeout(() => {
        this.setListData();
      }, 300);
    }
    else{
      //当数据库里没有商品时，停止请求数据库，并弹出提示
      this.setData({
        loadMoreText:"没有更多商品了!",
        showLoadMore:true,
      })
    }
  },
  /**
  * 请求商品数据
  */
 setListData() {
   db.productlist(this.data.max,this.data.limit).then((res)=>{
     //当数据库里商品加载完毕之后停止请求数据库
     if(res.data.length==0){
       this.setData({
         loadMoreText:"没有更多商品了!",
         showLoadMore:true,
         theOnReachBottom:false
       })
       app.utils.hint('没有更多商品了!');
     }
     //当数据库里还有商品数据时，继续追加到本地数据
     else{
       this.setData({
         hotProductlist:this.data.hotProductlist.concat(res.data),
         max:this.data.max+this.data.limit
       })
     }
   })
 },
});

// 全部商家
