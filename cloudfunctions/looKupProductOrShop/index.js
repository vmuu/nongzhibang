// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection("shop").aggregate().lookup({
      from:"product",
      localField: "_id",
      foreignField: "shopId",
      as: "shop"
    })
    .end()
  } catch (e) {
    console.error(e)
  }
}