const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db=cloud.database();
const _ = db.command
exports.main = async (event, context) => {
  return db.collection('post').where(_.or([
    {
      title:db.RegExp({
        regexp:event.keyword,
        options:'i'
      })
    },
    {
      content:db.RegExp({
        regexp:event.keyword,
        options:'i'
      })
    }
  ])).get()
};
