const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db=cloud.database();
exports.main = async (event, context) => {
  try {
    return await db.collection('msg').where({
      sendTo: event.openId
    })
    .update({
      data: {
        unRead:false
      },
    })
  } catch(e) {
    console.error(e)
  }
};
