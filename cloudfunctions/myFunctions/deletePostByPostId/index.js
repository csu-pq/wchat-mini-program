const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db=cloud.database();
exports.main = async (event, context) => {
  //删除用户信息
  return db.collection('post').where({postId:event.postId}).remove();
};
