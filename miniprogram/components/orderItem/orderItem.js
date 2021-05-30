// components/order/order.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    order: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },


  /**
   * 组件的方法列表
   */
  methods: {
    orderDetail(e){
      wx.navigateTo({
        url: '../orderDetail/orderDetail?id='+e.currentTarget.dataset.id,
      })
    },
    tapCancel(e){
      console.log(e)
      
      this.triggerEvent("cancel",e)
    }
  }
})