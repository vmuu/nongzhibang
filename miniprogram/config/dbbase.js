import config from "./config";
const app=getApp()

class DBBase {
  /**
   * 添加
   */
  add = function (table,data) {
    const db = wx.cloud.database()
    return new Promise((success, error) => {
      if (data) {
        db.collection(table).add({
          data: data,
          success: res => {
            // 在返回结果中会包含新创建的记录的 _id
            //输出返回值
            return success(res)
          },
          fail: err => {
            console.error('[数据库] [新增记录] 失败：', err)
          }
        })
      } else {
        console.error('（table）不可空')
      }
    });

  }
  /**
   * 查询一个，通过id
   */
  query = function (table, id) {
    const db = wx.cloud.database()

    return new Promise((success, error) => {
      if (table && id) {
        db.collection(table).where({
          _id: id
        }).get({
          success: res => {
            return success(res)
          },
          fail: err => {
            console.error('[数据库] [查询记录] 失败：', err)
          }
        })
      } else {
        console.error('（table，id）不可空')
      }
    })

  }
  /**
   * 查询一个，通过id
   */
  queryselect = function (table) {
    const db = wx.cloud.database()

    return new Promise((success, error) => {
      if (table) {
        db.collection(table).get({
          success: res => {
            return success(res)
          },
          fail: err => {
            console.error('[数据库] [查询记录] 失败：', err)
          }
        })
      } else {
        console.error('（table）不可空')
      }
    })

  }

/**
   * 联表查询 2表联查
   */

  looKupTwo = function (tableName,shopId,collection,from,localField,foreignField,as) {

    return new Promise((success, error) => {
      wx.cloud.callFunction({
        //要访问的云函数
        name: tableName,
        data: {
          //店铺
          id:shopId,
          //要查的表
          collection: collection,
          //要链接的表
          from: from,
          //外键
          localField: localField,
          //被连接表外键
          foreignField: foreignField,
          //返回的被链接表的dataName
          as: as,

          /*from2:'act',
          localField2:'department._id',
          foreignField2:'activity',
          as2:'act',*/

          /*match: {
            _id: app.globalData.openid
          }*/
        },
        success: res => {
          //console.log(res.result.list)
          return success(res)
          //绑定到本地数据
          // this.setData({
          //   commodityType: res.result.list
          // })
        }
      })
    })

  }

  /**
   * 条件查询+分页查询
   */
  queryList = function (table, where, skip = 0, count = 10) {
    const db = wx.cloud.database()

    return new Promise((success, error) => {
      if (table && where) {
        db.collection(table).where(where).skip(skip), count(count).get({
          success: res => {
            return success(res)
          },
          fail: err => {
            console.error('[数据库] [查询记录] 失败：', err)
          }
        })
      } else {
        console.error('(table, where)不可空')
      }
    })


  }



  /**
   * 修改
   */
  update = function (table, id, data) {
    const db = wx.cloud.database()

    return new Promise((success) => {
      if (table && id && data) {
        db.collection(table).doc(_id).update({
          data: data,
          success: res => {
            return success(res)
          },
          fail: err => {
            console.error('[数据库] [更新记录] 失败：', err)
          }
        })
      } else {
        console.error('（table，id，data）不可空')
      }
    })

  }
  /**
   * 删除
   */
  delete = function (table, id) {

    return new Promise((success) => {
      if (table && id) {
        const db = wx.cloud.database()
        db.collection(table).doc(_id).remove({
          success: res => {},
          fail: err => {
            return success(res)
          }
        })
      } else {
        console.error('（table，id）不可空')
      }
    })


  }
}
export default new DBBase