const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db=cloud.database();
exports.main = async (event, context) => {
  return db.collection('post').where({openId:event.openId}).orderBy("postDate","desc").get();
};
