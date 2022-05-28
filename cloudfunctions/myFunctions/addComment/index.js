const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db=cloud.database();
exports.main = async (event, context) => {
  const commentId=Number(Math.random().toString().substr(2,5) + Date.now()).toString(36);
  //存评论
  db.collection('talks').add({
    data:{
      commentId:commentId,
      openId:event.openId,
      postId:event.postId,
      comment:event.comment,
      commentTo:event.commentTo,
      commentTo2:event.commentTo2,
      commentTo2Id:event.commentTo2Id,
      commentDate:new Date(),
      level:event.level,
      imgURL:event.imgURL,
      nickName:event.nickName,
      commentTime:event.commentTime,
    }
  })
  //发送消息
  db.collection('msg').add({
    data:{
      commentId:commentId,
      postId:event.postId,
      from:event.openId,
      nickName:event.nickName,
      imgURL:event.imgURL,
      comment:event.comment,
      commentTime:event.commentTime,
      commentDate:new Date(),
      myMsg:event.myMsg,
      sendTo:event.sendTo,
      unRead:true,
    }
  })
};
