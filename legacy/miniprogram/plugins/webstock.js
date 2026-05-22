import utils from '../config/utils'
const app = getApp()
class webstock {
  monitor() {
    const db = wx.cloud.database()
    const watcher = db.collection('order')
      // 按 progress 降序
      .orderBy('addOrderDate', 'desc')
      // 取按 orderBy 排序之后的前 1 个
      .limit(1)
      // .where({
      //   _openid:app.globalData.openid
      // })
      .watch({
        onChange: function (snapshot) {
          utils.cl(snapshot.docs)
          utils.cl('改变的事件：', snapshot.docChanges)
          utils.cl('查询到的数据：', snapshot.docs)
          utils.cl('是否是初始化数据：', snapshot.type === 'init')
          // updateData();
          app.show();
        },
        onError: function (err) {
          console.error('数据库监听发生错误：', err)
        }
      })
  }
}
export default new webstock;