const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db=cloud.database();
exports.main = async (event, context) => {
  db.collection('msg').add({
    data:{
      comment:"欢迎来到二手交易平台",
      commentDate:new Date(),
      commentTime:event.commentTime,
      from:"System",
      imgURL:"cloud://cloud1-5gkp8gvb02539afe.636c-cloud1-5gkp8gvb02539afe-1310009834/2022050216172557jpg",
      nickName:"系统消息",
      postId:"",
      sendTo:event.openId,
      unRead:true
    }
  })
};
