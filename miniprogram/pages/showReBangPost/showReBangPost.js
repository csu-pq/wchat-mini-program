Page({
  data: {
    postList:{},
  },

   onLoad: async function (options) {
    this.getReBangPost();
  },
  async getReBangPost(e){
    await wx.cloud.callFunction({
      name: 'myFunctions',
      config: {
        env: "cloud1-5gkp8gvb02539afe"
      },
      data: {
        type: 'dealReBang',
        name: '查找热榜',
      }
    }).then(resp => {
      this.setData({
        postList: resp.result.data
      })
    }).catch((e) => {
      console.log(e);
    });
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
  }
})