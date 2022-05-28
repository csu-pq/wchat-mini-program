const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db=cloud.database();
exports.main = async (event, context) => {
  return db.collection('msg').where({sendTo:event.openId}).orderBy('commentDate','desc').get();
};
