import config from '../config/config.js'
import qiniuUploader from '../plugins/qiniuUploader'
import http from 'http.js'
import moment from '../plugins/moment'


class Utils {
  cl = (...object) => {
    if (config.logDebug) {
      console.log(...object)
    }
  }
  ce = (...object) => {
    if (config.logDebug) {
      console.error(...object)
    }
  }
  /**
   * 判断是否登录,自动跳转到登录界面
   */
  isLogin = () => {
    //从缓存中获取openid
    try {
      var value = wx.getStorageSync('openid')
      if (value) {
        this.cl('[缓存]获取openid成功：', value)
      } else {
        this.ce('[缓存]获取openid为空，跳转到登录页面')
        wx.switchTab({
          url: './pages/mine/mine',
        })
      }
    } catch (e) {
      this.ce('[缓存]获取openid失败', e)
    }
  }
  /**
   * 七牛云上传文件
   * @param {filePath} filePath 
   * @param {token} token 
   */
  upload = (filePath, token) => {
    if (filePath == null) {
      this.ce('文件路径都没得，你让我传毛？你有毛吗？你周边一根毛都没有，老表！');
      return
    } else if (token == null) {
      this.ce('token为空！')
    }
    //获取当前时间，转换成文件名
    let date = new Date();
    let year = date.getFullYear().toString();
    let month = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth();
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    //获取时间戳
    var timestamp = (new Date()).valueOf();
    let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    //获取今天日期时间
    let toDay = year + month + day + '/' + hours + minutes + seconds + timestamp;

    //获取qiniu配置
    let qiniuConfig = {
      key: config.qiniu.key + toDay,
      region: config.qiniu.qiniuRegion,
      uptoken: token,
      domain: config.qiniu.qiniuUploadTokenURL,
      shouldUseQiniuFileName: config.qiniu.qiniuShouldUseQiniuFileName
    }
    return new Promise((success, error) => {
      qiniuUploader.upload(filePath, (res) => {
        //成功
        return success(res)
      }, (err) => { //失败
        this.ce("上传失败：", err)
      }, qiniuConfig)
    })
  }
  /**
   * 七牛云删除
   * @param path 删除的文件名路径，https开头
   */
  qiniuDelete(path = null) {
    if (path == null) {
      this.ce('文件路径都没得，你让我删毛？你有毛吗？你周边一根毛都没有，老表！');
      return
    }
    let payload = {
      key: path
    }
    return new Promise(success => {
      http.get(`/api/file/delete`, payload).then(res => {
        success(res);
      })
    });
  }
  /**
   * 弹出提示，无图标
   */
  hint = (object = "成功", duration = 1500) => {
    wx.showToast({
      title: object,
      icon: 'none',
      duration: duration
    })
  }
  show(object = "成功") {
    wx.showToast({
      title: object,
      icon: "success"
    })
  }
  //输入框输入事件，把数据绑定到data
  change(e, o) {
    return o.setData({
      [e.currentTarget.dataset.prop]: e.detail.value
    })
  }
  isEmpty(value) {
    if (value == null) return true;
    if (value == '') return true;
    if (value == ' ') return true;
    if (value == 'null') return true;
    if (value == undefined) return true;
    if (value.length == 0) return true;
    return false;
  }
  //校验身份证
  checkIdentity(value) {
    let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (!reg.test(value)) return false;
    return true;
  }
  //校验电话号码
  checkTel(value) {
    let reg = /^[1][3-9][0-9]{9}$/;
    if ((!reg.test(value))) {
      return false;
    } else {
      return true;
    }
  }
  dateformat(date,rule='YYYY-MM-DD HH:mm:ss'){
    if(date){
      return moment(date).format(rule);
    }
    return moment().format(rule);
    
  }
}
export default new Utils