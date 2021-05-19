// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection(event.collection).aggregate().match({ 
      // match是根据活动id来查询到当前这个活动信息
      shopId: event.id 
    }).lookup({
      from:event.from,
      localField: event.localField,
      foreignField: event.foreignField,
      as: event.as
    })
    /*.lookup({
      from:event.from2,
      localField: event.localField2,
      foreignField: event.foreignField2,
      as: event.as2
    }).
    match(event.match)*/
    .end()
  } catch (e) {
    console.error(e)
  }
}