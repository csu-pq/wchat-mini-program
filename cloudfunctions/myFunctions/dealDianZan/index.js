const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db=cloud.database();
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  switch(event.method){
    case '查找点赞':
      return db.collection('user_dianzan').where({openId:wxContext.OPENID,postId:event.postId}).get();
    case '点赞':
      return db.collection('user_dianzan').add({
        data:{
        openId:wxContext.OPENID,
        postId:event.postId,
        dianZanDate:new Date(),
      }});
    case '取消点赞':
      return db.collection('user_dianzan').where({openId:wxContext.OPENID,postId:event.postId}).remove();
  }
};
