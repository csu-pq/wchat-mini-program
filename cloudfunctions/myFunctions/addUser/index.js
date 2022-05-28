const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db=cloud.database();
exports.main = async (event, context) => {
  db.collection('user').add({
    data:{
      openId:event.openId,
      nickName:event.nickName,
      imgURL:event.imgURL,
    }
  })
};
