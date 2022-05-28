const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db=cloud.database();
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  db.collection('post').add({
    data:{
      openId:wxContext.OPENID,
      //随机数+时间戳生成唯一postId
      postId:Number(Math.random().toString().substr(2,5) + Date.now()).toString(36),
      title:event.title,
      content:event.content,
      imgURL:event.imgURL,
      campus:event.campus,
      category:event.category,
      contact:event.contact,
      contactInfo:event.contactInfo,
      postTime:event.postTime,
      zhidingTime:event.zhidingTime,
      postDate:new Date(),
      visit:0
    }
  })
};
