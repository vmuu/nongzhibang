import db from '../../config/dbbase.js';
import utils from '../../config/utils.js';
var that;

const app = getApp();
Page({
  data: {
    //胶囊按钮高度
    capsuleHeight: 0,
    // 滚动图的
    cardCur: 0,
    value: '',
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
    selectSchoolIndex: 0,
    index: null,
    //按钮的文字和图片
    shopType: [],
    //推荐店铺列表
    shop: [],
    //热门商品列表
    hotproduct: [],
    //全部商品列表
    hotProductlist: [],
    //触底时的提示
    loadMoreText: "加载中.....",
    //是否显示触底提示
    showLoadMore: false,
    showLoad: app.globalData.showLoad,
    //从哪开始查询
    max: 0,
    //一次性查几条数据
    limit: 8,
    //触底时是否继续请求数据库
    theOnReachBottom: true,
    noticeHeight: 0

  },
  initData() {
    return new Promise(success => {
      //首页按钮和图片
      app.dbbase.queryselect('shopType').then(res => {
          app.utils.cl(res);
          this.setData({
            shopType: res.data
          })
          app.utils.cl(this.data.shopType);

        }),
        //推荐店铺
        db.indexProductOrShop().then((res) => {
          app.utils.cl(res.result.list);
          this.setData({
            shop: res.result.list
          })
        })
      //热门商品与全部商品首次加载
      db.productlist(this.data.max, this.data.limit).then((res) => {
        success()
        this.setData({
          hotproduct: res.data,
          hotProductlist: res.data,
          index: res.data.length,
          //初始化后从第几个开始加载
          max: this.data.limit
        })
      })

    })

  },

  // input输入事件
  doInput(e) {

    wx.navigateTo({
      url: '../search/search',
    })
  },
  state() {
    that = this
  },
  async onLoad() {
    this.state()
    await this.initData()

    //获取公告栏的高度
    let query = wx.createSelectorQuery();
    query.select('.notice').boundingClientRect(rect => {
      let height = rect.height;
      this.setData({
        noticeHeight: rect.height
      })
    }).exec();
    this.setData({
      capsuleHeight: wx.getMenuButtonBoundingClientRect().height // 胶囊高度
    })
    this.setData({
      msgList: [{
          title: '欢迎使用农职帮服务平台'
        },
        {
          title: '全场配送免费'
        },
        {
          title: '业务合作请到我的联系我们'
        }
      ],
      // 下拉列表
      option1: [{
          text: '综合排序',
          value: 0
        },
        {
          text: '营业状态',
          value: 1
        },
        {
          text: '单量排序',
          value: 2
        },
        {
          text: '优惠活动',
          value: 3
        }
      ],
      value1: 0,
      // 商家标题
      imageURL: "https://img01.yzcdn.cn/vant/ipad.jpeg",
    })


  },
  onReady() {
    app.globalData.showLoad = false;
    that.setData({
      showLoad: false
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
  selectSchool(e) {
    app.utils.cl(e);
    this.setData({
      selectSchoolIndex: e.detail.value
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
  focuseSearch() {

  },
  // 按钮的点击事件
  enterDeliciousFood(e) {
    app.utils.cl(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: 'goodstype/goodstype?id=' + e.currentTarget.dataset.id + '&name=' + e.currentTarget.dataset.name
    })
  },
  //跳转到商家界面
  tapShop(e) {
    wx.navigateTo({
      url: '../product/product?id=' + e.currentTarget.dataset.id,
    })
  },
  // 更多商品
  more_merchants(e) {
    wx.navigateTo({
      url: 'merchants/merchants'
    })
  },
  more_goods(e) {
    wx.navigateTo({
      url: 'goods/goods'
    })
  },
  //热门菜品连接
  hotproduct(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../productDetails/productDetails?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //是否继续加载数据？
    if (this.data.theOnReachBottom) {
      this.setData({
        showLoad:true
      })
      //当数据库里还有商品时，继续请求数据库
      setTimeout(() => {
        this.setListData();
      }, 300);
    } else {
      //当数据库里没有商品时，停止请求数据库，并弹出提示
      this.setData({
        loadMoreText: "没有更多商品了!",
        showLoadMore: true,
      })
    }
  },
  /**
   * 请求商品数据
   */
  setListData() {
    db.productlist(this.data.max, this.data.limit).then((res) => {
      //当数据库里商品加载完毕之后停止请求数据库
      if (res.data.length == 0) {
        this.setData({
          loadMoreText: "没有更多商品了!",
          showLoadMore: true,
          theOnReachBottom: false
        })
        app.utils.hint('没有更多商品了!');
      }
      //当数据库里还有商品数据时，继续追加到本地数据
      else {
        this.setData({
          hotProductlist: this.data.hotProductlist.concat(res.data),
          max: this.data.max + this.data.limit
        })
      }
    })
    this.setData({
      showLoad:false
    })
  },
  tapNotice() {
    app.utils.cl('查看公告');
  }
});

// 全部商家