const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db=cloud.database()
exports.main = async (event, context) => {
  return db.collection('user_dianzan').where({openId:event.openId}).orderBy('dianZanDate','desc').get()
};
