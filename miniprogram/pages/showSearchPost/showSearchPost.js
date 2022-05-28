Page({
  data: {
    postList:{},
  },
  seachResult(keyword){
    wx.cloud.callFunction({
      name:'myFunctions',
      config: {
        env: "cloud1-5gkp8gvb02539afe"
      },
      data:{
        type:'searchPost',
        keyword:keyword,
      }
    }).then(resp => {
      console.log(resp)
      this.setData({
        postList:resp.result.data
      })
    }).catch((e) => {
      console.log(e);
    });
  },
  showPostInfo(e){
    wx.navigateTo({
      url: '../showPost/showPost?postId='+e.currentTarget.id,
    })
  },
  showByCategory(e){
    wx.navigateTo({
      url: '../classifyPost/classifyPost?category='+e.currentTarget.id,
    })
  },
  showByCampus(e){
    wx.navigateTo({
      url: '../classifyPost/classifyPost?campus='+e.currentTarget.id,
    })
  },
  onLoad: function (options) {
    this.seachResult(options.keyword)
  },
})