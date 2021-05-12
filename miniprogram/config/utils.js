import config from '../config/config.js'
import qiniuUploader from '../plugins/qiniuUploader'

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
  isLogin=()=>{
     //从缓存中获取openid
     try {
      var value = wx.getStorageSync('openid')
      if (value) {
        this.cl('[缓存]获取openid成功：',value)
      }else{
        this.ce('[缓存]获取openid为空，跳转到登录页面')
        wx.switchTab({
          url: './pages/mine/mine',
        })
      }
    } catch (e) {
      this.ce('[缓存]获取openid失败',e)
    }
  }
  /**
   * 七牛云登录
   * @param {filePath} filePath 
   * @param {token} token 
   */
  upload = (filePath,token) => {
    if (filePath == null) {
      this.ce('文件路径都没得，你让我传毛？你有毛吗？你周边一根毛都没有，老表！');
      return
    }else if(token==null){
      this.ce('token为空！')
    }
    //获取当前时间，转换成文件名
    let date = new Date();
    let year = date.getFullYear().toString();
    let month = date.getMonth().toString();
    let day = date.getDate().toString();
    //获取时间戳
    var timestamp = (new Date()).valueOf() 
    
    let toDay = year+month+day+'/'+date.getHours()+date.getMinutes()+date.getSeconds()+timestamp;
    //qiniu配置
    let qiniuConfig = {
      key: config.qiniu.key+toDay,
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
      },qiniuConfig)
    })
  }
  /**
   * 弹出提示，无图标
   */
  hint=(...object)=>{
    wx.showToast({
      title: [...object],
      icon:'none'
    })
  }
}
export default new Utils
