const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const _ = db.command
exports.main = async (event, context) => {
  if (event.isZhingDing) {
    try {
      return await db.collection('post').where({
        postId: event.postId
      })
        .update({
          data: {
            zhidingTime: _.inc(event.time * 60 * 60 * 1000),
          },
        })
    } catch (e) {
      console.error(e)
    }
  }
  else {
    var timestamp = Date.parse(new Date());
    try {
      return await db.collection('post').where({
        postId: event.postId
      })
        .update({
          data: {
            zhidingTime: timestamp + event.time * 60 * 60 * 1000,
          },
        })
    } catch (e) {
      console.error(e)
    }
  }
};
