const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db=cloud.database();
// 获取openId云函数入口函数
exports.main = async (event, context) => {
  //删除用户信息
  await db.collection('user').where({openId:event.openId}).remove();
  //删除用户发帖
  await db.collection('post').where({openId:event.openId}).remove();
  //删除用户收藏
  await db.collection('user_fav').where({openId:event.openId}).remove();
  //删除用户点赞
  await db.collection('user_dianzan').where({openId:event.openId}).remove();
  //删除用户评论
  await db.collection('talks').where({openId:event.openId}).remove();
  //删除用户消息
  await db.collection('msg').where({sendTo:event.openId}).remove();
  await db.collection('msg').where({from:event.openId}).remove();
};
