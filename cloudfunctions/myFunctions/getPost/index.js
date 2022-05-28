const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db=cloud.database();
const _ = db.command
exports.main = async (event, context) => {
  if(event.category=="全部" && event.campus=="全部"){
    if(event.zhiding=="置顶"){
      return db.collection('post').where({zhidingTime: _.gt(Date.parse(new Date()))}).orderBy('zhidingTime','desc').get();
    }
    else if(event.zhiding=="未置顶"){
      return db.collection('post').where({zhidingTime: _.lte(Date.parse(new Date()))}).orderBy('postDate','desc').get();
    }
    else{
      return db.collection('post').orderBy('postDate','desc').get();
    }
  }
  else if(event.category=="全部"){
    if(event.zhiding=="置顶"){
      return db.collection('post').where({campus:event.campus,zhidingTime: _.gt(Date.parse(new Date()))}).orderBy('zhidingTime','desc').get();
    }
    else{
      return db.collection('post').where({campus:event.campus,zhidingTime: _.lte(Date.parse(new Date()))}).orderBy('postDate','desc').get();
    }
  }
  else if(event.campus=="全部"){
    if(event.zhiding=="置顶"){
      return db.collection('post').where({category:event.category,zhidingTime: _.gt(Date.parse(new Date()))}).orderBy('zhidingTime','desc').get();
    }
    else{
      return db.collection('post').where({category:event.category,zhidingTime: _.lte(Date.parse(new Date()))}).orderBy('postDate','desc').get();
    }
  }
  else{
    if(event.zhiding=="置顶"){
      return db.collection('post').where({category:event.category,campus:event.campus,zhidingTime: _.gt(Date.parse(new Date()))}).orderBy('zhidingTime','desc').get();
    }
    else{
      return db.collection('post').where({category:event.category,campus:event.campus,zhidingTime: _.lte(Date.parse(new Date()))}).orderBy('postDate','desc').get();
    }
  }
};
