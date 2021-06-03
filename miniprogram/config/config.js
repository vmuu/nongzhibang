 
 class Config {
   net = {
     api: "https://xiaoxingbobo.top"
   }
   locationKey="YBCBZ-TD4KF-PVYJ3-J7EXP-ZGOA6-TWBVH"
   //七牛云配置
   qiniu = {
     key: 'nongzhibang/',//上传目录
     qiniuUploadTokenURL:'https://cloud.xiaoxingbobo.top',
     //uptoken:'',//授权接口，1小时有效，不在此处配置，接口传参数
     qiniuRegion: 'SCN',//七牛云地区 所在区域。ECN, SCN, NCN, NA, ASG，分别对应七牛云的：华东，华南，华北，北美，新加坡 5 个区域
     qiniuShouldUseQiniuFileName: false//是否使用七牛云自动设置名称
   }
   logDebug = true
   //加载动画
   //https://cloud.xiaoxingbobo.top/nongzhibang/20210429/1122571622258577490
   //https://cloud.xiaoxingbobo.top/nongzhibang/20210429/1124001622258640673
 }
 export default new Config