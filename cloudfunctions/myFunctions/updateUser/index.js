const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db=cloud.database();
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  try {
    return await db.collection('user').where({
      openId: wxContext.OPENID
    })
    .update({
      data: {
        sign:event.data.sign,
        contact:event.data.contact,
        wechat:event.data.wechat,
        QQ:event.data.QQ,
        tel:event.data.tel
      },
    })
  } catch(e) {
    console.error(e)
  }
};
