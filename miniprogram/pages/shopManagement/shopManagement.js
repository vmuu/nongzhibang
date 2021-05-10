import dbbase from '../../config/dbbase.js';
// const { default: dbbase } = require("../../config/dbbase");
import db from '../../config/dbbase.js'
import utils from '../../config/utils.js';

const app = getApp();
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    MainCur: 0,
    heighttop:(app.globalData.StatusBar)+40,
    VerticalNavTop: 0,
    //商品对象图片索引
    imgList: [],
    index_x: null,
    checkbox: [{
      value: 0,
      name: '10元',
      checked: false,
      hot: false,
    }, {
      value: 1,
      name: '20元',
      checked: true,
      hot: false,
    }, {
      value: 2,
      name: '30元',
      checked: true,
      hot: true,
    }, {
      value: 3,
      name: '60元',
      checked: false,
      hot: true,
    }, {
      value: 4,
      name: '80元',
      checked: false,
      hot: false,
    }, {
      value: 5,
      name: '100元',
      checked: false,
      hot: false,
    }],
    list: [],
    load: true,
    //商品分类
    commodityType:[],
    //商店
    shop:[],
    //商品对象
    product:[],
    //下拉列表索引
    indexPicker: null,
    //下拉列表数据
    picker: [],
  },
  
  onLoad(shop) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    //调用封装的多表（2表）联查函数
    db.looKupTwo("test",shop.id,"productType","product","_id","commodityTypeId","commodity").then((res)=>{
      /*console.log(res.result.list);*/
      this.setData({
        commodityType:res.result.list
      })
    })
    
    
    //要跳转的商家
    dbbase.query("shop",shop.id).then((res)=>{
      this.setData({
        shop:res.data[0]
      })
    })
    //菜品下拉列表
    dbbase.queryselect("productType").then((res)=>{
      for (let i = 0; i < res.data.length; i++) {
        this.setData({
          picker: this.data.picker.concat(res.data[i].Name)
        });
      }
    })
    //联表查询
    // wx.cloud.callFunction({
    //   name:'test',
    //   data:{
    //     collection:'commodityType',

    //     from:'commodity',
    //     localField:'Id',
    //     foreignField:'commodityTypeId',
    //     as:'commodity',
        
    //     /*from2:'act',
    //     localField2:'department._id',
    //     foreignField2:'activity',
    //     as2:'act',*/

    //     match:{_id:app.globalData.openid}
    //   },
    //   success:res=>{
    //   console.log(res.result.list)
    //   //绑定到本地数据
    //   this.setData({commodityType:res.result.list})
    //   }
    // })
  },
  onReady() {
    wx.hideLoading()
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
  //下拉逻辑
  VerticalMain(e) {
    let that = this;
    let list = this.data.commodityType;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + list[i].Id);
        view.fields({
          size: true
        }, data => {
          list[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          list[i].bottom = tabHeight;
        }).exec();
      }
      that.setData({
        load: false,
        list: list
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        that.setData({
          VerticalNavTop: (list[i].Id - 1) * 50,
          TabCur: list[i].Id
        })
        return false
      }
    }
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
    if (this.data.ListTouchDirection =='left'){
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
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
    //要修改的商品
    dbbase.query("product",e.currentTarget.dataset.product_id).then((res)=>{
      this.setData({
        product:res.data[0],
        index_x:0,
        imgList:[
          res.data[0].Image,
        ]
      })
      //绑定下拉列表数据
      dbbase.query("productType",res.data[0].commodityTypeId).then((res)=>{
        for (let i = 0; i < this.data.picker.length; i++) {
          if(this.data.picker[i]===res.data[0].Name){
            this.setData({
              indexPicker:i
            });
          }
        }
      })
    })
  },
  //关闭弹窗
  hideModal(e) {
    this.setData({
      modalName: null,
      product:[]
    })
  },
  ChooseCheckbox(e) {
    let items = this.data.checkbox;
    let values = e.currentTarget.dataset.value;
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].value == values) {
        items[i].checked = !items[i].checked;
        break
      }
    }
    this.setData({
      checkbox: items
    })
  },
  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
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
  //图片全屏显示
  ViewImage(e) {
    //console.log(this.data.imgList,e.currentTarget.dataset.url)
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: this.data.imgList
    });
  },
  //删除图片
  DelImg(e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除这张相片吗？',
      cancelText: '取消',
      confirmText: '确定',
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
  //下拉列表
  PickerChange(e) {
    //console.log(e);
    this.setData({
      indexPicker: e.detail.value
    })

  }
})