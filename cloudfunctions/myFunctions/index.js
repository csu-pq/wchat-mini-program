const getOpenId=require('./getOpenId/index');
const findUser = require('./findUser/index');
const addUser=require('./addUser/index');
const updateUser=require('./updateUser/index');
const addPost=require('./addPost/index');
const getPost=require('./getPost/index');
const getPostById=require('./getPostById/index');
const findUserByOpenId=require('./findUserByOpenId/index');
const dealFavorite=require('./dealFavorite/index');
const getFavPostIdByOpenId=require('./getFavPostIdByOpenId/index');
const searchPost=require('./searchPost/index');
const addComment=require('./addComment/index');
const getComment=require('./getComment/index');
const dealDianZan=require('./dealDianZan/index');
const getCount=require('./getCount/index');
const getPostByOpenId=require('./getPostByOpenId/index');
const getDianZanByOpenId=require('./getDianZanByOpenId/index');
const logOff=require('./logOff/index');
const getMsg=require('./getMsg/index');
const wxPay=require('./wxPay/index');
const zhiDing=require('./zhiDing/index');
const getZhiDingPost=require('./getZhiDingPost/index');
const getMsgNum=require('./getMsgNum/index');
const readMsg=require('./readMsg/index');
const addMsg=require('./addMsg/index');
const deletePostByPostId=require('./deletePostByPostId/index');
const dealReBang=require('./dealReBang/index');
// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'getOpenId':
      return await getOpenId.main(event, context);
    case 'findUser':
      return await findUser.main(event, context);
    case 'addUser':
      return await addUser.main(event, context);
    case 'updateUser':
      return await updateUser.main(event, context);
    case 'addPost':
      return await addPost.main(event, context);
    case 'getPost':
      return await getPost.main(event, context);
    case 'getPostById':
      return await getPostById.main(event, context);
    case 'findUserByOpenId':
      return await findUserByOpenId.main(event, context);
    case 'dealFavorite':
      return await dealFavorite.main(event, context);
    case 'dealDianZan':
      return await dealDianZan.main(event, context);
    case 'getFavPostIdByOpenId':
      return await getFavPostIdByOpenId.main(event, context);
    case 'searchPost':
      return await searchPost.main(event, context);
    case 'addComment':
      return await addComment.main(event, context);
    case 'getComment':
      return await getComment.main(event, context);
    case 'getCount':
      return await getCount.main(event, context);
    case 'getPostByOpenId':
      return await getPostByOpenId.main(event, context);
    case 'getDianZanByOpenId':
      return await getDianZanByOpenId.main(event, context);
    case 'logOff':
      return await logOff.main(event, context);
    case 'getMsg':
      return await getMsg.main(event, context);
    case 'wxPay':
      return await wxPay.main(event, context);
    case 'zhiDing':
      return await zhiDing.main(event, context);
    case 'getZhiDingPost':
      return await getZhiDingPost.main(event, context);
    case 'getMsgNum':
      return await getMsgNum.main(event, context);
    case 'readMsg':
      return await readMsg.main(event, context);
    case 'addMsg':
        return await addMsg.main(event, context);
    case 'deletePostByPostId':
        return await deletePostByPostId.main(event, context);
    case 'dealReBang':
        return await dealReBang.main(event, context);
  }
};
