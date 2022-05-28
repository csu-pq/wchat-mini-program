const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db=cloud.database();
exports.main = async (event, context) => {
  switch(event.name){
    case '查找热榜':
      return db.collection('rebang').orderBy("rank","asc").get();
    case '更新热榜':
      {
      await db.collection("rebang").where({mark:"1"}).remove();
      for(let i=0;i<event.data.length;i++){
        db.collection("rebang").add({
          data:{
            rank:event.data[i].rank,
            postId:event.data[i].postId,
            heat:event.data[i].heat,
            mark:event.data[i].mark,
            title:event.data[i].title,
            content:event.data[i].content,
            category:event.data[i].category,
            campus:event.data[i].campus,
            postTime:event.data[i].postTime,
          }
        })
      }
      }
  }
};
