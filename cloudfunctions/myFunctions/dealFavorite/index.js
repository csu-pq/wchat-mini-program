const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db=cloud.database();
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  switch(event.method){
    case '查找收藏':
      return db.collection('user_fav').where({openId:wxContext.OPENID,postId:event.postId}).get();
    case '收藏':
      return db.collection('user_fav').add({
        data:{
        openId:wxContext.OPENID,
        postId:event.postId,
        shoucangDate:new Date(),
        }});
    case '取消收藏':
      return await db.collection('user_fav').where({openId:wxContext.OPENID,postId:event.postId}).remove();
  }
};
