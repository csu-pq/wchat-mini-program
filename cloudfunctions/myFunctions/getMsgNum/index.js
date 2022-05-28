const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db=cloud.database();
exports.main = async (event, context) => {
  return db.collection('msg').aggregate().match({sendTo:event.openId,unRead:true}).count('unReadNum').end()
};
