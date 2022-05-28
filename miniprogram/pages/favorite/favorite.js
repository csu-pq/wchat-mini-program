Page({
  data: {
    intervalNumber: '',
    hasUserInfo: false,
    postList: [],
    postIdList: [],
  },
  //每次进入页面刷新，获取收藏
  async resfreshFavPost(e) {
    wx.showLoading({
      title: '',
    })
    await wx.cloud.callFunction({
      name: 'myFunctions',
      config: {
        env: "cloud1-5gkp8gvb02539afe"
      },
      data: {
        type: 'getFavPostIdByOpenId',
      }
    }).then(resp => {
      this.setData({ postIdList: resp.result.data });
      this.getPostListById(resp.result.data);
    }).catch((e) => {
      console.log(e);
    });
  },
  //根据收藏的postId获取postList
  async getPostListById(postIdList) {
    var tmpPostList = []
    for (var i = 0; i < postIdList.length; i++) {
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
        tmpPostList = tmpPostList.concat(resp.result.data[0])
      })
    }
    this.setData({
      postList: tmpPostList
    })
    wx.hideLoading()
  },

  showPostInfo(e) {
    wx.navigateTo({
      url: '../showPost/showPost?postId=' + e.currentTarget.id,
    })
  },
  showByCategory(e) {
    wx.navigateTo({
      url: '../classifyPost/classifyPost?category=' + e.currentTarget.id,
    })
  },
  showByCampus(e) {
    wx.navigateTo({
      url: '../classifyPost/classifyPost?campus=' + e.currentTarget.id,
    })
  },
  onShow: function () {
    this.setData({ hasUserInfo: wx.getStorageSync('hasUserInfo') });
    if (this.data.hasUserInfo) {
      this.resfreshFavPost();
      //定时获取消息数量并提示
      this.setData({
        intervalNumber: setInterval(this.getMsgNum, 1000)
      })
    }
  },
  onPullDownRefresh: function () {
    this.onShow();
  },
  getMsgNum(e) {
    //获取未读数
    wx.cloud.callFunction({
      name: 'myFunctions',
      config: {
        env: "cloud1-5gkp8gvb02539afe"
      },
      data: {
        type: 'getMsgNum',
        openId: wx.getStorageSync('openId')
      }
    }).then(resp => {
      if (resp.result.list.length != 0) {
        wx.setTabBarBadge({
          index: 3,
          text: resp.result.list[0].unReadNum.toString()
        })
      }
    }).catch((e) => {
      console.log(e);
    });
  },
  onHide: function () {
    clearInterval(this.data.intervalNumber);
  },
  delete_favpost(e) {
    wx.cloud.callFunction({
      name: 'myFunctions',
      config: {
        env: "cloud1-5gkp8gvb02539afe"
      },
      data: {
        type: 'dealFavorite',
        method: '取消收藏',
        postId: this.data.postIdList[e.currentTarget.dataset.index].postId,
      }
    }).then(resp => {
      this.resfreshFavPost();
    })
  }
})