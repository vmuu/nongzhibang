import config from "./config";
import utils from "./utils";
const app = getApp()

class DBBase {
  /**
   * 添加
   */
  add = function (table, data) {
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
   * 查询一个，通过openid
   */
  queryOpenId = function (table, openId) {
    const db = wx.cloud.database()

    return new Promise((success, error) => {
      if (table && openId) {
        db.collection(table).where({
          _openid: openId
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
   * 查询一个，通过Name
   */
  queryName = function (table, Name) {
    const db = wx.cloud.database()

    return new Promise((success, error) => {
      if (table && Name) {
        db.collection(table).where({
          Name: Name
        }).get({
          success: res => {
            return success(res)
          },
          fail: err => {
            console.error('[数据库] [查询记录] 失败：', err)
          }
        })
      } else {
        console.error('（table，Name）不可空')
      }
    })

  }
  /**
   * 查询单表
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
   * 查询productType单表通过shopid筛选
   */
  queryproductTypeselect = function (table, shopId) {
    const db = wx.cloud.database()

    return new Promise((success, error) => {
      if (table) {
        db.collection(table).where({
          shopId: shopId
        }).get({
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

  looKupTwo = function (tableName, shopId, collection, from, localField, foreignField, as) {

    return new Promise((success, error) => {
      wx.cloud.callFunction({
        //要访问的云函数
        name: tableName,
        data: {
          //店铺
          id: shopId,
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
  queryList = function (table, where, skip = 0, limit = 10) {
    const db = wx.cloud.database()

    return new Promise((success, error) => {
      if (table && where) {
        db.collection(table).where(where).skip(skip).limit(limit).get({
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
   * 云函数修改，product表
   */

  productupdate = function (id, data) {
    return new Promise((success, error) => {
      wx.cloud.callFunction({
        //要访问的云函数
        name: "ProductUpdata",
        data: {
          id: id,
          Desc: data.Desc,
          Name: data.Name,
          Image: data.Image,
          commodityTypeId: data.commodityTypeId,
          price: data.price,
        },
        success: res => {
          return success(res)
        }
      })
    })

  }

  /**
   * 修改 通过_id
   */
  update = function (table, _id, data) {
    const db = wx.cloud.database()

    return new Promise((success) => {
      if (table && _id && data) {
        //修改无需提交_id和_openid，delete移除
        if (data._id != null) {
          delete data._id
        }
        if (data._openid != null) {
          delete data._openid
        }
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
   * 万能修改 可以通过所有字段
   */
  updateWhere = function (table, where, data) {
    const db = wx.cloud.database()

    return new Promise((success) => {
      if (table && where && data) {
        //修改无需提交_id和_openid，delete移除
        if (data._id != null) {
          delete data._id
        }
        if (data._openid != null) {
          delete data._openid
        }
        db.collection(table).where(where).update({
          data: data,
          success(res){
            return success(res)
          },
          fail(err){
            console.error(err);
          }
        })
      } else {
        console.error('（table，where，data）不可空')
      }
    })

  }
  /**
   * 云函数删除，product表
   */

  productDelete = function (id, collection) {
    console.log("id", id)
    return new Promise((success, error) => {
      wx.cloud.callFunction({
        //要访问的云函数
        name: "DeletePoduct",
        data: {
          collection: collection,
          id: id
        },
        success: res => {
          return success(res)
        }
      })
    })

  }
  /**
   * 删除
   */
  delete = function (table, _id) {
    utils.cl(_id)
    return new Promise((success) => {
      if (table && _id) {
        const db = wx.cloud.database()
        db.collection(table).doc(_id).remove({
          success: res => {
            return success(res)
          },
          fail: err => {

          }
        })
      } else {
        console.error('（table，id）不可空')
      }
    })


  }
  /**
   * 首页推荐商店与商品
   */
  //连表，排序，分页
  indexProductOrShop = function () {

    return new Promise((success) => {
      wx.cloud.callFunction({
        //要访问的云函数
        name: "looKupProductOrShop",
        success: res => {
          return success(res)
        }
      })
    })

  }

  /**
   * 查询单表product,销量排序
   */
  queryproduct = function () {
    const db = wx.cloud.database()

    return new Promise((success, error) => {
      db.collection("product").orderBy('MonthlySales', 'desc').get({
        success: res => {
          return success(res)
        },
        fail: err => {
          console.error('[数据库] [查询记录] 失败：', err)
        }
      })
    })

  }
  /**
   * 查询单表product,分页查询,总销量排序
   */
  productlist = function (skip, limit) {
    const db = wx.cloud.database()

    return new Promise((success, error) => {

      db.collection("product").orderBy('MonthlySales', 'desc').skip(skip).limit(limit).get({
        success: res => {
          return success(res)
        },
        fail: err => {
          console.error('[数据库] [查询记录] 失败：', err)
        }
      })
    })
  }
  /**
   * 查询单表product,条件筛选,分页查询,总销量排序
   */
  productwherelist = function (shopTypeId, skip, limit) {
    const db = wx.cloud.database()

    return new Promise((success, error) => {

      db.collection("product").where({
        shopTypeId: shopTypeId
      }).orderBy('MonthlySales', 'desc').skip(skip).limit(limit).get({
        success: res => {
          return success(res)
        },
        fail: err => {
          console.error('[数据库] [查询记录] 失败：', err)
        }
      })
    })
  }
  /**
   * 查询单表shop,分页查询,总销量排序
   */
  queryShop = function (skip, limit) {
    const db = wx.cloud.database()

    return new Promise((success, error) => {

      db.collection("shop").orderBy('salesVolume', 'desc').skip(skip).limit(limit).get({
        success: res => {
          return success(res)
        },
        fail: err => {
          console.error('[数据库] [查询记录] 失败：', err)
        }
      })
    })
  }
  /**
   * order通过openid与交易中状态
   */
  orderOpenIdStateIng = function (table, openId) {
    const db = wx.cloud.database()

    return new Promise((success, error) => {
      if (table && openId) {
        db.collection(table).where({
          _openid: openId,
          orderState: db.command.gt(-1)
        }).where({
          orderState: db.command.lt(3)
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
   * order通过openid与状态
   */
  orderOpenIdState = function (table, openId, State) {
    const db = wx.cloud.database()

    return new Promise((success, error) => {
      if (table && openId && State) {
        db.collection(table).where({
          _openid: openId,
          orderState: State
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
}
export default new DBBase