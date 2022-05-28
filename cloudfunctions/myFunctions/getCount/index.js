const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db=cloud.database();
exports.main = async (event, context) => {
  switch(event.name){
    case '获取点赞数':
      return db.collection('user_dianzan').aggregate().match({postId:event.postId}).count('dianzanNum').end()
    case '获取收藏数':
      return db.collection('user_fav').aggregate().match({postId:event.postId}).count('shoucangNum').end()
    case '获取评论数':
      return db.collection('msg').aggregate().match({postId:event.postId}).count('talksNum').end()
    case '获取浏览数':
      return db.collection('post').where({postId:event.postId}).get();
  }
};
