Page({
  data: {
    postList:{},
    postIdList:{},
    hasUserInfo:false
  },
  onLoad: function (options) {
    this.setData({
      hasUserInfo:wx.getStorageSync('hasUserInfo')
    })
    if(this.data.hasUserInfo){
      this.showMyDiaZan()
    }
  },
  //根据openId获取点赞的PostId
  async showMyDiaZan(e){
    wx.showLoading({
      title: '',
    })
    await wx.cloud.callFunction({
      name:'myFunctions',
      config: {
        env: "cloud1-5gkp8gvb02539afe"
      },
      data:{
        type:'getDianZanByOpenId',
        openId:wx.getStorageSync('openId'),
      }
    }).then(resp => {
      this.setData({postIdList:resp.result.data})
     this.getPostListById(resp.result.data);
    }).catch((e) => {
      console.log(e);
    });
  },
  //根据点赞的postId获取postList
  async getPostListById(postIdList){
    var tmpPostList=[]
    for(var i=0;i<postIdList.length;i++){
      await wx.cloud.callFunction({
        name: 'myFunctions',
        config: {
          env: "cloud1-5gkp8gvb02539afe"
        },
        data: {
          type: 'getPostById',
          postId: postIdList[i].postId,
        }
      }).then(resp => {
        tmpPostList=tmpPostList.concat(resp.result.data[0])
      })
    }
    this.setData({
      postList:tmpPostList
    })
    wx.hideLoading()
  },
  showPostInfo(e){
    console.log(e)
    wx.navigateTo({
      url: '../../showPost/showPost?postId='+e.currentTarget.id,
    })
  },
  showByCategory(e){
    wx.navigateTo({
      url: '../../classifyPost/classifyPost?category='+e.currentTarget.id,
    })
  },
  showByCampus(e){
    wx.navigateTo({
      url: '../../classifyPost/classifyPost?campus='+e.currentTarget.id,
    })
  },
  delete_dianzanpost(e){
    wx.cloud.callFunction({
      name: 'myFunctions',
      config: {
        env: "cloud1-5gkp8gvb02539afe"
      },
      data: {
        type: 'dealDianZan',
        method: '取消点赞',
        postId: this.data.postIdList[e.currentTarget.dataset.index].postId,
      }
    }).then(resp => {
      this.showMyDiaZan()
    })
  },
})