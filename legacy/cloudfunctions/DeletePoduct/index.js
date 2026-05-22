// 云函数入口文件
const cloud = require('wx-server-sdk')
 
cloud.init()
const db = cloud.database()
 
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event);
  try {
    return await db.collection(event.collection).doc(event.id).remove({
        success: res => {},
        fail: err => {
          return success(res)
        }
      })
  } catch (e) {
    console.error(e)
  }
}