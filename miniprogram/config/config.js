 
 class Config {
   net = {
     api: "https://xiaoxingbobo.top"
   }
   //七牛云配置
   qiniu = {
     key: 'nongzhibang/',//上传目录
     qiniuUploadTokenURL:'https://cdn.xiaoxingbobo.top',
     //uptoken:'',//授权接口，1小时有效，不在此处配置，接口传参数
     qiniuRegion: 'SCN',//七牛云地区 所在区域。ECN, SCN, NCN, NA, ASG，分别对应七牛云的：华东，华南，华北，北美，新加坡 5 个区域
     qiniuShouldUseQiniuFileName: false//是否使用七牛云自动设置名称
   }
   logDebug = true
 }
 export default new Config