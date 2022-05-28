const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db=cloud.database();
exports.main = async (event, context) => {
  if(event.order=='desc'){
    return db.collection('talks').where({postId:event.postId}).orderBy('commentDate','desc').get();
  }
  else{
    return db.collection('talks').where({postId:event.postId}).orderBy('commentDate','asc').get();
  }
};
