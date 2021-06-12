// components/load/load.js
const app=getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showLoad:{
      type:Boolean,
      value:false
    },
    modeType:{
      type:Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
  },

  /**
   * 组件的方法列表
   */
  methods: {
  }
})
