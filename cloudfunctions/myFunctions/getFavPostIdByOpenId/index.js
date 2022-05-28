const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db=cloud.database()
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  return db.collection('user_fav').where({openId:wxContext.OPENID}).orderBy('shoucangDate','desc').get()
};
