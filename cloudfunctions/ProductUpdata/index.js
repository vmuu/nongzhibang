// 云函数入口文件
const cloud = require('wx-server-sdk')
 
cloud.init()
const db = cloud.database()
 
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event);
  try {
    return await db.collection(event.table).doc(event.data.id).update({
      // data 传入需要局部更新的数据
      data: event.data
    })
  } catch (e) {
    console.error(e)
  }
}