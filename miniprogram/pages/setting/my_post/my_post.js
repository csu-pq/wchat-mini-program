const { $Message } = require('../../../dist/base/index');
Page({
  data: {
    postList: {},
    hasUserInfo: false,
  },
  onLoad: function (options) {
    this.setData({
      hasUserInfo: wx.getStorageSync('hasUserInfo')
    })
    if (this.data.hasUserInfo) {
      this.showMyPost()
    }
  },
  showMyPost(e) {
    wx.showLoading({
      title: '',
    })
    wx.cloud.callFunction({
      name: 'myFunctions',
      config: {
        env: "cloud1-5gkp8gvb02539afe"
      },
      data: {
        type: 'getPostByOpenId',
        openId: wx.getStorageSync('openId'),
      }
    }).then((resp) => {
      this.setData({
        postList: resp.result.data
      })
    }).catch((e) => {
      console.log(e);
    });
    wx.hideLoading()
  },
  showPostInfo(e) {
    console.log(e)
    wx.navigateTo({
      url: '../../showPost/showPost?postId=' + e.currentTarget.id,
    })
  },
  showByCategory(e) {
    wx.navigateTo({
      url: '../../classifyPost/classifyPost?category=' + e.currentTarget.id,
    })
  },
  showByCampus(e) {
    wx.navigateTo({
      url: '../../classifyPost/classifyPost?campus=' + e.currentTarget.id,
    })
  },
  delete_post(e){
    var that=this;
    console.log(e)
    wx.cloud.callFunction({
      name: 'myFunctions',
      config: {
        env: "cloud1-5gkp8gvb02539afe"
      },
      data: {
        type: 'deletePostByPostId',
        postId:e.currentTarget.id,
      }
    }).then((resp) => {
      that.showMyPost();
    }).catch((e) => {
      console.log(e);
    });
  },
})