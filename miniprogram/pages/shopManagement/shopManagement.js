import db from '../../config/dbbase.js';
import utils from '../../config/utils.js';

const app = getApp();
var that;
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    MainCur: 0,
    heighttop: (app.globalData.StatusBar) + 40,
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
    commodityType: [],
    //商店
    shop: [],
    //商品对象
    product: [],
    //下拉列表索引
    indexPicker: null,
    //下拉列表数据
    picker: [],
    //验证提示是否显示
    isSubmit: false,
    //验证提示内容
    warn: null,
    //要修改的商品的类别
    commodityTypePorductId: null,
    shopType: [],
    indexShopType: 0
  },
  //页面加载
  onLoad(shop) {
    this.state()
    app.utils.cl(shop);

    this.setData({
      picker: []
    })
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let list = [{}];
    for (let i = 0; i < 3; i++) {
      list[i] = {};
      list[i].name = String.fromCharCode(65 + i);
      list[i].id = i;
    }
    this.setData({
      list: list,
      listCur: list[0]
    })
    //调用封装的多表（2表）联查函数
    db.looKupTwo("looKupProductOrProductType", shop.id, "productType", "product", "_id", "commodityTypeId", "commodity").then((res) => {
      app.utils.cl(res);
      app.utils.cl(shop.id);
      this.setData({
        commodityType: res.result.list
      })
    })
    //要跳转的商家
    db.query("shop", shop.id).then((res) => {
      this.setData({
        shop: res.data[0]
      })
    })
    //菜品下拉列表
    db.queryproductTypeselect("productType", shop.id).then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          this.setData({
            picker: this.data.picker.concat(res.data[i].name)
          });
        }
      }),
      that.getShopType()
  },
  state() {
    that = this
  },
  onReady() {
    wx.hideLoading()
  },
  changeShopType(e) {
    app.utils.cl('asdf',e);
    let index = e.detail.value;
    that.setData({
      indexShopType: index
    })
    app.utils.cl(that.data.indexShopType);
  },
  //侧边menu点击事件
  tabSelect(e) {
    app.utils.cl(e);

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
        let view = wx.createSelectorQuery().select("#main-" + i);
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
          VerticalNavTop: (i - 1) * 50,
          TabCur: i
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
  //修改弹窗
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
    //要修改的商品
    db.query("product", e.currentTarget.dataset.product_id).then((res) => {
      this.setData({
        product: res.data[0],
        index_x: 0,
      })
      if (res.data[0].image !== "") {
        this.setData({
          imgList: [
            res.data[0].image
          ]
        })
      }
      app.utils.cl("shopType",that.data.shopType,"shopTypeId",res.data[0].shopTypeId);
      
      let shopTypeId = res.data[0].shopTypeId;
      if (that.data.shopType) {
        app.utils.cl('id',shopTypeId);
        //shopType
        for (var i = 0; i < that.data.shopType.length; i++) {
          if (that.data.shopType[i]._id == shopTypeId) {
            break
          }
        }
        app.utils.cl(i);
        that.setData({
          indexShopType:i
        })
        app.utils.cl('输出当前的项目',that.data.indexShopType);
        
      }


      //绑定下拉列表数据
      db.query("productType", res.data[0].commodityTypeId).then((res) => {
        for (let i = 0; i < this.data.picker.length; i++) {
          if (this.data.picker[i] === res.data[0].name) {
            this.setData({
              indexPicker: i
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
      product: []
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
  //上传图片到本地
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
          app.utils.qiniuDelete(this.data.imgList).then(res => {
            app.utils.cl(res);
            this.data.imgList.splice(e.currentTarget.dataset.index, 1);
            this.setData({
              imgList: this.data.imgList
            })
          })
        }
      }
    })
  },
  //下拉列表
  PickerChange(e) {
    this.setData({
      indexPicker: e.detail.value
    })
  },
  //计算原始价格
  //原始价格的8折就是当前价格
  getCurrentPrice(value) {
    value=parseInt(value);
    app.utils.cl(value);
    return (parseInt(value) / 0.8).toFixed(2);
  },
  //修改提交
  formSubmit: function (e) {
    
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    let {
      _id,
      name,
      desc,
      image,
      commodityTypeId,
      currentPrice,
      shopType
    } = e.detail.value;
    app.utils.cl('shopType',shopType);
    
    if (_id != undefined && name != undefined && desc != undefined && image != undefined && commodityTypeId != undefined && currentPrice != undefined) {
      this.setData({
        warn: null,
        isSubmit: false
      })
      wx.showModal({
        title: '提示',
        content: '确定要修改吗？',
        cancelText: '取消',
        confirmText: '确定',
        success: res => {
          if (res.confirm) {
            if (image !== this.data.product.image) {
              let that = this
              //从全局获取七牛云授权token
              let token = app.globalData.qiniuToken
              var filePath = image; //this.data.imgList[0]
              app.utils.upload(filePath, token).then((res) => {
                wx.hideLoading({
                  /*success: (res) => {},*/
                  success: function (res) {
                    wx.showLoading({
                      title: '图片上传中...',
                    })
                  }
                })
                wx.showToast({
                  title: '上传成功',
                  icon: 'none'
                })
                //返回的图片路径
                that.setData({
                  imgList: [
                    res.imageURL,
                  ]
                })
                app.utils.ce('ss');
                
                //绑定菜品类别id
                db.queryName("productType", this.data.picker[commodityTypeId]).then((res) => {
                  app.utils.cl('输出菜品类型',res);
                  
                  this.setData({
                    commodityTypePorductId: res.data[0]._id
                  })
                  app.utils.ce('校园零食',that.data.shopType[shopType]._id);
                  
                  //更新数据
                  db.productupdate("product",{
                    id:_id,
                    desc: desc,
                    name: name,
                    image: this.data.imgList[0],
                    commodityTypeId: this.data.commodityTypePorductId,
                    shopTypeId: that.data.shopType[shopType]._id,
                    price: this.getCurrentPrice(currentPrice),
                    currentPrice: currentPrice,
                    success: function (res) {
                      wx.showLoading({
                        title: '数据上传中...',
                      })
                    }
                  }).then((res) => {
                    wx.showToast({
                      title: '上传成功',
                      icon: 'none'
                    })
                    //隐藏修改表单和初始化商品product对象
                    this.setData({
                      modalName: null,
                      product: []
                    })
                    //刷新界面
                    this.onLoad({
                      id: this.data.shop._id
                    })
                    //弹出提示
                    wx.showToast({
                      title: '修改成功',
                      icon: 'none'
                    })
                  })
                })
              })
            } else {
              //app.utils.cl('that.data.shopType[shopType]._id',that.data.shopType[shopType]._id);
              
              db.queryName("productType", this.data.picker[commodityTypeId]).then((res) => {
                this.setData({
                  commodityTypePorductId: res.data[0]._id
                })
                app.utils.ce('校园零食',that.data.shopType[shopType]._id);
                let shopTypeId = that.data.shopType[shopType]._id
                app.utils.ce(shopTypeId,_id);
                
                //更新数据
                db.productupdate("product",{
                  id:_id,
                  desc: desc,
                  favorableRating: 0,
                  monthlySales: 0,
                  name: name,
                  commodityTypeId: this.data.commodityTypePorductId,
                  shopTypeId: shopTypeId,
                  price: this.getCurrentPrice(currentPrice),
                  currentPrice: currentPrice,
                  shopId: this.data.shop._id,
                  success: function (res) {
                    wx.showLoading({
                      title: '数据上传中...',
                    })
                  }
                }).then((res) => {
                  wx.showToast({
                    title: '上传成功',
                    icon: 'none'
                  })
                  //隐藏修改表单和初始化商品product对象
                  this.setData({
                    modalName: null,
                    product: []
                  })
                  //刷新界面
                  this.onLoad({
                    id: this.data.shop._id
                  })
                  //弹出提示
                  wx.showToast({
                    title: '修改成功',
                    icon: 'none'
                  })
                })
              })
            }
          }
        }
      })
    } else {
      app.utils.hint('请完善信息');
      /*this.setData({
        warn: "请完善信息",
        isSubmit: true
      })*/
    }
  },
  //删除商品
  delectproduct(e) {
    utils.cl(e.currentTarget.dataset.product_id)
    wx.showModal({
      title: '注意',
      content: '确定要删除这个菜品吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          db.query("product", e.currentTarget.dataset.product_id).then((res) => {
            if (!app.utils.isEmpty(res.data[0].image)) {
              app.utils.qiniuDelete(res.data[0].image).then(res => {
                app.utils.cl(res);
              })
            }
            db.productDelete(e.currentTarget.dataset.product_id, "product").then((res) => {
              utils.cl(res)
              this.onLoad({
                id: this.data.shop._id
              })
              wx.showToast({
                title: '删除成功',
                icon: 'none'
              })
            })
          })
        }
      }
    })
  },
  getShopType() {
    app.dbbase.queryselect('shopType').then(res => {
      app.utils.cl('查询结果', res);
      this.setData({
        shopType: res.data
      })
      app.utils.cl('shopType',this.data.shopType);

    })
  },
  //添加弹窗
  showaddModal(e) {
    app.utils.cl(e);
    this.setData({
      modaladdName: e.currentTarget.dataset.target,
      imgList: [],
      indexPicker: 0,
      index_x: 0
    })
  },
  //关闭添加弹窗
  hideaddModal(e) {
    this.setData({
      modaladdName: null,
      product: [],
      form_info: "",
      imgList: []
    })
  },
  //添加下拉列表
  PickeraddChange(e) {
    this.setData({
      indexPicker: e.detail.value
    })

  },
  //添加提交
  formaddSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    let {
      name,
      desc,
      image,
      commodityTypeId,
      currentPrice,
      shopType,
    } = e.detail.value;
    if (name != undefined && desc != undefined && image != undefined && commodityTypeId != undefined && currentPrice != undefined) {
      this.setData({
        warn: null,
        isSubmit: false
      })
      wx.showModal({
        title: '提示',
        content: '确定要添加吗？',
        cancelText: '取消',
        confirmText: '确定',
        success: res => {
          if (res.confirm) {
            let that = this
            //从全局获取七牛云授权token
            let token = app.globalData.qiniuToken
            var filePath = image; //this.data.imgList[0]
            app.utils.upload(filePath, token).then((res) => {
              wx.hideLoading({
                /*success: (res) => {},*/
                success: function (res) {
                  wx.showLoading({
                    title: '图片上传中...',
                  })
                }
              })
              wx.showToast({
                title: '上传成功',
                icon: 'none'
              })
              //返回的图片路径
              that.setData({
                imgList: [
                  res.imageURL,
                ]
              })
              //绑定菜品类别id
              db.queryName("productType", this.data.picker[commodityTypeId]).then((res) => {
                app.utils.cl(commodityTypeId);
                app.utils.cl(this.data.picker);
                app.utils.cl(res);
                this.setData({
                  commodityTypePorductId: res.data[0]._id
                })
                app.utils.cl('阿萨德法师',that.data.shopType);
                
                //添加数据
                db.add("product", {
                  desc: desc,
                  favorableRating: 0,
                  monthlySales: 0,
                  name: name,
                  image: this.data.imgList[0],
                  commodityTypeId: this.data.commodityTypePorductId,
                  shopTypeId: that.data.shopType[shopType]._id,
                  price: this.getCurrentPrice(currentPrice),
                  currentPrice: currentPrice,
                  shopId: this.data.shop._id,
                  success: function (res) {
                    wx.showLoading({
                      title: '数据上传中...',
                    })
                  }
                }).then((res) => {
                  wx.showToast({
                    title: '上传成功',
                    icon: 'none'
                  })
                  //隐藏添加表单和初始化商品product对象
                  this.setData({
                    modaladdName: null,
                    product: [],
                    form_info: "",
                    imgList: []
                  })
                  //刷新界面
                  this.onLoad({
                    id: this.data.shop._id
                  })
                  //弹出提示
                  wx.showToast({
                    title: '添加成功',
                    icon: 'none'
                  })
                })
              })
            })
          }
        }
      })
    } else {
      app.utils.hint('请完善信息');
      /*this.setData({
        warn: "请完善信息",
        isSubmit: true
      })*/
    }
  },
  showShopAnnouncement(e) {
    app.utils.hint(e.currentTarget.dataset.showshopannouncement, 3000);
  },
  showAddress(e) {
    app.utils.cl(e);

    app.utils.hint(e.currentTarget.dataset.showaddress, 3000);
  },
})